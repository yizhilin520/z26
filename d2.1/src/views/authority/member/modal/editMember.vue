<template>
  <el-dialog
    title="成员"
    :destroy-on-close="true"
    :visible.sync="show"
    width="50%"
    custom-class="my-dialog"
    center
    :before-close="handleCancel"
  >
    <div class="form_box">
      <el-form
        ref="ruleForm"
        :model="userForm"
        :rules="rules"
        status-icon
        label-width="100px"
      >
        <el-form-item label="登录账号" prop="loginAccount">
          <el-input
            v-model="userForm.loginAccount"
            placeholder="请输入登录账号"
            :readonly="isEdit ? true : false"
            type="text"
          />
        </el-form-item>
        <el-form-item label="成员姓名" prop="memberName">
          <el-input
            v-model="userForm.memberName"
            placeholder="请输入成员姓名"
            clearable
            type="text"
          />
        </el-form-item>
        <el-form-item label="所属角色" prop="belongRole">
          <el-select v-model="userForm.belongRole" clearable>
            <el-option
              v-for="item in $parent.rolesList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="修改密码">
          <el-input
            v-model="userForm.loginPassWord"
            placeholder="非必填"
            type="password"
            clearable
          />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassWord">
          <el-input
            v-model="userForm.confirmPassWord"
            placeholder="非必填"
            type="password"
            clearable
          />
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input
            v-model="userForm.remarksMessage"
            type="textarea"
            clearable
            :rows="5"
            :autosize="{ minRows: 5, maxRows: 8 }"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { addEmployee, updateEmployee } from "@/api/authority_api";
import md5 from "js-md5";
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let checkpwd = (rule, value, callback) => {
      if (value !== this.userForm.loginPassWord) {
        return callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      userForm: {
        loginAccount: "",
        memberName: "",
        employId: "",
        loginPassWord: "",
        confirmPassWord: "",
        remarksMessage: "",
        belongRole: ""
      },
      isEdit: false,
      rules: {
        loginAccount: [
          { required: true, message: "登录账号不能为空", trigger: "blur" }
        ],
        memberName: [
          { required: true, message: "成员姓名不能为空", trigger: "blur" }
        ],
        belongRole: [
          { required: true, message: "所属角色不能为空", trigger: "blur" }
        ],
        confirmPassWord: [{ validator: checkpwd, trigger: "blur" }]
      }
    };
  },
  mounted() {},
  methods: {
    handleSubmit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.userForm.loginPassWord = this.userForm.loginPassWord
            ? md5(this.userForm.loginPassWord)
            : "";
          this.userForm.confirmPassWord = this.userForm.confirmPassWord
            ? md5(this.userForm.confirmPassWord)
            : "";
          this.isEdit
            ? updateEmployee({ ...this.userForm })
                .then(res => {
                  if (res.code * 1 === 200) {
                    this.handleCancel();
                    this.$parent.getFetchData();
                  }
                })
                .catch(() => {})
            : addEmployee({ ...this.userForm })
                .then(res => {
                  if (res.code * 1 === 200) {
                    this.handleCancel();
                    this.$parent.getFetchData();
                  }
                })
                .catch(() => {});
        } else {
          return false;
        }
      });
    },
    //取消弹窗
    handleCancel() {
      this.$parent.isEdit = false;
      this.$refs["ruleForm"].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.form_box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
>>> .el-input__inner,
>>> .el-textarea__inner {
  width: 300px;
}
</style>
