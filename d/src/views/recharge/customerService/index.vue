<template>
  <div class="container">
    <main class="main">
      <div class="film_search">
        <div class="form_box">
          <h2 class="title">充值客服QQ号设置</h2>
          <el-form
            ref="form"
            :model="form"
            class="demo-ruleForm"
            :rules="rules"
          >
            <el-form-item prop="qq">
              <el-input
                v-model.number="form.qq"
                placeholder="请输入QQ号"
                clearable
                :style="{ width: '300px' }"
              />
            </el-form-item>
          </el-form>
          <el-button
            type="primary"
            size="large"
            class="btn"
            @click="handleSubmit"
            >确定</el-button
          >
        </div>
      </div>
    </main>
    <div />
  </div>
</template>
<script>
import { updateQQ, getSelectQQ } from "@/api/recharge_api";
export default {
  name: "CustomerService",
  components: {},
  data() {
    let checkqq = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("QQ号不能为空"));
      } else if (!Number.isInteger(value)) {
        callback(new Error("请输入整数"));
      } else {
        callback();
      }
    };
    return {
      form: {
        qq: "",
      },
      rules: {
        qq: [{ required: true, validator: checkqq, trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.getCustomServiceQQ();
  },
  methods: {
    getCustomServiceQQ() {
      getSelectQQ()
        .then((res) => {
          if (res.code * 1 === 200) this.form.qq = res.data.value || "";
        })
        .catch(() => {});
    },
    handleSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          updateQQ({ value: this.form.qq })
            .then((res) => {
              if (res.code * 1 === 200) {
                this.getCustomServiceQQ()
                //  this.$refs["form"].resetFields();
              }
            })
            .catch((e) => console.error(e));
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
  padding: 30px 50px !important;
}
.film_search {
  padding: 50px 60px 60px !important;
}
.film_search:hover {
  box-shadow: none !important;
}
.title {
  line-height: 2;
}
.form_box {
  display: flex;
  //   justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 220px;
  width: 60%;
  margin: 0 auto;
  text-align: center;
}
>>> .el-input {
  line-height: 4;
  .el-input__inner {
    height: 45px;
  }
}
.btn {
  width: 300px;
}
</style>
