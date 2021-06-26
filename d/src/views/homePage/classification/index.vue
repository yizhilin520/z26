<template>
  <div class="container">
    <main class="main">
      <div class="film_content">
        <div class="film_top">
          <h3>视频筛选</h3>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="handleNewAdd"
            >新增分类</el-button
          >
        </div>
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="list"
          :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
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
            label="序号"
            align="center"
            width="60"
            type="index"
          />
          <el-table-column label="分类名称" prop="name" align="center" />

          <el-table-column
            label="状态"
            align="center"
            :formatter="formatterStatus"
          >
          </el-table-column>
          <el-table-column label="影片数" prop="moveNum" align="center">
          </el-table-column>
          <el-table-column label="上架时间" align="center" prop="createTime">
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
                :disabled="!scope.row.status && scope.row.moveNum*1 === 0"
                @click="handleShelf(scope.row)"
                >{{ !scope.row.status ? "上架" : "下架" }}</el-button
              >
              <el-button
                class="btn_change_handle"
                size="mini"
                type="primary"
                @click="handleRelated(scope.row)"
                >影片关联</el-button
              >
              <el-button
                class="btn_change_handle"
                size="mini"
                :disabled="scope.row.status"
                @click="handleDelete(scope.row)"
                :type="!scope.row.status ? 'danger' : 'info'"
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
    <!-- 新增分类 -->
    <newAddClass :show="isAdd" />
    <!-- 影片关联 -->
    <related :show="isAss" :getList="handleRelated" ref="related" />
  </div>
</template>
<script>
import pagination from "@/components/paginations";
import newAddClass from "./modal/newAddClass.vue";
import related from "./modal/related.vue";
import { getTableData } from "@/utils/index";
import {
  categoryList,
  deleteCategory,
  RelatedList,
  updateStatus
} from "@/api/home_api";

export default {
  name: "Classification",
  components: { pagination, newAddClass, related },
  data() {
    return {
      loading: false,
      list: [],
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      childPages: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      status: {
        false: "已屏蔽",
        true: "展示中"
      },
      isAdd: false,
      isShelf: false,
      isAss: false,
      assData: {},
      array: []
    };
  },
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
      categoryList({ ...params })
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
    },
    //   上下架
    handleShelf(row) {
      if (row.moveNum*1 === 0) return;
      // this.isShelf = true;
      if (!row.status) {
        this.$confirm(
          `该分类下有 <span style="color: #2EB5F0">${
            row.moveNum
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
            this.handleUpdateStatue(row);
          })
          .catch(() => {});
      } else {
        this.$confirm(
          `该分类下有 <span style="color: #2EB5F0">${
            row.moveNum
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
            this.handleUpdateStatue(row);
          })
          .catch(() => {});
      }
    },
    handleUpdateStatue(row) {
      updateStatus({ sid: row.sid, status: !row.status })
        .then(res => {
          if (res.code * 1 === 200) {
            this.fetchData();
          }
        })
        .catch(e => console.error(e));
    },
    // 影片关联
    handleRelated(row) {
      this.isAss = true;
      this.$refs["related"].rowData = row;
      let { pageNum, pageSize } = this.$refs["related"].pages;
      RelatedList({
        categoryId: row.sid,
        pageNum,
        pageSize
      })
        .then(res => {
          if (res.code * 1 === 200) {
            let { no, yes } = res.data;
            this.array = [...no, ...yes];
            let { page, pageSize, data, length } = getTableData(
              pageNum,
              pageSize,
              this.array
            );
            this.$refs["related"].pages = {
              pageNum: page,
              pageSize,
              total: length * 1
            };
            this.$refs["related"].list = data;
            //多选回显
            this.$nextTick(() => {
              this.array.forEach(row => {
                  if (row.isRelated) {
                    this.$refs[
                      "related"
                    ].$refs.multipleTable.toggleRowSelection(row, true);
                  }
                });
            });
          } else {
            this.$refs["related"].list = [];
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    handleScroll() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
    },
    //删除
    handleDelete(row) {
      if (row.upStatus && row.association) return;
      this.$confirm(
        "该确认删除该分类吗？删除后该分类下关联的影片将进行释放",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true
        }
      )
        .then(() => {
          deleteCategory({ sid: row.sid })
            .then(res => {
              if (res.code * 1 === 200) {
                if (this.list.length === 1 && this.pages.pageNum > 1)
                  this.pages.pageNum -= 1;
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
}
.custom_table {
  //   box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  margin: 5px 0 20px 0;
}
</style>
