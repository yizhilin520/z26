<template>
  <div class="container">
    <main class="main">
      <div class="film_search">
        <h3>用户筛选</h3>
        <div>
          <el-form
            :inline="true"
            :model="form"
            class="demo-form-inline searchForm"
          >
            <el-form-item label="用户名">
              <el-input
                v-model="form.account"
                clearable
                placeholder="请输入用户名"
              />
            </el-form-item>

            <el-form-item label="用户类型">
              <el-select v-model="form.userType" clearable>
                <el-option
                  v-for="item in userTypeOptions"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="用户状态">
              <el-select v-model="form.onlineStatus" clearable>
                <el-option
                  v-for="item in userStatusOptions"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="注册日期">
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
            <el-form-item label="昵称">
              <el-input
                v-model="form.nickname"
                clearable
                placeholder="请输入昵称"
              />
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="form.sex" clearable>
                <el-option
                  v-for="item in sexOptions"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="用户ID">
              <el-input
                v-model="form.userId"
                clearable
                placeholder="请输入用户ID"
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
          <h3>用户列表</h3>
          <div class="bar_right" v-show="isExport">
            <el-button
              type="primary"
              icon="el-icon-document"
              size="small"
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
          :data="userList"
          :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
          size="small"
          show-overflow-tooltip
          element-loading-text="Loading"
          border
          max-height="550"
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
            width="50"
            label="序号"
          />
          <el-table-column
            align="center"
            prop="id"
            label="用户ID"
            min-width="120"
          />
          <el-table-column label="头像" align="center">
            <template slot-scope="scope">
              <el-avatar
                class="a_circle"
                :size="50"
                fit="fit"
                :src="scope.row.headImage"
              >
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column label="用户名" prop="account" align="center" />
          <el-table-column label="昵称" prop="nickname" align="center" />
          <el-table-column
            label="性别"
            align="center"
            width="100"
            :formatter="sexFormatter"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.sex * 1 === 1
                  ? "女"
                  : scope.row.sex * 1 === 0
                  ? "男"
                  : "——"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="用户类型"
            width="100"
            align="center"
            :formatter="userTypeformatter"
          />
          <el-table-column label="用户状态"  width="100" align="center">
            <template slot-scope="scope">
              <span>{{
                scope.row.onlineStatus * 1 === 1
                  ? "在线"
                  : scope.row.onlineStatus * 1 === 0
                  ? "——"
                  : ""
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            min-width="100"
            label="注册日期"
            align="center"
          />
          <el-table-column align="center" prop="goldNumber" label="抖币余额（个）" />
          <el-table-column prop="balance" label="金币余额（个）" align="center" />
          <el-table-column prop="sumRecharge" label="金币充值总额（个）" align="center" />
          <el-table-column
            align="center"
            min-width="140"
            fixed="right"
            prop="created_at"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button size="mini" @click="handleBlock(scope.row)">{{
                scope.row.isValid ? "封杀" : "解封"
              }}</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.row)"
                >详情</el-button
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
          :fetchData="() => fetchUserList()"
          :handleScroll="handleScroll"
        />
      </div>
    </main>
    <div />
    <!-- 查看详情 -->
    <edit-modal :show="isEdit" ref="checkView"></edit-modal>
  </div>
</template>

<script>
import {
  getQueryUserList,
  deleteUser,
  editUpdateStatus,
  isHaveExportPower,
  queryExportList
} from "@/api/user_api";
import pagination from "@/components/paginations";
import editModal from "../component/editModal";
import { exportExcel } from "@/utils/exportExcel";

export default {
  name: "UserList",
  components: { pagination, editModal },
  data() {
    return {
      loading: false,
      form: {
        account: "",
        userType: "",
        nickname: "",
        sex: "",
        userId: "",
        onlineStatus: "",
        startTime: "",
        endTime: ""
      },
      userTypeOptions: [
        {
          key: "",
          value: "全部"
        },
        { key: 0, value: "普通用户" },
        { key: 1, value: "抖动会员" },
        { key: 2, value: "封禁用户" }
      ],
      userStatusOptions: [
        { key: "", value: "全部" },
        { key: 1, value: "在线用户" },
        { key: 0, value: "非在线用户" }
      ],
      sexOptions: [
        {
          key: "",
          value: "全部"
        },
        { key: 0, value: "男" },
        { key: 1, value: "女" }
      ],
      defaultImg: require("@/assets/images/d_avatar@2x.png"),
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
      },
      userList: [],
      isEdit: true,
      itemData: null,
      isExport: false,
      isDisabled: false,
      timer: null
    };
  },
  mounted() {
    Promise.all[(this.fetchUserList(), this.getIsHaveExportPower())];
  },
  methods: {
    // 判断用户是否有权限导出
    getIsHaveExportPower() {
      isHaveExportPower()
        .then(res => {
          if (Number(res.code) === 200) {
            this.isExport = res.data;
          }
        })
        .catch(() => {});
    },
    //获取列表数据
    fetchUserList(data) {
      let params = {
        ...this.form,
        startTime: this.uploadDate[0] || "",
        endTime: this.uploadDate[1] || "",
        pageNo: this.pages.pageNum,
        pageSize: this.pages.pageSize
      };
      params = Object.assign(params, data);
      getQueryUserList({ ...params })
        .then(res => {
          if (Number(res.code) === 200) {
            let { pageNum, pageSize, total, list } = res.data;
            this.pages = {
              pageNum: pageNum,
              pageSize: pageSize,
              total: Number(total)
            };
            this.userList = list;
          }
        })
        .catch(() => {});
    },
    sexFormatter(row) {
      let obj = {};
      this.sexOptions.map(it => {
        obj[it.key] = it.value;
      });
      return obj[row.sex];
    },
    userTypeformatter(row) {
      let obj = {};
      this.userTypeOptions.map(it => {
        obj[it.key] = it.value;
      });
      return obj[row.userType];
    },
    // 封杀/解封
    handleBlock(data) {
      let context = "";
      let title = "";
      if (data.isValid) {
        context = "确认对该用户进行封禁吗？封禁后该用户不可再进行登录";
        title = "封杀用户";
      } else {
        context = "确认解封该用户吗？解封后该用户可以重新进行登录";
        title = "解封用户";
      }
      this.$confirm(context, title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          editUpdateStatus({ id: data.id, isValid: data.isValid })
            .then(res => {
              if (Number(res.code) === 200) this.fetchUserList();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    // delete
    handleDelete(item) {
      this.$confirm("确认删除该用户吗？删除后该用户此账号不可再登录抖动，并且该用户下所有的账号信息都将清除。", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          this.deleteItem(item);
        })
        .catch(() => {});
    },
    // 删除接口
    deleteItem(item) {
      deleteUser({ ids: item.id })
        .then(res => {
          if (Number(res.code) === 200) {
            if (this.userList.length === 1 && this.pages.pageNum > 1)
              this.pages.pageNum -= 1;
            this.fetchUserList();
          }
        })
        .catch(() => {});
    },
    // 查看详情
    handleEdit(item) {
      this.itemData = item;
      this.isEdit = true;
      this.$refs.checkView.childFetchData();
    },
    // 导出
    async handleExport() {
      let params = {
        ...this.form,
        startTime: this.uploadDate[0] || "",
        endTime: this.uploadDate[1] || "",
        pageNo: this.pages.pageNum,
        pageSize: this.pages.pageSize
      };
      let res = await queryExportList({ ...params });
      if (res.code * 1 === 200 && res.data !== null) {
        let i = 0;
        while (i < res.data.length) {
          res.data[i].sex = this.sexFormatter(res.data[i]);
          res.data[i].onlineStatus = this.formatterOnline(res.data[i]);
          res.data[i].userType = this.userTypeformatter(res.data[i]);
          i++;
        }

        let tHeader = [
          "用户ID",
          "用户名",
          "昵称",
          "性别",
          "用户类型",
          "用户状态",
          "注册日期",
          "抖币余额（个）",
          "金币余额（个）",
          "金币充值总额（个）",
        ];
        let filterVal = [
          "id",
          "account",
          "nickname",
          "sex",
          "userType",
          "onlineStatus",
          "createTime",
          "goldNumber",
          "balance",
          "sumRecharge",
        ];
        let filename = "用户列表明细";
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
      this.fetchUserList();
    },
    //重置
    handleReset() {
      Object.assign(this.$data, this.$options.data());
      this.fetchUserList();
    },
    handleScroll() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
    }
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer);
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";
.a_circle {
  border-radius: 50%;
 >>> img{
    width: 100%;
    height: 100%;
  }
}
</style>
