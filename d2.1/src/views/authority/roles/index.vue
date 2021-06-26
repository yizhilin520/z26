<template>
  <div class="container">
    <main class="main">
      <div class="film_content">
        <div class="film_top">
          <h3>角色列表</h3>
          <div>
            <el-button
              type="primary"
              icon="el-icon-plus"
              plain
              @click="editRoles(false)"
              >添加角色</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-document"
              plain
              @click="handleExport"
              :loading="isDisabled"
              >导出</el-button
            >
          </div>
        </div>
        <!-- 列表 -->
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="rolesList"
          :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
          size="small"
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
          <el-table-column label="角色" prop="name" align="center" />
          <el-table-column label="职能描述" prop="description" align="center" />
          <el-table-column label="成员数量" prop="num" align="center" />
          <el-table-column
            label="添加时间"
            min-width="130"
            prop="createTime"
            align="center"
          />
          <el-table-column label="是否启用" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isValid"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="handleSwitch(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            min-width="150"
            label="操作"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                @click="handleAuthor(scope.row)"
                >权限设置</el-button
              >
              <el-button
                size="mini"
                type="primary"
                @click="editRoles(true, scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
              <!-- @click="_deleteRole(scope.row.id, scope.$index)" -->
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination
          :pages="pages"
          :fetchData="() => getFetchData()"
          :handleScroll="handleScroll"
        />
      </div>
    </main>
    <div />
    <!-- 添加、编辑角色 -->
    <edit-roles :show="isEditRoles" :title="title" ref="edit_role" />
    <!-- 修改权限 -->
    <edit-author :show="isEditAuthor" ref="edit_author" />
  </div>
</template>

<script>
import pagination from "@/components/paginations";
import editRoles from "./modal/editRoles";
import editAuthor from "./modal/editAuthor";
import {
  queryRoleList,
  doValid,
  deleteRoles,
  queryExportRoleList,
} from "@/api/authority_api";
import { mapGetters, mapActions } from "vuex";
import { exportExcel } from "@/utils/exportExcel";
export default {
  name: "Roles",
  components: { pagination, editRoles, editAuthor },
  data() {
    return {
      loading: false,
      rolesList: [],
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      isEditRoles: false,
      isEditAuthor: false,
      title: "",
      isDisabled: false,
      parentIds: [],
    };
  },
  computed: {
    ...mapGetters(["roles", "menusList", "allMenus"]),
  },
  mounted() {
    this.getFetchData();
  },
  methods: {
    ...mapActions("roles", ["getAllMenus"]),
    //列表
    getFetchData() {
      let { pageNum, pageSize } = this.pages;
      queryRoleList({ pageNo: pageNum, pageSize: pageSize })
        .then((res) => {
          if (res.code * 1 === 200) {
            const { pageNum, pageSize, total, list } = res.data;
            this.pages = {
              pageNum,
              pageSize,
              total: Number(total),
            };
            this.rolesList = list;
          }
        })
        .catch(() => {});
    },
    // 添加、编辑角色
    editRoles(bool, row) {
      this.isEditRoles = true;
      this.$refs["edit_role"].isEdit = bool;
      if (bool) {
        this.title = "编辑角色";
        this.$refs["edit_role"].userForm = {
          name: row.name,
          description: row.description,
          id: row.id,
        };
      } else {
        this.title = "添加角色";
        this.$refs["edit_role"].userForm = {
          name: "",
          description: "",
        };
      }
    },
    // 修改权限
    async handleAuthor(item) {
      this.$refs["edit_author"].id = item.id;
      if (this.allMenus.length > 0) {
        this.handleArray(item);
      } else {
        await this.getAllMenus();
        this.handleArray(item);
      }
      this.isEditAuthor = true;
    },
    // 处理数组
    handleArray(item) {
      this.$refs["edit_author"].dataList = this.allMenus.map((item) => {
        let children = item.list.map((it) => {
          return {
            id: it.id,
            label: it.title,
          };
        });
        return {
          id: item.id,
          label: item.title,
          children,
        };
      });
      this.parentIds = [];
      item.menu = item.menu.filter((it) => it.list.length > 0);
      this.$refs["edit_author"].defaultKeys = item.menu
        .map((item) => {
          let arr = item.list.map((it) => {
            return it.id;
          });
          this.parentIds.push(item.id)
          return [...arr];
        })
        .flat();
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确定删除该角色吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          deleteRoles({ id: row.id })
            .then((res) => {
              if (res.code * 1 === 200) {
                if (this.rolesList.length === 1 && this.pages.pageNum > 1)
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
    },
    // 修改开关
    handleSwitch(row) {
      doValid({ id: row.id, isValid: row.isValid })
        .then((res) => {
          if (res.code * 1 === 200) this.getFetchData();
        })
        .catch(() => {});
    },
    // 导出
    async handleExport() {
      let res = await queryExportRoleList();
      if (res.code * 1 === 200 && res.data !== null) {
        let i = 0;
        while (i < res.data.length) {
          res.data[i].isValid = res.data[i].isValid ? "启用" : "封禁";
          i++;
        }
        let tHeader = ["角色", "职能描述", "成员数量", "添加时间", "是否启用"];
        let filterVal = ["name", "description", "num", "createTime", "isValid"];
        let filename = "角色列表明细";
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
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";
.a_circle {
  border-radius: 50%;
}
</style>
