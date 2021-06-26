<template>
  <div class="container">
    <main class="main">
      <div class="film_search">
        <h3>交易筛选</h3>
        <div>
          <el-form :inline="true" :model="userForm">
            <el-form-item label="用户ID">
              <el-input
                v-model="userForm.userId"
                placeholder="请输入用户ID"
                clearable
              />
            </el-form-item>
            <el-form-item label="用户名">
              <el-input
                v-model="userForm.account"
                type="text"
                placeholder="请输入用户名"
                clearable
              />
            </el-form-item>
            <el-form-item label="用户昵称">
              <el-input
                v-model="userForm.nickname"
                type="text"
                placeholder="请输入用户昵称"
                clearable
              />
            </el-form-item>
            <el-form-item label="交易类型">
              <el-select v-model="userForm.type" clearable>
                <el-option
                  v-for="item in transTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="交易日期">
              <el-date-picker
                v-model="memberDate"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="handleSearch"
                >查询</el-button
              >
              <el-button
                type="success"
                icon="el-icon-delete-solid"
                size="small"
                @click="handleReset"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="film_content">
        <div class="film_top">
          <h3>交易列表</h3>
          <el-button
            type="primary"
            icon="el-icon-document"
            size="small"
            plain
            @click="handleExport"
            :loading="isDisabled"
            >导出</el-button
          >
        </div>
        <!-- 列表 -->
        <el-table
          ref="multipleTable"
          :data="list"
          v-loading="loading"
          :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
          size="small"
          show-overflow-tooltip
          element-loading-text="Loading"
          border
          max-height="570"
          tooltip-effect="dark"
          fit
          stripe
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          highlight-current-row
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="60"
          />
          <el-table-column label="交易流水号" prop="id" align="center" />
          <el-table-column label="用户ID" prop="userId" align="center" />
          <el-table-column align="center" label="用户名" prop="account" />
          <el-table-column label="用户昵称" align="center" prop="nickname" />
          <el-table-column
            label="交易类型"
            align="center"
            :formatter="formatterType"
          />
          <el-table-column
            label="具体事项"
            align="center"
            :formatter="formatterBalance"
          />
          <el-table-column
            label="金币数量（个）"
            align="center"
            prop="amount"
          />
          <el-table-column label="交易日期" align="center" prop="createTime" />
          <el-table-column
            label="账户金币余额（个）"
            prop="coinBalance"
            align="center"
            min-width="100"
          />
        </el-table>
        <!--分页组件-->
        <pagination
          :pages="pages"
          :fetchData="fetchData"
          :handleScroll="handleScroll"
        />
      </div>
    </main>
    <div />
  </div>
</template>

<script>
import pagination from "@/components/paginations";
import { accountDetailList, exportDetailList } from "@/api/account_api";
import { exportExcel } from "@/utils/exportExcel";

export default {
  name: "UserDetail",
  components: { pagination },
  data() {
    return {
      loading: false,
      userForm: {
        userId: "",
        account: "",
        nickname: "",
        type: "",
        startDate: "",
        endDate: "",
      },
      transTypeList: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "0",
          label: "收入",
        },
        {
          value: "1",
          label: "支出",
        },
      ],
      memberDate: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      list: [],
      isDisabled: false,
      timer: null,
      moneyType: {
        0: "购买金币",
        1: "购买金币",
        2: "购买金币",
        7: "开通会员",
      },
      amountType: {
        0: "收入",
        1: "支出",
      },
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    formatterType(row) {
      return this.amountType[row.type];
    },
    formatterBalance(row) {
      return this.moneyType[row.balanceType];
    },
    // 获取列表
    fetchData() {
      this.userForm = {
        ...this.userForm,
        startDate: this.memberDate ? this.memberDate[0] || "" : "",
        endDate: this.memberDate ? this.memberDate[1] || "" : "",
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
      };
      accountDetailList({ ...this.userForm })
        .then((res) => {
          if (res.code * 1 === 200) {
            let { total, pageNum, pageSize, list } = res.data;
            this.pages = {
              pageNum,
              pageSize,
              total: total * 1,
            };
            this.list = list;
          }
        })
        .catch((e) => console.error(e));
    },

    //查询
    handleSearch() {
      this.fetchData();
    },
    handleReset() {
      this.userForm = {
        userId: "",
        account: "",
        nickname: "",
        type: "",
        startDate: "",
        endDate: "",
      };
      this.memberDate = [];
      this.fetchData();
    },
    //导出
    async handleExport() {
      let params = {
        ...this.userForm,
        startDate: this.memberDate ? this.memberDate[0] || "" : "",
        endDate: this.memberDate ? this.memberDate[1] || "" : "",
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
      };
      let res = await exportDetailList({ ...params });
      res.data.forEach((it) => {
        it.balanceType = this.moneyType[it.balanceType];
        it.type = this.amountType[it.type];
      });
      if (res.code * 1 === 200 && res.data !== null) {
        let tHeader = [
          "交易流水号",
          "用户ID",
          "用户名",
          "用户昵称",
          "交易类型",
          "具体事项",
          "金币数量（个）",
          "交易日期",
          "账户金币余额（个）",
        ];
        let filterVal = [
          "id",
          "userId",
          "account",
          "nickname",
          "type",
          "balanceType",
          "amount",
          "createTime",
          "coinBalance",
        ];
        let filename = "用户交易明细";
        this.isDisabled = true;
        exportExcel(res.data, tHeader, filterVal, filename);
        this.timer = setTimeout(() => {
          this.isDisabled = false;
        }, 2000);
      } else {
        this.$message.error("导出失败");
      }
    },

    handleScroll() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
    },
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer);
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";
</style>
