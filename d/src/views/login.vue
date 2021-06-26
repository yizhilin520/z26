<template>
  <div class="login">
    <div class="mask"></div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      label-position="left"
      label-width="0px"
      class="login-form"
    >
      <h3 class="title">抖动后台管理系统</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="账号"
          clearable
        >
          <svg-icon
            slot="prefix"
            icon-class="user"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
          clearable
        >
          <svg-icon
            slot="prefix"
            icon-class="password"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <!-- <el-form-item prop="code">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
          clearable
        >
          <svg-icon
            slot="prefix"
            icon-class="validCode"
            class="el-input__icon input-icon"
          />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" />
        </div>
      </el-form-item> -->
      <el-checkbox
        v-model="loginForm.rememberMe"
        style="margin: 0 0 25px 0;color:#fff;"
      >
        记住我
      </el-checkbox>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { encrypt } from "@/utils/rsaEncrypt";
import Config from "@/settings";
// import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import md5 from "js-md5";
export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      cookiePass: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false
        // code: "",
        // uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    // 获取验证码
    // this.getCode();
    // 获取用户名密码等Cookie
    this.getCookie();
    // token 过期提示
    // this.point();
  },
  methods: {
    // getCode() {
    //   getCodeImg().then(res => {
    //     this.codeUrl = res.img;
    //     this.loginForm.uuid = res.uuid;
    //   });
    // },
    getCookie() {
      const uname = Cookies.get("uname");
      let passWord = Cookies.get("passWord");
      const rememberMe = Cookies.get("rememberMe1");
      this.cookiePass = passWord === undefined ? "" : passWord;
      passWord =
        passWord === undefined
          ? this.loginForm.password === ""
            ? this.loginForm.password
            : md5(this.loginForm.password)
          : passWord;
      this.loginForm = {
        username: uname === undefined ? this.loginForm.username : uname,
        password: passWord,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
        // code: ""
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        const user = {
          userName: this.loginForm.username,
          passWord: this.loginForm.password,
          rememberMe: this.loginForm.rememberMe
          // code: this.loginForm.code,
          // uuid: this.loginForm.uuid
        };
        if (user.passWord !== this.cookiePass) {
          user.passWord = md5(user.passWord);
        }
        if (valid) {
          this.loading = true;
          if (user.rememberMe) {
            Cookies.set("uname", user.userName, {
              expires: Config.passCookieExpires
            });
            Cookies.set("passWord", user.passWord, {
              expires: Config.passCookieExpires
            });
            Cookies.set("rememberMe1", user.rememberMe, {
              expires: Config.passCookieExpires
            });
          } else {
            Cookies.remove("uname");
            Cookies.remove("passWord");
            Cookies.remove("rememberMe1");
          }

          let params = {
            userName: user.userName,
            passWord: user.passWord
          };
          this.$store
            .dispatch("user/Login", params)
            .then(() => {
              this.loading = false;
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.loading = false;
              // this.getCode();
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
    //   point() {
    //     const point = Cookies.get("point") !== undefined;
    //     if (point) {
    //       this.$notify({
    //         title: "提示",
    //         message: "当前登录状态已过期，请重新登录！",
    //         type: "warning",
    //         duration: 5000
    //       });
    //       Cookies.remove("point");
    //     }
    //   }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  // background: rgba(56, 157, 170, 0.82);
  background: url("~@/assets/images/bgp.png") top center no-repeat;
  // background-size: 100% 100%;
  object-fit: contain;
}
.title {
  margin: 0 auto 30px auto;
  text-align: center;
  color: #fff;
}
.mask {
  background: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.login-form {
  border-radius: 12px;
  background: rgba(21, 20, 20, 0.3);
  width: 400px;
  padding: 30px 30px 20px 30px;
  position: absolute;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;
  // float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
</style>
