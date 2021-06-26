<template>
  <el-dialog
    center
    custom-class="custom-dialog my-dialog"
    title="视频审核"
    width="50%"
    :visible.sync="show"
    :before-close="handleCancel"
  >
    <!-- label-width="100px" -->
    <el-form style="text-align: center" :model="form" class="demo-ruleForm">
      <el-form-item>
        <el-radio-group v-model="form.checkType">
          <el-radio label="1">通过</el-radio>
          <el-radio label="0">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- label="反馈信息" -->
      <!-- <el-form-item v-if="form.checkType === '2'">
        <el-input
          v-model="form.text"
          type="textarea"
          placeholder="请输入反馈信息"
          maxlength="300"
          show-word-limit
          rows="5"
        />
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { postCheck } from "@/api/post_api";
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        checkType: "1"
        // text: ""
      },
      data: null
    };
  },
  mounted() {},
  methods: {
    //确定
    handleSubmit() {
      postCheck({ pid: this.data.pid, status: this.form.checkType })
        .then(res => {
          if (res.code * 1 === 200) {
            this.$parent.isReview = false;
            this.$parent.fetchData();
          }
        })
        .catch(e => console.error(e));
    },
    //取消弹窗
    handleCancel() {
      this.$parent.isReview = false;
    }
  }
};
</script>
