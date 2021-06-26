<template>
  <el-dialog
    v-if="$parent.itemData"
    center
    :title="$parent.itemData.nickname"
    :visible.sync="show"
    class="dialog-style"
    width="60%"
    top="3vh"
    custom-class="custom-dialog my-dialog"
    :before-close="handleCancel"
    :close-on-click-modal="false"
  >
    <el-tag
      v-for="item in tagList"
      :key="item.name"
      :type="item.type"
      class="d_tag tag-active"
      @click="handleSetTag(item)"
      >{{ item.description }}</el-tag
    >
    <user-detail
      v-if="activeTag === 'userdetail'"
      :userInfo="userInfo"
      :permissionList="permissionList"
      :pages="pages"
      :list="list"
    >
      <template slot="pagination">
        <!--分页组件-->
        <pagination
          :pages="pages"
          :fetchData="() => fetchuserVideoList()"
          :handleScroll="handleScroll"
        />
      </template>
    </user-detail>
    <log v-else :pages="pages" :logList="logList">
      <template slot="log_pagination">
        <!--分页组件-->
        <pagination
          :pages="pages"
          :fetchData="() => fetchLogList()"
          :handleScroll="handleScroll"
        />
      </template>
    </log>
  </el-dialog>
</template>
<script>
import {
  userDetailsInfo,
  userPermissionList,
  userVideoList,
  userLoginLog,
} from "@/api/user_api";
import userDetail from "./userDetail";
import log from "./log";
import pagination from "@/components/paginations";

export default {
  components: {
    userDetail,
    log,
    pagination,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tagList: [
        {
          name: "userdetail",
          description: "用户详情",
          type: "success",
        },
        {
          name: "log",
          description: "启动日志",
          type: "",
        },
      ],
      activeTag: "userdetail",
      type: "success",
      userInfo: null,
      permissionList: [],
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      list: [],
      logList: [],
      isEvent: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$bus.$on("updateUserInfo", (data) => {
        this.isEvent = data;
        if (data) this.fetchUserDetail();
      });
      this.$bus.$on("updateImage", (data) => {
        this.isEvent = data;
        if (data) this.fetchUserDetail();
      });
    });
  },
  methods: {
    // 切换tag
    handleSetTag(item) {
      this.activeTag = item.name;
      if (item.name === "log") {
        this.fetchLogList();
      } else {
        this.childFetchData();
      }
      this.tagList.forEach((cop) => {
        if (cop.name === item.name) {
          cop.type = "success";
        } else {
          cop.type = "";
        }
      });
    },
    // 请求数据
    async childFetchData() {
      await Promise.all[
        (this.fetchUserDetail(),
        this.fetchPermissionList(),
        this.fetchuserVideoList())
      ];
    },
    // 用户详情
    fetchUserDetail() {
      userDetailsInfo({ id: this.$parent.itemData.id })
        .then((res) => {
          if (Number(res.code) === 200) {
            this.userInfo = res.data;
          } else {
            this.userInfo = null;
          }
        })
        .catch(() => {});
    },
    fetchPermissionList() {
      userPermissionList({ id: this.$parent.itemData.id })
        .then((res) => {
          if (Number(res.code) === 200) {
            this.permissionList = res.data;
          } else {
            this.permissionList = [];
          }
        })
        .catch(() => {});
    },
    fetchuserVideoList() {
      userVideoList({
        id: this.$parent.itemData.id,
        pageNo: this.pages.pageNum,
        pageSize: this.pages.pageSize,
      })
        .then((res) => {
          if (Number(res.code) === 200) {
            let { pageNum, pageSize, total, list } = res.data;
            this.pages = {
              pageNum,
              pageSize,
              total: Number(total),
            };
            this.list = list;
          }
        })
        .catch(() => {});
    },
    // 日志列表
    fetchLogList() {
      userLoginLog({
        id: this.$parent.itemData.id,
        pageNo: this.pages.pageNum,
        pageSize: this.pages.pageSize,
      })
        .then((res) => {
          if (Number(res.code) === 200) {
            let { pageNum, pageSize, total, list } = res.data;
            this.pages = {
              pageNum,
              pageSize,
              total: Number(total),
            };
            this.logList = list;
          }
        })
        .catch(() => {});
    },
    //取消弹窗
    handleCancel() {
      this.$parent.isEdit = false;
      this.activeTag = "userdetail";
      this.tagList.filter((it) =>
        it.name === "userdetail" ? (it.type = "success") : (it.type = "")
      );
      if (this.isEvent) this.$parent.fetchUserList();
      this.isEvent = false
    },
    handleScroll() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
    },
  },
  destroyed() {
    this.$bus.$off();
  },
};
</script>
<style lang="scss" scoped>
.d_tag {
  cursor: pointer;
  text-align: center;
}
.tag-active {
  margin-bottom: 20px;
}
.tag-active + .tag-active {
  margin-left: 20px;
}
>>> .el-dialog {
  .el-dialog__body {
    overflow: auto;
    max-height: 90vh;
    .userdetails-container {
      max-height: none;
    }
  }
}
</style>
