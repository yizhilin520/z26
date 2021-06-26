<template>
  <el-dialog
    custom-class="my-dialog"
    center
    title="添加/编辑下载设置"
    width="35%"
    :visible.sync="show"
    :before-close="handleCancel"
  >
    <div class="form_box">
      <el-form ref="form" :model="form" class="demo-ruleForm" :rules="rules">
        <el-form-item prop="channelId">
          <el-select
            placeholder="请选择渠道"
            v-model="form.channelId"
            :style="{ width: '300px' }"
          >
            <el-option
              v-for="(item, index) in channelOptions"
              :key="index"
              :label="item.channelName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="azUrl">
          <el-input
            v-model="form.azUrl"
            placeholder="请输入安卓环体H5链接地址"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item prop="iosUrl">
          <el-input
            v-model="form.iosUrl"
            placeholder="请输入苹果环体H5链接地址"
            :rows="3"
            type="textarea"
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
import { updateDowndSetting, addDowndSetting } from "@/api/otherSetting_api";
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
        azUrl: "",
        channelId: "",
        id: "",
        iosUrl: "",
      },
      isEdit: false,
      channelOptions: [],
      rules: {
        channelId: [{ required: true, message: "请选择渠道", trigger: "blur" }],
        azUrl: [
          { required: true, message: "请选输入下载地址", trigger: "blur" },
        ],
        iosUrl: [
          { required: true, message: "请选输入下载地址", trigger: "blur" },
        ],
      },
    };
  },
  computed: {},
  methods: {
    //确定
    handleSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            updateDowndSetting({ ...this.form })
              .then((res) => {
                if (res.code * 1 === 200) {
                  this.$parent.getFetchData();
                }
              })
              .catch((e) => console.error(e))
              .finally(() => {
                this.handleCancel();
              });
          } else {
            delete this.form.id;
            addDowndSetting({ ...this.form })
              .then((res) => {
                if (res.code * 1 === 200) {
                  this.$parent.getFetchData();
                }
              })
              .catch((e) => console.error(e))
              .finally(() => {
                this.handleCancel();
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //取消弹窗
    handleCancel() {
      this.form = {
        azUrl: "",
        channelId: "",
        id: "",
        iosUrl: "",
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
.avatar {
  object-fit: contain;
}
</style>
