<template>
  <el-dialog
    center
    custom-class="custom-dialog my-dialog"
    title="视频审核"
    :visible.sync="show"
    width="50%"
    :before-close="handleCancel"
  >
    <el-form style="text-align: center" :model="form" class="demo-ruleForm">
      <el-form-item>
        <el-radio-group v-model="form.checkType">
          <el-radio label="1">通过</el-radio>
          <el-radio label="2">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- label="反馈信息" -->
      <el-form-item v-if="form.checkType == '2'">
        <el-input
          v-model="form.text"
          type="textarea"
          placeholder="请输入反馈信息"
          maxlength="300"
          show-word-limit
          rows="5"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { checkVideo } from "@/api/video_api";
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: {
        checkType: "1",
        text: ""
      }
    };
  },
  mounted() {},
  methods: {
    //确定
    handleSubmit() {
      if (this.form.checkType === "2" && this.form.text === "") {
        this.$message(`请输入反馈信息`);
        return false;
      }
      const params = {};
      params.videoId = this.data.videoId;
      params.checkType = this.form.checkType;
      params.checkRemark = this.form.text;
      checkVideo(params)
        .then(res => {
          this.form.checkType == "1"
            ? this.$message({
                type: "success",
                message: `您上传的视频 ${this.data.videoTitle} 已通过审核`
              })
            : this.$message({
                type: "fail",
                message: `您上传的视频 ${
                  this.data.videoTitle
                } 未通过审核, 原因：${params.checkRemark}`
              });
          this.$parent.isReview = false;
          this.$parent.fetchFilmData();
        })
        .catch(() => {
          this.$parent.isReview = false;
        });
    },
    //取消弹窗
    handleCancel() {
      this.$parent.isReview = false;
    }
  }
};
</script>
<style lang="scss" scoped></style>
