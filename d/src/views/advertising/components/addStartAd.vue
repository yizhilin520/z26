<template>
  <el-dialog
    custom-class="my-dialog"
    center
    title="发布/编辑启动页广告"
    width="50%"
    top="10vh"
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
        <el-form-item label="广告名称" prop="adName">
          <el-input
            placeholder=""
            v-model="form.adName"
            clearable
            :style="{ width: '300px' }"
          />
        </el-form-item>
        <el-form-item label="iOS广告图片" prop="">
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
            <img v-if="form.iosImg" :src="form.iosImg" class="avatar" />
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="iOS链接地址" prop="">
          <el-input
            placeholder=""
            v-model="form.iosLink"
            clearable
            :style="{ width: '300px' }"
          />
        </el-form-item> -->
        <el-form-item label="安卓广告图片" prop="">
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
            <img v-if="form.azImg" :src="form.azImg" class="avatar" />
          </el-upload>
        </el-form-item>
        <el-form-item label="" prop="">
          <el-radio-group v-model="form.linkType">
            <el-radio :label="1">外部链接</el-radio>
            <el-radio :label="2">内部链接</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="链接地址" v-if="form.linkType === 1">
          <el-input
            placeholder=""
            v-model="form.linkAddress"
            clearable
            type="textarea"
            :rows="3"
            :style="{ width: '300px' }"
          />
        </el-form-item>
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
        <el-form-item label="展示时间（秒）" prop="duration">
          <el-input
            placeholder=""
            v-model.number="form.duration"
            clearable
            :style="{ width: '300px' }"
          />
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
import { addSpread, uploadAdImage, editSpread } from "@/api/banner_api";
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
        adName: "",
        iosImg: "",
        // iosLink: "",
        azImg: "",
        // azLink: "",
        linkAddress: "",
        duration: 0,
        adType: 0,
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
        adName: [
          { required: true, message: "banner名称不能为空", trigger: "blur" },
        ],
        duration: [
          { required: true, message: "展示时间不能为空", trigger: "blur" },
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
      //   message: "请不要上传大于1m的文件.",
      //   type: "warning"
      // });
      // return false;
    },
    async handleUploadImages(type, req) {
      const formdata = new FormData();
      formdata.append("file", req.file);
      let result = await uploadAdImage(formdata);
      if (result.code === 200 && result.data !== null) {
        type === "ios"
          ? (this.form.iosImg = result.data)
          : (this.form.azImg = result.data);
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
            editSpread({ ...this.form })
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
            addSpread({ ...this.form })
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
        adName: "",
        iosImg: "",
        azImg: "",
        times: 0,
        duration: 0,
        adType: 1,
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
>>> .el-dialog {
  .el-dialog__body {
    overflow: auto;
    max-height: 80vh;
    .userdetails-container {
      max-height: none;
    }
  }
}
.avatar {
  width: 130px;
  height: 100px;
  object-fit: contain;
  margin-top: 10px;
}
</style>
