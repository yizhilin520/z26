<template>
  <el-dialog
    custom-class="my-dialog"
    center
    title="水印添加/编辑"
    width="35%"
    :visible.sync="show"
    :before-close="handleCancel"
  >
    <div class="form_box">
      <el-form ref="form" :model="form" class="demo-ruleForm">
        <el-form-item label="" prop="" v-show="!isChild">
          <el-select
            placeholder="请选择渠道"
            v-model="form.channelId"
            :style="{ width: '300px' }"
          >
            <el-option
              v-for="item in channelOptions"
              :key="item.id"
              :label="item.channelName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="" prop="">
          <el-upload
            ref="upload"
            :show-file-list="false"
            action
            :http-request="handleUploadImages"
            :multiple="false"
            accept="image/*"
          >
            <el-button size="small" type="primary">上传水印图片</el-button>
            <br />
            <img
              v-if="form.watermarkImage"
              :src="form.watermarkImage"
              class="avatar"
            />
          </el-upload>
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
import {
  addWaterMark,
  uploadMaskImage,
  updateWaterMark,
} from "@/api/otherSetting_api";
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
        id: "",
        channelId: "",
        watermarkImage: "",
      },
      isChild: false,
      channelOptions: [],
    };
  },
  computed: {},
  methods: {
    async handleUploadImages(req) {
      const formdata = new FormData();
      formdata.append("file", req.file);
      let result = await uploadMaskImage(formdata);
      if (result.code === 200 && result.data !== null) {
        this.form.watermarkImage = result.data;
      }
    },
    //确定
    handleSubmit() {
      if (this.form.channelId === "")
        return this.$message.warning("请选择渠道");
      if (this.form.watermarkImage === "")
        return this.$message.warning("请选择要上传水印");
      if (this.isChild) {
        delete this.form.channelId;
        updateWaterMark(this.form)
          .then((res) => {
            if (Number(res.code) === 200) {
              this.handleCancel();
              this.$parent.getFetchData();
            }
          })
          .catch(() => {});
      } else {
        delete this.form.id;
        addWaterMark(this.form)
          .then((res) => {
            if (Number(res.code) === 200) {
              this.handleCancel();
              this.$parent.getFetchData();
            }
          })
          .catch(() => {});
      }
    },
    //取消弹窗
    handleCancel() {
      this.form = {
        channelId: "",
        watermarkImage: "",
        id: "",
      };
      this.$parent.isEdit = false;
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
