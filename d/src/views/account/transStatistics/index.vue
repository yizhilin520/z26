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
          <h3>统计列表</h3>
          <el-button
            type="primary"
            icon="el-icon-document"
            size="small"
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
          <el-table-column label="用户ID" prop="userId" align="center" />
          <el-table-column align="center" label="用户名" prop="account" />
          <el-table-column label="用户昵称" align="center" prop="nickname" />
          <el-table-column
            label="抖币交易订单数"
            align="center"
            prop="goldCount"
          />
          <el-table-column
            label="累计充值（元）"
            align="center"
            prop="rechargeMoney"
          />
          <el-table-column
            label="累计充值次数"
            align="center"
            prop="rechargeCount"
          />
          <el-table-column
            label="累计获取抖币（个）"
            align="center"
            prop="gainGold"
          />
          <el-table-column
            label="累计支出抖币（个）"
            align="center"
            prop="outGold"
          />
          <el-table-column
            label="账户抖币余额"
            prop="balanceGold"
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
import { accountCountList, exportCountList } from "@/api/account_api";
import { exportExcel } from "@/utils/exportExcel";

export default {
  name: "TransStatistics",
  components: { pagination },
  data() {
    return {
      loading: false,
      userForm: {
        userId: "",
        account: "",
        nickname: ""
      },
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      list: [],
      isDisabled: false,
      timer: null
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    // 获取列表
    fetchData() {
      this.userForm = {
        ...this.userForm,
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      };
      accountCountList({ ...this.userForm })
        .then(res => {
          if (res.code * 1 === 200) {
            let { total, pageNum, pageSize, list } = res.data;
            this.pages = {
              pageNum,
              pageSize,
              total: total * 1
            };
            this.list = list;
          }
        })
        .catch(e => console.error(e));
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
        nickname: ""
      };
      this.fetchData();
    },
    //导出
    async handleExport() {
      let params = {
        ...this.userForm,
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      };
      let res = await exportCountList({ ...params });
      if (res.code * 1 === 200 && res.data !== null) {
        let tHeader = [
          "用户ID",
          "用户名",
          "用户昵称",
          "抖币交易订单数",
          "累计充值（元）",
          "累计充值次数",
          "累计获取抖币（个）",
          "累计支出抖币（个）",
          "账户抖币余额"
        ];
        let filterVal = [
          "userId",
          "account",
          "nickname",
          "goldCount",
          "rechargeMoney",
          "rechargeCount",
          "gainGold",
          "outGold",
          "balanceGold"
        ];
        let filename = "用户交易统计";
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
    }
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer);
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";
</style>
