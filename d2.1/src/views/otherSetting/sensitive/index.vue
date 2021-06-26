<template>
  <div class="container">
    <main class="main">
      <div class="film_search sensitive">
        <el-form
          ref="ruleForm"
          class="searchForm"
          :model="ruleForm"
          :inline="true"
          status-icon
          label-width="100px"
          size="small"
        >
          <el-form-item label="添加敏感词">
            <el-input v-model="ruleForm.name" clearable />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-check"
              size="small"
              @click="handleSubmit"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
        <el-form
          ref="ruleForm"
          class="searchForm"
          :model="searchForm"
          :inline="true"
          status-icon
          label-width="100px"
          size="small"
        >
          <el-form-item label="查询敏感词">
            <el-input
              v-model="searchForm.name"
              clearable
              @clear="() => getFetchData()"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="() => getFetchData()"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <div class="film_content">
        <div class="film_top">
          <h3>敏感词列表</h3>
        </div>
        <!-- 列表 -->
        <el-table
          ref="multipleTable"
          :data="accountList"
          :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
          size="small"
          max-height="540"
          show-overflow-tooltip
          element-loading-text="Loading"
          border
          tooltip-effect="dark"
          fit
          stripe
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          highlight-current-row
        >
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="80px"
          />
          <el-table-column align="center" prop="sensitiveWord" label="敏感词" />
          <el-table-column
            align="center"
            fixed="right"
            prop="created_at"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :pages="pages"
          :fetchData="getFetchData"
          :handleScroll="handleScroll"
        />
      </div>
    </main>
    <div />
  </div>
</template>
<script>
import {
  sensitiveWordList,
  addSensitiveWord,
  delSensitiveWord
} from "@/api/otherSetting_api";
import pagination from "@/components/paginations";
export default {
  name: "Sensitive",
  components: { pagination },
  data() {
    return {
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      loading: false,
      ruleForm: {
        name: ""
      },
      searchForm: {
        name: ""
      },
      accountList: []
    };
  },
  mounted() {
    this.getFetchData();
  },
  methods: {
    //获取列表
    getFetchData() {
      let params = {
        sensitiveWord: this.searchForm.name,
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      };
      sensitiveWordList({ ...params })
        .then(res => {
          if (Number(res.code) === 200) {
            let { total, pageNum, pageSize, list } = res.data;
            this.pages = {
              pageNum,
              pageSize,
              total: total * 1
            };
            this.accountList = list;
          }
        })
        .catch(() => {});
    },
    // 提交
    handleSubmit() {
      if (this.ruleForm.name === "") return;
      addSensitiveWord({ sensitiveWord: this.ruleForm.name })
        .then(res => {
          res.code * 1 === 200 &&
            (this.getFetchData(), (this.ruleForm.name = ""));
        })
        .catch(() => {});
    },
    // 删除公告
    handleDelete(item) {
      this.$confirm("确认要删除该敏感词吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          delSensitiveWord({ id: item.id })
            .then(res => {
              if (res.code * 1 === 200) {
                if (this.accountList.length === 1 && this.pages.pageNum > 1)
                  this.pages.pageNum -= 1;
                this.getFetchData();
              }
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    handleScroll() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";

.film_search {
  padding: 40px 0 25px 10px !important;
}
</style>
