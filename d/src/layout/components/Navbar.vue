<template>
  <div class="navbar">
    <!-- <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
      :style="{ width: oWidth }"
    /> -->

    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->

    <logo />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <!-- <el-tooltip content="项目文档" effect="dark" placement="bottom">
          <Doc class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <el-tooltip content="全屏缩放" effect="dark" placement="bottom">
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
        </el-tooltip>

        <!-- <el-tooltip content="布局设置" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
      </template>
      <div class="username">
        <span>{{ uname }}</span>
      </div>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img
            :src="
              user.avatarName ? baseApi + '/avatar/' + user.avatarName : Avatar
            "
            class="user-avatar"
          />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <span style="display:block;" @click="show = true">
            <el-dropdown-item>
              布局设置
            </el-dropdown-item>
          </span> -->
          <!-- <router-link to="/user/center">
            <el-dropdown-item>
              个人中心
            </el-dropdown-item>
          </router-link> -->
          <span style="display:block;" @click="open">
            <el-dropdown-item divided>
              退出登录
            </el-dropdown-item>
          </span>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import Breadcrumb from '@/components/Breadcrumb'
import Logo from "./Sidebar/Logo";
import Hamburger from "@/components/Hamburger";
import Doc from "@/components/Doc";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import Avatar from "@/assets/images/avatar@3x.png";
import Cookies from "js-cookie";

export default {
  components: {
    // Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    Doc,
    Logo
  },
  data() {
    return {
      Avatar: Avatar,
      dialogVisible: false,
      uname: ""
    };
  },
  computed: {
    ...mapGetters(["sidebar", "device", "user", "baseApi"]),
    show: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val
        });
      }
    },
    oWidth() {
      return this.sidebar.opened ? "220px" : "54px";
    }
  },
  mounted() {
    this.uname =
      Cookies.get("uname") || Cookies.get("userName");
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    open() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.logout();
        })
        .catch(err => {
          console.log(err);
        });
    },
    logout() {
      this.$store.dispatch("user/LogOut").then(() => {
        location.reload();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  line-height: 60px;
  overflow: hidden;
  position: relative;
  // background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  background-image: linear-gradient(90deg, #2e8fe8, #1dabfe);
  .hamburger-container {
    padding: 0 !important;
    line-height: 50px;
    background: #b4d7c8;
    height: 50px;
    margin-top: 5px;
    text-align: center;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    // &:hover {
    //   background: rgba(0, 0, 0, 0.1);
    // }
    // &::after {
    //   content: "";
    //   position: absolute;
    //   top: 0px;
    //   left: 0;
    //   width: 100%;
    //   // left: 54px;
    //   height: 60px;
    //   border-right: 1px solid #e5dbdb;
    // }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .username {
    margin: 0 5px;
  }

  .right-menu {
    height: 100%;
    line-height: 60px;
    color: #fff;
    display: flex;
    margin-right: 20px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    >>> .svg-icon {
      color: #fff;
    }

    .avatar-container {
      margin-right: 15px;

      .avatar-wrapper {
        position: relative;
        top: 10px;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
