<template>
  <div class="container">
    <main class="main">
      <div class="film_search">
        <h3>标签筛选</h3>
        <div>
          <el-form
            ref="ruleForm"
            class="searchForm"
            style="padding-top: 20px;"
            :model="ruleForm"
            :inline="true"
            status-icon
            label-width="100px"
          >
            <el-form-item label="标签名称">
              <el-input
                v-model="ruleForm.labelName"
                show-word-limit
                placeholder="请输入标签名称"
                clearable
              />
            </el-form-item>

            <el-form-item :style="{ marginLeft: '20px' }">
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="handleSearch"
                >查询</el-button
              >
            </el-form-item>
            <el-form-item :style="{ marginLeft: '20px' }">
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
          <h3>标签词列表</h3>
          <div class="bar_right">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              @click="handleAddLabel"
              >添加标签</el-button
            >
          </div>
        </div>
        <!-- 列表 -->
        <el-table
          ref="multipleTable"
          :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
          size="mini"
          :data="lists"
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
            label="序号"
            type="index"
            align="center"
            width="80"
          />
          <el-table-column
            label="标签词"
            show-overflow-tooltip
            prop="name"
            align="center"
          />
          <el-table-column label="是否启用" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.is_enable"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="handleChangeSwitch(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            min-width="100"
            label="操作"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                class="btn_change_handle"
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination
          :pages="pages"
          :fetchData="() => fetchData()"
          :handleScroll="handleScroll"
        />
      </div>
    </main>
    <div />
    <add-label :show="isShow" />
  </div>
</template>

<script>
import { videoLabelList, delLabel, modifyLabel } from "@/api/label_api";
import addLabel from "./modal/addLabel";
import pagination from "@/components/paginations";
export default {
  name: "LabelList",
  components: { pagination, addLabel },
  data() {
    return {
      ruleForm: {
        labelName: ""
      },
      isShow: false,
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      lists: []
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    //初始化列表
    fetchData() {
      let params = {
        labelName: this.ruleForm.labelName,
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      };
      videoLabelList({ ...params })
        .then(res => {
          if (Number(res.code) === 200) {
            let { total, list } = res.data;
            this.pages.total = Number(total);
            this.lists = list;
          }
        })
        .catch(() => {});
    },
    // 开关
    handleChangeSwitch(row) {
      let params = {
        labelId: row.id,
        enable: row.is_enable
      };
      modifyLabel({ ...params })
        .then(res => {})
        .catch(() => {});
    },
    // 添加标签
    handleAddLabel() {
      this.isShow = true;
    },
    // 查询
    handleSearch() {
      if (this.ruleForm.labelName === "") return;
      this.fetchData();
    },
    // 重置
    handleReset() {
      this.ruleForm.labelName = "";
      this.fetchData();
    },

    // 删除
    handleDelete(row) {
      this.$confirm("确认删除该标签词汇吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          this.deleteRow(row);
        })
        .catch(() => {});
    },
    // 删除
    deleteRow(it) {
      delLabel({ labelId: it.id })
        .then(res => {
          if (Number(res.code) === 200) {
            if (this.lists.length === 1 && this.pages.pageNum > 1)
              this.pages.pageNum -= 1;
            this.fetchData();
          }
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
.a_circle {
  border-radius: 50%;
}
</style>
