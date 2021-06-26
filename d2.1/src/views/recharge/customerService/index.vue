<template>
  <div class="container">
    <main class="main">
      <div class="film_content">
        <div class="film_top">
          <h3>客服列表</h3>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            plain
            @click="handleAddServicer(false)"
            >添加客服</el-button
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
            width="100"
            align="center"
          />
          <el-table-column label="QQ号码" prop="qq" align="center" />
          <el-table-column label="添加日期" prop="createTime" align="center" />
          <el-table-column label="添加人员" prop="account" align="center" />
          <el-table-column
            align="center"
            min-width="130"
            label="操作"
            fixed="right"
          >
            <template slot-scope="scope">
              <div class="btns_box">
                <el-button
                  type="primary"
                  class="btn"
                  size="mini"
                  @click="handleAddServicer(true, scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  class="btn"
                  type="danger"
                  @click="handleDelete(scope.row.id)"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <add-servicer :show="isAdd" ref="addqq" />
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
import { getQQList, deleteQQ } from "@/api/recharge_api";
import pagination from "@/components/paginations";
import AddServicer from "./components/AddServicer";
export default {
  name: "CustomerService",
  components: { pagination, AddServicer },
  data() {
    return {
      list: [],
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      isAdd: false,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    formatterStatus(row) {
      return this.reqStatus[row.reqStatus];
    },
    fetchData() {
      let params = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
      };
      getQQList(params)
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
    handleAddServicer(bool, row) {
      this.isAdd = true;
      this.$refs["addqq"].isEdit = bool;
      if (bool) {
        let { id, qq } = row;
        this.$refs["addqq"].form = {
          id,
          qq,
        };
      } else {
        this.$refs["addqq"].form = {
          id: "",
          qq: "",
        };
      }
    },
    handleDelete(id) {
      this.$confirm(
        "确认要删除该充值客服吗？删除后前端不显示该客服的号码",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true,
        }
      )
        .then(() => {
          deleteQQ({id})
            .then((res) => {
              if (res.code * 1 === 200) {
                this.fetchData();
              }
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    handleScroll() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";
</style>
