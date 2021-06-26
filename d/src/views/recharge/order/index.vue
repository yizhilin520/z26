<template>
  <div class="container">
    <main class="main">
      <div class="film_search">
        <h3>订单筛选</h3>
        <div>
          <el-form :inline="true" :model="userForm">
            <el-form-item label="充值订单号">
              <el-input
                v-model.trim="userForm.id"
                clearable
                placeholder="请输入充值订单号"
              />
            </el-form-item>
            <el-form-item label="第三方订单号">
              <el-input
                v-model.trim="userForm.reqOrderId"
                type="text"
                clearable
                placeholder="请输入第三方订单号"
              />
            </el-form-item>
            <el-form-item label="用户名">
              <el-input
                v-model.trim="userForm.account"
                clearable
                type="text"
                placeholder="请输入用户名"
              />
            </el-form-item>

            <el-form-item label="充值日期">
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
          <h3>订单列表</h3>
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
          <el-table-column label="充值订单号" prop="id" align="center" />
          <el-table-column align="center" label="用户名" prop="userName" />
          <el-table-column label="充值方式" align="center" prop="payChannel" />
          <el-table-column
            label="充值金额（元）"
            align="center"
            prop="amount"
          />
          <el-table-column
            label="第三方订单号"
            align="center"
            prop="reqOrderId"
          />
          <el-table-column label="状态" align="center" :formatter="formatterStatus" />
          <el-table-column label="充值时间" prop="createTime" align="center" />
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
import { getOrderList, orderExportList } from "@/api/recharge_api";
import pagination from "@/components/paginations";
import { exportExcel } from "@/utils/exportExcel";

export default {
  name: "Order",
  components: { pagination },
  data() {
    return {
      loading: false,
      userForm: {
        id: "",
        account: "",
        reqOrderId: "",
        startDate: "",
        endDate: "",
      },
      memberDate: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      reqStatus: {
        0: "创建订单支付中",
        1: "成功",
        2: "失败",
      },
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
  },
  methods: {
    formatterStatus(row) {
      return this.reqStatus[row.reqStatus]
    },
    fetchData() {
      let params = {
        ...this.userForm,
        startDate: this.memberDate[0] || "",
        endDate: this.memberDate[1] || "",
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
      };
      getOrderList(params)
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
      let res = await orderExportList({ ...params });
      if (res.code * 1 === 200 && res.data !== null) {
        res.data.forEach(it => {
          it.reqStatus = this.reqStatus[it.reqStatus]
        })
        let tHeader = [
          "充值订单号",
          "用户名",
          "充值方式",
          "充值金额（元）",
          "第三方订单号",
          "状态",
          "充值时间"
        ];
        let filterVal = [
          "id",
          "userName",
          "payChannel",
          "amount",
          "reqOrderId",
          "reqStatus",
          "createTime",
        ];
        let filename = "充值订单明细";
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
        id: "",
        account: "",
        reqOrderId: "",
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
