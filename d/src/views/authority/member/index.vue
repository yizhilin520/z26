<template>
  <div class="container">
    <main class="main">
      <div class="film_search">
        <h3>成员筛选</h3>
        <el-form
          ref="ruleForm"
          class="searchForm"
          :model="ruleForm"
          :inline="true"
          status-icon
          label-width="100px"
          size="small"
        >
          <el-form-item label="成员账号">
            <el-input
              v-model="ruleForm.loginAccount"
              placeholder="请输入成员账号"
              clearable
            />
          </el-form-item>

          <el-form-item label="成员用户名">
            <el-input
              v-model="ruleForm.memberName"
              placeholder="请输入成员用户名"
              clearable
            />
          </el-form-item>

          <el-form-item label="成员角色">
            <el-select v-model="ruleForm.roleId" clearable>
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
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

      <div class="film_content">
        <div class="film_top">
          <h3>成员列表</h3>
          <div class="bar_right">
            <el-button
              icon="el-icon-plus"
              type="primary"
              size="small"
              @click="handleEdit(false)"
              >添加成员</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-document"
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
          :data="memberList"
          :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
          size="small"
          max-height="650"
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
            label="成员账号"
            prop="loginAccount"
            align="center"
          />
          <el-table-column
            label="成员用户名"
            prop="memberName"
            align="center"
          />
          <el-table-column
            label="所属角色"
            align="center"
            :formatter="formatterRoles"
          />
          <el-table-column label="添加时间" prop="createTime" align="center" />
          <el-table-column
            label="最后登录"
            prop="lastLoginTime"
            align="center"
          />
          <el-table-column align="center" label="是否启用">
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
            min-width="100"
            label="操作"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                class="btn_change_handle"
                size="mini"
                type="primary"
                :disabled="scope.row.valided"
                @click="handleEdit(true, scope.row)"
                >编辑</el-button
              >

              <el-button
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
          :fetchData="() => getFetchData()"
          :handleScroll="handleScroll"
        />
      </div>
    </main>
    <div />
    <!-- 添加、编辑 -->
    <edit-member :show="isEdit" ref="member" />
  </div>
</template>
<script>
import pagination from "@/components/paginations";
import editMember from "./modal/editMember";
import { exportExcel } from "@/utils/exportExcel";
import {
  queryEmployeeInfoList,
  selectRoleList,
  doValidEmployee,
  deleteEmployee,
  exportEmployeeInfoList
} from "@/api/authority_api";
export default {
  name: "Member",
  components: {
    pagination,
    editMember
  },
  data() {
    return {
      rolesList: [],
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      loading: false,
      ruleForm: {
        loginAccount: "",
        roleId: "",
        memberName: ""
      },
      memberList: [],
      isEdit: false,
      isDisabled: false
    };
  },
  mounted() {
    this.getFetchData();
    this.getSelectRoleList();
  },
  methods: {
    //获取列表
    getFetchData() {
      let params = {
        ...this.ruleForm,
        pageNo: this.pages.pageNum,
        pageSize: this.pages.pageSize
      };
      queryEmployeeInfoList({ ...params })
        .then(res => {
          if (res.code * 1 === 200) {
            const { pageNum, pageSize, total, list } = res.data;
            this.pages = {
              pageNum,
              pageSize,
              total: Number(total)
            };
            this.memberList = list;
          }
        })
        .catch(() => {});
    },
    // 下拉框
    getSelectRoleList() {
      selectRoleList()
        .then(res => {
          if (res.code * 1 === 200) {
            this.rolesList = res.data;
          }
        })
        .catch(() => {});
    },
    // 角色转换
    formatterRoles(row) {
      return this.rolesList.length > 0 &&
        this.rolesList.find(item => item.id === row.belongRole)
        ? this.rolesList.find(item => item.id === row.belongRole).name
        : "";
    },
    // 编辑、添加
    handleEdit(bool, item) {
      this.isEdit = true;
      this.$refs.member.isEdit = bool;
      if (bool) {
        let {
          loginAccount,
          memberName,
          remarksMessage,
          employId,
          belongRole
        } = item;
        this.$refs.member.userForm = {
          loginAccount,
          memberName,
          employId,
          remarksMessage,
          belongRole
        };
      } else {
        this.$refs.member.userForm = {
          loginAccount: "",
          memberName: "",
          employId: "",
          loginPassWord: "",
          confirmPassWord: "",
          remarksMessage: "",
          belongRole: ""
        };
      }
    },
    // 删除公告
    handleDelete(row) {
      this.$confirm("确认要删除该成员吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          deleteEmployee({ id: row.employId })
            .then(res => {
              if (res.code * 1 === 200) {
                if (this.memberList.length === 1 && this.pages.pageNum > 1)
                  this.pages.pageNum -= 1;
                this.getFetchData();
              }
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    // switch
    handleSwitch(row) {
      doValidEmployee({ id: row.employId, isValid: row.isValid })
        .then(res => {
          if (res.code * 1 === 200) this.getFetchData();
        })
        .catch(() => {});
    },
    // 导出
    async handleExport() {
      let params = {
        ...this.ruleForm,
        pageNo: this.pages.pageNum,
        pageSize: this.pages.pageSize
      };
      let res = await exportEmployeeInfoList({ ...params });
      if (res.code * 1 === 200 && res.data !== null) {
        let i = 0;
        while (i < res.data.length) {
          res.data[i].isValid = res.data[i].isValid ? "启用" : "封禁";
          res.data[i].employId = this.formatterRoles(res.data[i]);
          i++;
        }
        let tHeader = [
          "成员账号",
          "成员用户名",
          "所属角色",
          "添加时间",
          "最后登录",
          "是否启用"
        ];
        let filterVal = [
          "loginAccount",
          "memberName",
          "employId",
          "createTime",
          "lastLoginTime",
          "isValid"
        ];
        let filename = "成员列表明细";
        this.isDisabled = true;
        exportExcel(res.data, tHeader, filterVal, filename);
        this.timer = setTimeout(() => {
          this.isDisabled = false;
        }, 2000);
      } else {
        this.$message.error("导出失败");
      }
    },
    // 查询
    handleSearch() {
      this.getFetchData();
    },
    // 重置
    handleReset() {
      this.ruleForm = {
        loginAccount: "",
        roleId: "",
        memberName: ""
      };
      // Object.assign(this.$data, this.$options.data());
      this.getFetchData();
    },
    handleScroll() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";
</style>
