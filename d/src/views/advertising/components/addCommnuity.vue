<template>
  <el-dialog
    custom-class="my-dialog"
    center
    title="banner发布/编辑"
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
        <el-form-item label="banner名称" prop="title">
          <el-input
            placeholder=""
            v-model="form.title"
            clearable
            :style="{ width: '300px' }"
          />
        </el-form-item>
        <el-form-item label="iOS banner图" prop="">
          <el-upload
            ref="upload"
            :show-file-list="false"
            action
            :http-request="uploadImgIOS"
            :before-upload="beforeUpload"
            :multiple="false"
            accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
          >
            <el-button size="small" type="primary">添加图片</el-button>
            <br />
            <img v-if="form.iosPicture" :src="form.iosPicture" class="avatar" />
          </el-upload>
        </el-form-item>

        <el-form-item label="安卓 banner图" prop="">
          <el-upload
            ref="upload"
            :show-file-list="false"
            action
            :http-request="uploadImgAz"
            :before-upload="beforeUpload"
            :multiple="false"
            accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
          >
            <el-button size="small" type="primary">添加图片</el-button>
            <br />
            <img v-if="form.azPicture" :src="form.azPicture" class="avatar" />
          </el-upload>
        </el-form-item>
        <el-form-item label="">
          <el-radio-group v-model="form.linkType">
            <el-radio :label="1">外部链接</el-radio>
            <el-radio :label="2">内部链接</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="form.linkType === 1">
          <el-form-item label="链接地址">
            <el-input
              placeholder=""
              v-model="form.linkAddress"
              clearable
              type="textarea"
              :rows="3"
              :style="{ width: '300px' }"
            />
          </el-form-item>
        </template>
        <el-form-item v-else>
          <el-select
            v-model="form.jumpType"
            clearable
            placeholder="请选择跳转界面"
          >
            <el-option
              v-for="item in jumpTypeList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="每刷" prop="times">
          <div class="times">
            <el-input
              placeholder=""
              v-model.number="form.times"
              clearable
              class="times_input"
            />
            <span>个帖子出现1次</span>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { addBanner, uploadImage, editBanner } from "@/api/banner_api";
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
        title: "",
        iosPicture: "",
        iosLink: "",
        azPicture: "",
        azLink: "",
        times: "",
        bannerType: 1,
        linkAddress: "",
        linkType: 1,
        jumpType: "",
      },
      jumpTypeList: [
        { key: "0", value: "请选择跳转界" },
        { key: 1, value: "开通VIP界面" },
        { key: 2, value: "充值界面" },
        { key: 3, value: "上传短视频界面" },
        { key: 4, value: "上传帖子界面" },
      ],
      isEdit: false,
      rules: {
        title: [
          { required: true, message: "banner名称不能为空", trigger: "blur" },
        ],
        times: [
          { required: true, message: "每刷次数不能为空", trigger: "blur" },
          { pattern: /^[1-9]\d*$/, message: "请输入整数", trigger: "blur" },
        ],
      },
    };
  },
  computed: {},
  methods: {
    beforeUpload(file) {
      // const isLt1M = file.size / 1024 / 1024 < 1;
      // if (isLt1M) {
      //   return true;
      // }
      // this.$message({
      //   message: "请不要上传大于1M的文件.",
      //   type: "warning"
      // });
      // return false;
    },
    async handleUploadImages(type, req) {
      const formdata = new FormData();
      formdata.append("file", req.file);
      let result = await uploadImage(formdata);
      if (result.code === 200 && result.data !== null) {
        type === "ios"
          ? (this.form.iosPicture = result.data)
          : (this.form.azPicture = result.data);
      }
    },
    uploadImgIOS(req) {
      this.handleUploadImages("ios", req);
    },
    uploadImgAz(req) {
      this.handleUploadImages("az", req);
    },
    //确定
    handleSubmit(formName) {
      this.form.linkType === 1
        ? (this.form.jumpType = "")
        : (this.form.linkAddress = "");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            editBanner({ ...this.form })
              .then((res) => {
                if (res.code * 1 === 200) {
                  this.$parent.fetchData();
                }
              })
              .catch((e) => console.error(e))
              .finally(() => {
                this.$parent.isShow = false;
              });
          } else {
            addBanner({ ...this.form })
              .then((res) => {
                if (res.code * 1 === 200) {
                  this.$parent.fetchData();
                }
              })
              .catch((e) => console.error(e))
              .finally(() => {
                this.$parent.isShow = false;
                this.handleCancel("form");
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
      this.$parent.isShow = false;
      this.form = {
        title: "",
        iosPicture: "",
        iosLink: "",
        azPicture: "",
        azLink: "",
        times: "",
        bannerType: 1,
        linkAddress: "",
        linkType: 1,
        jumpType: "",
      };
      this.$refs["form"].resetFields();
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
.times {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
}
.times_input {
  width: 120px;
}
.avatar {
  width: 130px;
  height: 100px;
  object-fit: contain;
}
>>> .el-dialog {
  .el-dialog__body {
    overflow: auto;
    max-height: 90vh;
    .userdetails-container {
      max-height: none;
    }
  }
}
</style>
