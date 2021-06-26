<template>
  <el-dialog
    custom-class="my-dialog"
    center
    :title="title"
    width="50%"
    :visible.sync="show"
    :before-close="handleCancel"
  >
    <div class="form_box">
      <el-form
        ref="searchForm"
        :model="form"
        label-width="150px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item label="渠道名称" prop="channelName">
          <el-input
            v-model="form.channelName"
            maxlength="30"
            show-word-limit
            placeholder="请输入渠道名称"
            clearable
            type="textarea"
            :rows="3"
            :style="{ width: '300px' }"
          />
        </el-form-item>
        <el-form-item label="渠道url" prop="channelUrl">
          <el-input
            v-model="form.channelUrl"
            maxlength="120"
            show-word-limit
            placeholder="请输入渠道url"
            clearable
            type="textarea"
            :rows="3"
            :style="{ width: '300px' }"
          />
        </el-form-item>
        <el-form-item label="渠道人账号" prop="account">
          <el-input
            v-model="form.account"
            show-word-limit
            placeholder="请输入渠道人账号"
            clearable
            :style="{ width: '300px' }"
          />
        </el-form-item>
        <el-form-item label="环球体育icode">
          <el-input
            v-model="form.icode"
            show-word-limit
            placeholder="选填"
            clearable
            :style="{ width: '300px' }"
          />
        </el-form-item>
        <!-- <el-form-item label="iOS渠道下载地址" prop="iosUrl">
          <el-input
            v-model="form.iosUrl"
            show-word-limit
            placeholder="请输入iOS渠道下载地址"
            clearable
            maxlength="120"
            type="textarea"
            :rows="3"
            :style="{ width: '300px' }"
          />
        </el-form-item>
        <el-form-item label="安卓渠道下载地址" prop="azUrl">
          <el-input
            v-model="form.azUrl"
            show-word-limit
            placeholder="请输入安卓渠道下载地址"
            clearable
            maxlength="120"
            type="textarea"
            :rows="3"
            :style="{ width: '300px' }"
          />
        </el-form-item> -->
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="doCheckStatusOK('searchForm')"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { updateChannel, addChannel } from "@/api/channel_api";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    boolean: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    title() {
      return this.boolean ? "编辑渠道" : "添加渠道";
    },
  },
  data() {
    return {
      rules: {
        channelName: [
          { required: true, message: "渠道名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "长度在 1 到 30 个字符",
            trigger: "blur",
          },
        ],
        channelUrl: [
          { required: true, message: "渠道url不能为空", trigger: "blur" },
          {
            min: 1,
            max: 120,
            message: "长度在 1 到 120 个字符",
            trigger: "blur",
          },
        ],
        account: [
          { required: true, message: "渠道人账号不能为空", trigger: "blur" },
        ],
        iosUrl: [
          {
            required: true,
            message: "iOS渠道下载地址不能为空",
            trigger: "blur",
          },
        ],
        azUrl: [
          {
            required: true,
            message: "安卓渠道下载地址不能为空",
            trigger: "blur",
          },
        ],
      },
      form: {
        channelName: "",
        channelUrl: "",
        account: "",
        id: "",
        iosUrl: "",
        azUrl: "",
        icode: "",
      },
    };
  },
  mounted() {},
  methods: {
    //取消弹窗
    handleCancel() {
      this.$parent.showDialog = false;
      this.form = {
        channelName: "",
        channelUrl: "",
        account: "",
        id: "",
        iosUrl: "",
        azUrl: "",
        icode: "",
      };
    },
    doCheckStatusOK(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            channelName: this.form.channelName,
            channelUrl: this.form.channelUrl,
            account: this.form.account,
            id: this.form.id,
            iosUrl: this.form.iosUrl,
            azUrl: this.form.azUrl,
            icode: this.form.icode,
          };
          if (this.boolean) {
            updateChannel(data)
              .then((res) => {
                if (res.code === 200) {
                  this.$parent.fetchData();
                  this.$parent.showDialog = false;
                }
              })
              .catch(() => {
                this.$parent.showDialog = false;
              });
          } else {
            addChannel(data)
              .then((res) => {
                this.$parent.fetchData();
                this.$parent.showDialog = false;
              })
              .catch(() => {
                this.$parent.showDialog = false;
              });
          }
        } else {
          return false;
        }
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
</style>
