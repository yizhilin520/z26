<template>
  <div class="container">
    <main class="main">
      <div class="film_search">
        <h3>意见筛选</h3>
        <div>
          <el-form
            :inline="true"
            :model="form"
            class="demo-form-inline searchForm"
            size="small"
          >
            <el-form-item label="意见类型">
              <el-select v-model="form.type">
                <el-option
                  v-for="item in feedbackList"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="反馈日期">
              <el-date-picker
                v-model="uploadDate"
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
          <h3>意见列表</h3>
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
          <el-table-column align="center" type="index" label="序号" />
          <el-table-column label="用户名" prop="account" align="center" />
          <el-table-column label="用户昵称" prop="nickname" align="center" />
          <el-table-column
            label="意见类型"
            align="center"
            :formatter="formatterType"
          />
          <el-table-column
            prop="createTime"
            min-width="100"
            label="反馈日期"
            align="center"
          />
          <el-table-column
            align="center"
            prop="content"
            min-width="180"
            label="反馈内容"
          />
        </el-table>
        <!--分页组件-->
        <pagination :pages="pages" :fetchData="fetchData" :handleScroll="handleScroll"/>
      </div>
    </main>
    <div />
  </div>
</template>

<script>
import { feedBackList } from "@/api/feedBack_api";
import pagination from "@/components/paginations";
export default {
  name: "FeedbackList",
  components: { pagination },
  data() {
    return {
      loading: false,
      form: {
        type: "",
        startDate: "",
        endDate: ""
      },
      feedbackList: [
        { key: "", value: "全部" },
        { key: "0", value: "功能缺陷" },
        { key: "1", value: "用户体验" },
        { key: "2", value: "其他" }
      ],
      list: [],
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      uploadDate: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    formatterType(row) {
      let obj = {};
      this.feedbackList.map(it => {
        obj[it.key] = it.value;
      });
      return obj[row.type];
    },
    fetchData() {
      let params = {
        type: this.form.type,
        startDate: this.uploadDate[0] || "",
        endDate: this.uploadDate[1] || "",
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      };
      feedBackList({ ...params })
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
    handleSearch() {
      this.fetchData();
    },
    handleReset() {
      this.form = {
        type: "",
        startDate: "",
        endDate: ""
      };
      this.uploadDate = [];
      this.fetchData();
    },
    handleScroll() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";
.a_circle {
  border-radius: 50%;
}
</style>
