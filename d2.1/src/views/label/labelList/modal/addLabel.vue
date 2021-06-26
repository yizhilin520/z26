<template>
  <el-dialog
    custom-class="my-dialog"
    center
    title="添加标签"
    width="50%"
    :visible.sync="show"
    :before-close="handleCancel"
  >
    <div class="form_box">
      <el-form
        ref="form"
        :model="form"
        label-width="150px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item label="视频标签" prop="labelname">
          <el-input
            v-model="form.labelname"
            placeholder="请输入视频标签词汇"
            clearable
            :style="{ width: '300px' }"
          />
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel('form')">取 消</el-button>
      <el-button type="primary" @click="handleSubmit('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { addVideoLabel } from "@/api/label_api";
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
        labelname: ""
      },
      rules: {
        labelname: [
          { required: true, message: "视频标签词汇不能为空", trigger: "blur" },
          {
            min: 2,
            max: 4,
            message: "最少输入2个字，最多输入4个字",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {},
  methods: {
    //确定
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            labelName: this.form.labelname
          };
          addVideoLabel({ ...params })
            .then(res => {
              if (Number(res.code) === 200) {
                this.$parent.isShow = false;
                this.form.labelname = "";
                this.$parent.fetchData();
              }
            })
            .catch(() => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //取消弹窗
    handleCancel(formName) {
      this.$parent.isShow = false;
      this.form.labelname = "";
      this.$refs[formName] ? this.$refs[formName].resetFields() : "";
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
</style>
