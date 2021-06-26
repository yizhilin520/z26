<template>
  <div class="container">
    <main class="main">
      <div class="film_search">
        <h3>订单筛选</h3>
        <div>
          <el-form
            :inline="true"
            :model="userForm"
            class="demo-form-inline searchForm"
            size="small"
          >
            <el-form-item label="用户ID">
              <el-input
                v-model="userForm.authorId"
                placeholder="请输入用户ID"
              />
            </el-form-item>
            <el-form-item label="用户名">
              <el-input
                v-model="userForm.account"
                type="text"
                placeholder="请输入用户名"
              />
            </el-form-item>
            <el-form-item label="用户昵称">
              <el-input
                v-model="userForm.nickname"
                type="text"
                placeholder="请输入用户昵称"
              />
            </el-form-item>

            <el-form-item label="开通日期">
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
          max-height="650"
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
          <el-table-column label="会员订单号" prop="id" align="center" />
          <el-table-column label="用户ID" prop="userId" align="center" />
          <el-table-column align="center" label="用户名" prop="account" />
          <el-table-column label="用户昵称" align="center" prop="nickname" />
          <el-table-column label="会员类型" prop="name" align="center" />
          <el-table-column
            label="会员时长"
            :formatter="formatterDuration"
            align="center"
          />
          <el-table-column
            label="会员开通日期"
            prop="createTime"
            align="center"
          />
          <el-table-column
            label="会员截止日期"
            align="center"
            prop="expireTime"
          />
          <el-table-column
            label="赠送抖币（个）"
            align="center"
            prop="amount"
          />
          <el-table-column label="操作人" prop="operator" align="center" />
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
import { memberUserList, memberUserExport } from "@/api/member_api";
import pagination from "@/components/paginations";
import { exportExcel } from "@/utils/exportExcel";
export default {
  name: "Usertime",
  components: { pagination },
  data() {
    return {
      loading: false,
      userForm: {
        authorId: "",
        account: "",
        startDate: "",
        endDate: "",
        nickname: "",
      },
      durations: {
        30: "一个月",
        90: "三个月",
        360: "一年",
        0: "永久",
      },
      memberDate: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      list: [],
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      isDisabled: false,
      timer: null,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    formatterDuration(row) {
      return this.durations[row.duration];
    },
    // 获取列表
    fetchData() {
      this.userForm = {
        ...this.userForm,
        startDate: this.memberDate[0] || "",
        endDate: this.memberDate[1] || "",
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
      };
      memberUserList({ ...this.userForm })
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
    // 重置
    handleReset() {
      this.userForm = {
        authorId: "",
        account: "",
        nickname: "",
        startDate: "",
        endDate: "",
      };
      this.memberDate = [];
      this.fetchData();
    },
    handleScroll() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
    },
    //导出
    async handleExport() {
      let params = {
        ...this.userForm,
        startDate: this.memberDate ? this.memberDate[0] : "",
        endDate: this.memberDate ? this.memberDate[1] : "",
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
      };
      let res = await memberUserExport({ ...params });
      res.data.forEach((it) => (it.duration = this.formatterDuration(it)));
      if (res.code * 1 === 200 && res.data !== null) {
        let tHeader = [
          "会员订单号",
          "用户ID",
          "用户名",
          "用户昵称",
          "会员类型",
          "会员时长",
          "会员开通日期",
          "会员截止日期",
          "赠送抖币（个）",
          "操作人",
        ];
        let filterVal = [
          "id",
          "userId",
          "account",
          "nickname",
          "name",
          "duration",
          "createTime",
          "expireTime",
          "amount",
          "operator",
        ];
        let filename = "会员订单明细";
        this.isDisabled = true;
        exportExcel(res.data, tHeader, filterVal, filename);
        this.timer = setTimeout(() => {
          this.isDisabled = false;
        }, 2000);
      } else {
        this.$message.error("导出失败");
      }
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
