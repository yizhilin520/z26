<template>
  <div class="d_dialog">
    <el-dialog
      custom-class="custom-dialog my-dialog"
      center
      title="新增分类"
      :visible.sync="showDialog"
      width="40%"
      @close="handleCancel"
    >
      <div class="dis_flex">
        <el-form ref="form" :model="form" class="demo-ruleForm" :rules="rules">
          <el-form-item label="" prop="name">
            <el-input
              v-model="form.name"
              show-word-limit
              placeholder="请输入分类的名称"
              clearable
              :style="{ width: '350px' }"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="handleClickOK">确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { addMove } from "@/api/home_api";
import { strlen } from "@/utils/index";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    let checkname = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("分类的名称不能为空"));
      } else if (
        Number(value) ||
        /\d/g.test(value) ||
        /[!~@#$%^()-+&=/.*]+/gi.test(value)
      ) {
        callback(new Error("请输入正确内容，汉字或字母"));
      } else if (strlen(value) < 6 || strlen(value) > 8) {
        callback(
          new Error("请输入至少不得低于6个字符，最多不得高于8个字符的名称")
        );
      } else {
        callback();
      }
    };
    return {
      form: {
        name: "",
      },
      rules: {
        name: [
          // { required: true, message: "分类的名称不能为空", trigger: "blur" },
          { required: true, validator: checkname, trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    showDialog: {
      get() {
        return this.show;
      },
      set(val) {
        return val;
      },
    },
  },
  methods: {
    //   弹窗确定
    handleClickOK() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          addMove({ name: this.form.name })
            .then((res) => {
              if (res.code * 1 === 200) {
                this.$parent.isAdd = false;
                this.$parent.fetchData();
              }
            })
            .catch((e) => console.error(e));
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //取消弹窗
    handleCancel() {
      this.$parent.isAdd = false;
      this.form.name = "";
      this.$refs["form"].resetFields();
    },
  },
};
</script>
<style lang="scss" scoped>
.dis_flex {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
