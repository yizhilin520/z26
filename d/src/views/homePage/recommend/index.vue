<template>
  <div class="container">
    <main class="main">
      <div class="film_content">
        <!-- <div class="step1">
          <h3>推荐界面设置</h3>
          <div class="table_1">
            <el-table
              ref="multipleTable"
              v-loading="loading"
              :data="setList"
              :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
              show-overflow-tooltip
              element-loading-text="Loading"
              border
              max-height="450"
              tooltip-effect="dark"
              fit
              stripe
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              highlight-current-row
              class="custom_table"
            >
              <el-table-column label="分类名称" prop="name" align="center" />

              <el-table-column label="状态" prop="status" align="center">
              </el-table-column>
              <el-table-column label="影片数" prop="movies" align="center">
              </el-table-column>
              <el-table-column
                align="center"
                min-width="130"
                label="操作"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    class="btn_change_handle"
                    size="mini"
                    :type="!scope.row.upStatus ? 'success' : 'info'"
                    @click="handleShelf(scope.row)"
                    >{{ !scope.row.upStatus ? "上架" : "下架" }}</el-button
                  >
                  <el-button
                    class="btn_change_handle"
                    size="mini"
                    type="primary"
                    @click="handleRelated(scope.row)"
                    >{{ scope.row.association ? "影片关联" : "" }}</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div> -->
        <div class="step2">
          <div class="header">
            <h3 class="header_title">其他分类展示</h3>
            <div class="header_btn">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                @click="handleNewAdd"
                >新增分类</el-button
              >
            </div>
          </div>
          <div class="table_1">
            <el-table
              ref="multipleTable"
              v-loading="loading"
              :data="list"
              :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
              show-overflow-tooltip
              element-loading-text="Loading"
              border
              max-height="900"
              tooltip-effect="dark"
              fit
              stripe
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              highlight-current-row
              class="custom_table"
            >
              <el-table-column label="分类名称" prop="name" align="center" />

              <el-table-column
                label="状态"
                :formatter="formatterStatus"
                align="center"
              >
              </el-table-column>
              <el-table-column label="影片数" prop="movNum" align="center" />
              <el-table-column
                align="center"
                min-width="130"
                label="操作"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    class="btn_change_handle"
                    size="mini"
                    :disabled="!scope.row.status && scope.row.movNum == 0"
                    @click="handleShelf(scope.row)"
                    >{{ !scope.row.status ? "上架" : "下架" }}</el-button
                  >

                  <el-button
                    class="btn_change_handle"
                    size="mini"
                    @click="handleDelete(scope.row)"
                    :disabled="
                      scope.row.status && scope.row.movNum > 0 ? true : false
                    "
                    type="danger"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </main>
    <!-- 新增分类 -->
    <newAddClass :show="isAdd" ref="add" />
    <!-- 影片关联 -->
    <!-- <related :show="isAss" :data="assData" /> -->
  </div>
</template>
<script>
import {
  recommendList,
  deleteRecommend,
  optionList,
  recommendUpdate
} from "@/api/home_api";
import newAddClass from "./modal/newAddClass.vue";
export default {
  name: "Recommend",
  components: { newAddClass },
  data() {
    return {
      loading: false,
      setList: [
        {
          name: "抖动推荐",
          status: "展示中",
          movies: "0",
          association: true
        }
      ],
      list: [],
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 20
      },
      status: {
        false: "已屏蔽",
        true: "展示中"
      },
      isAdd: false,
      isShelf: false,
      isAss: false,
      assData: {}
    };
  },
  watch: {},
  mounted() {
    this.fetchData();
  },
  methods: {
    formatterStatus(row) {
      return this.status[row.status];
    },
    //获取影片关联列表
    fetchData() {
      let params = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      };
      recommendList({ ...params })
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
    // 新增分类
    handleNewAdd() {
      this.isAdd = true;
      optionList()
        .then(res => {
          if (res.code * 1 === 200) {
            this.$refs["add"].checkboxList = res.data;
          }
        })
        .catch(e => console.error(e));
    },
    // 影片关联
    handleRelated(row) {
      this.isAss = true;
      // this.assData = row;
    },
    //   上下架
    handleShelf(item) {
      if (item.movNum == 0) return;
      if (!item.status) {
        this.$confirm(
          `该分类下有 <span style="color: #2EB5F0">${
            item.movNum
          }</span> 个影片，确定上架该影片类型吗？`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            center: true,
            dangerouslyUseHTMLString: true
          }
        )
          .then(() => {
            this.handleUpdateStatue(item);
          })
          .catch(() => {});
      } else {
        this.$confirm(
          `该分类下有 <span style="color: #2EB5F0">${
            item.movNum
          }</span> 个影片，确定下架该影片类型吗？下架后前端用户不可见`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            center: true,
            dangerouslyUseHTMLString: true
          }
        )
          .then(() => {
            this.handleUpdateStatue(item);
          })
          .catch(() => {});
      }
    },
    handleUpdateStatue(row) {
      recommendUpdate({ id: row.id, status: !row.status })
        .then(res => {
          if (res.code * 1 === 200) {
            this.fetchData();
          }
        })
        .catch(e => console.error(e));
    },
    //删除
    handleDelete(row) {
      this.$confirm(
        "该确认删除该分类吗？删除后推荐界面将不可见该分类的视频",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true
        }
      )
        .then(() => {
          deleteRecommend({ id: row.id })
            .then(res => {
              if (res.code * 1 === 200) {
                this.fetchData();
              }
            })
            .catch(e => console.error(e));
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/style.scss";

.main {
  width: 100%;
  // padding: 20px 40px;
}
.film_content {
  min-height: 85vh !important;
  margin-top: 0 !important;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
}
.custom_table {
  //   box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  margin: 5px 0 20px 0;
}
</style>
