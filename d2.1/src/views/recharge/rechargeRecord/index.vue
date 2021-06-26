<template>
  <div class="container">
    <main class="main">
      <div class="film_search">
        <h3>充值记录筛选</h3>
        <div>
          <el-form :inline="true" :model="userForm">
            <el-form-item label="用户ID">
              <el-input
                v-model="userForm.userId"
                clearable
                placeholder="请输入用户ID"
              />
            </el-form-item>
            <el-form-item label="用户名">
              <el-input
                v-model="userForm.account"
                type="text"
                clearable
                placeholder="请输入用户名"
              />
            </el-form-item>
            <el-form-item label="充值方式">
              <el-select v-model="userForm.payChannel" clearable>
                <el-option
                  v-for="item in rechargeType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="发布日期">
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
          <h3>充值记录列表</h3>
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
          <el-table-column label="充值流水号" prop="rid" align="center" />
          <el-table-column label="充值订单号" prop="orderId" align="center" />
          <el-table-column label="用户ID" prop="userId" align="center" />
          <el-table-column align="center" label="用户名" prop="account" />
          <el-table-column label="用户昵称" align="center" prop="nickname" />
          <el-table-column label="充值方式" align="center" prop="payChannel" />
          <el-table-column
            label="充值金额（元）"
            align="center"
            prop="amount"
          />
          <el-table-column
            label="获得金币（个）"
            align="center"
            prop="giveGold"
          />
          <!-- <el-table-column
            label="赠送彩金（元）"
            align="center"
            prop="giveGold"
          /> -->
          <el-table-column label="充值日期" prop="createTime" align="center" />
          <el-table-column label="操作人" align="center" prop="createUser" />
        </el-table>
        <!--分页组件-->
        <pagination
          :pages="pages"
          :fetchData="fetchData"
          :handleScroll="handleScroll"
        />
      </div>
    </main>
  </div>
</template>

<script>
import { rechargeList, exportlist, rechargePayList } from "@/api/recharge_api";
import pagination from "@/components/paginations";
import { exportExcel } from "@/utils/exportExcel";

export default {
  name: "Order",
  components: { pagination },
  data() {
    return {
      loading: false,
      userForm: {
        userId: "",
        account: "",
        payChannel: null,
        startDate: "",
        endDate: "",
      },
      memberDate: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      rechargeType: [
        {
          value: null,
          label: "全部",
        },
        {
          value: 0,
          label: "客服",
        },
        // {
        //   value: 1,
        //   label: "支付宝",
        // },
        // {
        //   value: 2,
        //   label: "微信",
        // },
      ],
      list: [],
      isDisabled: false,
      timer: null,
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  mounted() {
    this.fetchData();
    this.getRechargePayList();
  },
  methods: {
    //获取充值方式
    getRechargePayList() {
      rechargePayList()
        .then((res) => {
          if (res.code * 1 === 200) {
            res.data.forEach((it) => {
              this.rechargeType.push({
                value: it.id,
                label: it.configName,
              });
            });
          }
        })
        .catch((err) => console.log(err));
    },
    fetchData() {
      let params = {
        ...this.userForm,
        startDate: this.memberDate[0] || "",
        endDate: this.memberDate[1] || "",
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
      };
      rechargeList({ ...params })
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
    //导出
    async handleExport() {
      let params = {
        ...this.userForm,
        startDate: this.memberDate[0] || "",
        endDate: this.memberDate[1] || "",
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
      };
      let res = await exportlist({ ...params });
      if (res.code * 1 === 200 && res.data !== null) {
        let tHeader = [
          "充值流水号",
          "充值订单号",
          "用户ID",
          "用户名",
          "用户昵称",
          "充值方式",
          "充值金额（元）",
          "获得金币（个）",
          "充值日期",
          "操作人",
        ];
        let filterVal = [
          "rid",
          "orderId",
          "userId",
          "account",
          "nickname",
          "payChannel",
          "amount",
          "giveGold",
          "createTime",
          "createUser",
        ];
        let filename = "充值记录明细";
        this.isDisabled = true;
        exportExcel(res.data, tHeader, filterVal, filename);
        this.timer = setTimeout(() => {
          this.isDisabled = false;
        }, 2000);
      } else {
        this.$message.error("导出失败");
      }
    },
    //查询
    handleSearch() {
      this.fetchData();
    },
    // 重置
    handleReset() {
      this.userForm = {
        userId: "",
        account: "",
        payChannel: null,
        startDate: "",
        endDate: "",
      };
      this.memberDate = [];
      this.fetchData();
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
