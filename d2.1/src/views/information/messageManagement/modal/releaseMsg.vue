<template>
  <el-dialog
    title="消息发布"
    :destroy-on-close="true"
    :visible.sync="show"
    width="50%"
    class="dialog-style my-dialog"
    center
    :before-close="handleCancel"
  >
    <div class="form_box">
      <el-form
        ref="ruleForm"
        :model="form"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="发送平台" prop="originType">
          <el-select v-model="form.originType">
            <el-option
              v-for="item in optionsList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              placeholder="请选择发送平台"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="用户名"
          prop="userName"
          v-show="form.originType === '2'"
        >
          <div class="username_box">
            <el-input
              class="username_input"
              v-model="form.userName"
              clearable
              placeholder="请输入用户名"
            />
          </div>
          <p v-show="checkbox" style="font-size: 12px">
            仅为此单个用户发送消息
          </p>
        </el-form-item>
        <el-form-item label="消息标题" prop="title">
          <el-input
            v-model="form.title"
            minlength="1"
            maxlength="30"
            show-word-limit
            type="textarea"
            clearable
            placeholder="请输入消息标题"
            rows="2"
          />
        </el-form-item>
        <el-form-item label="消息内容" prop="context">
          <el-input
            v-model="form.context"
            minlength="1"
            maxlength="500"
            show-word-limit
            type="textarea"
            clearable
            placeholder="请输入消息内容"
            rows="4"
          />
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleCancel">取 消</el-button>
      <el-button type="primary" size="small" @click="publishMessage()"
        >发布</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { publishMessage } from "@/api/message_api";
import { Message } from "element-ui";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    optionsList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      form: {
        originType: "-1",
        userName: "",
        title: "",
        context: "",
      },
      checkbox: false,
    };
  },
  mounted() {},
  methods: {
    //取消弹窗
    handleCancel() {
      this.$refs["ruleForm"].resetFields();
      this.$parent.isRelease = false;
      this.checkbox = false;
    },
    // 发布
    publishMessage() {
      let data = { ...this.form };
      if (!data.title || !data.context) {
        Message.warning({
          message: "标题或者内容不能为空！",
          duration: 2000,
        });
        return false;
      }
      if (this.form.originType === "2") {
        if (!data.userName) {
          Message.warning({
            message: "用户名不能为空！",
            duration: 2000,
          });
          return false;
        }
      }
      publishMessage(data)
        .then((res) => {
          if (+res.code === 200) {
            this.$parent.getMessageList();
            this.handleCancel();
          }
        })
        .catch(() => {
          this.$parent.isRelease = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.form_box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.username_box {
  @extend .form_box;
  flex-direction: row;
  justify-content: space-between;
  width: 250px;
}
.username_input {
  width: 250px;
  >>> .el-input__inner {
    width: 100% !important;
  }
}
>>> .el-input__inner,
>>> .el-textarea__inner {
  width: 250px;
}
p {
  margin: 0;
  padding: 0;
}
</style>
