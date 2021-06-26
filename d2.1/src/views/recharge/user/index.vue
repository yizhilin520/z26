<template>
  <div class="container">
    <main class="main">
      <div class="film_search">
        <h3 class="title">客服充值</h3>
        <div class="form_box">
          <el-form
            ref="form"
            :model="form"
            label-width="150px"
            class="demo-ruleForm"
            :rules="rules"
          >
            <el-form-item label="用户名" prop="account">
              <el-input
                v-model="form.account"
                show-word-limit
                placeholder="请输入用户名"
                clearable
                :style="{ width: '300px' }"
              />
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickname">
              <el-input
                v-model="form.nickname"
                show-word-limit
                placeholder="请输入用户昵称"
                clearable
                :style="{ width: '300px' }"
              />
            </el-form-item>
            <el-form-item label="充值金额" prop="amount">
              <el-input
                v-model="form.amount"
                show-word-limit
                placeholder="请输入充值金额"
                clearable
                :style="{ width: '300px' }"
              />
              <span class="tip">注：1元人民币=1金币</span>
            </el-form-item>
          </el-form>
          <el-button type="primary" class="btn" @click="handleRecharge"
            >确认充值</el-button
          >
        </div>
      </div>
    </main>
    <div />
  </div>
</template>
<script>
import { userRecharge } from "@/api/recharge_api";
export default {
  name: "User",
  components: {},
  data() {
    let checkAmount = (rule, value, callback) => {
      if (value * 1 > 50000) {
        callback(new Error("充值最大金额不能超过5万"));
      } else {
        callback();
      }
    };
    return {
      form: {
        account: "",
        nickname: "",
        amount: "",
      },
      rules: {
        account: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        amount: [
          { required: true, message: "请输入充值金额", trigger: "blur" },
          { pattern: /^[1-9]\d*$/, message: "请输入整数", trigger: "blur" },
          { required: true, validator: checkAmount, trigger: "blur" },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    handleRecharge() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          userRecharge({ ...this.form })
            .then((res) => {
              if (res.code * 1 === 200) {
              }
            })
            .catch((e) => console.error(e))
            .finally(() => {
              this.form = {
                account: "",
                nickname: "",
                amount: "",
              };
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";

.main {
  padding: 30px 0px !important;
  width: 80%;
  margin: 0 auto;
}
.film_search {
  padding: 25px 20vw 20vh 20px !important;
}
>>> .el-table,
.h-edit {
  font-size: 15px !important;
}
>>> .el-table--small th,
>>> td {
  padding: 15px 0 !important;
}
.form_box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.btn {
  width: 150px;
  border-radius: 5px;
}
.tip {
  display: block;
  color: #aaaaaa;
}
.film_search:hover {
  box-shadow: none;
}
</style>
