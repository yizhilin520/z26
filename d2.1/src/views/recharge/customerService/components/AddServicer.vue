<template>
  <el-dialog
    custom-class="my-dialog"
    center
    title="客服QQ号码"
    width="30%"
    :visible.sync="show"
    :before-close="handleCancel"
  >
    <div class="form_box">
      <el-form ref="form" :model="form" class="demo-ruleForm">
        <el-form-item label="">
          <el-input
            v-model.number="form.qq"
            placeholder="请输入客服的QQ号码"
            clearable
            :style="{ width: '250px' }"
          />
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { addQQ, editQQ } from "@/api/recharge_api";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        qq: "",
      },
      isEdit: false,
    };
  },
  mounted() {},
  methods: {
    handleSubmit() {
      if (this.form.qq === "")
        return this.$message.warning("请输入客服的QQ号码");
      if (this.isEdit) {
        editQQ(this.form)
          .then((res) => {
            if (res.code * 1 === 200) {
              this.handleCancel();
              this.$parent.fetchData();
            }
          })
          .catch(() => {});
      } else {
        addQQ(this.form)
          .then((res) => {
            if (res.code * 1 === 200) {
              this.handleCancel();
              this.$parent.fetchData();
            }
          })
          .catch(() => {});
      }
    },
    //取消弹窗
    handleCancel() {
      this.form = {
        qq: "",
        id: "",
      };
      this.$parent.isAdd = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.form_box {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
