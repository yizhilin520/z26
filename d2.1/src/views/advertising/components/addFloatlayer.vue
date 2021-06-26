<template>
  <el-dialog
    custom-class="my-dialog"
    center
    title="发布/编辑浮层广告"
    width="50%"
    top="5vh"
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
        <el-form-item label="iOS浮层图" prop="">
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

        <el-form-item label="安卓浮层图" prop="">
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
        <el-form-item label="使用渠道" prop="channelId">
          <el-select
            placeholder="请选择渠道"
            v-model="form.channelId"
            :style="{ width: '300px' }"
            @change="changeChannel"
          >
            <el-option
              v-for="item in channelOptions"
              :key="item.id"
              :label="item.channelName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="app内显示界面" prop="displayMode">
          <el-select
            placeholder="请选择要显示的页面"
            v-model="form.displayMode"
            :style="{ width: '300px' }"
          >
            <el-option
              v-for="item in appType"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="">
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
        azImg: "",
        adType: 2,
        linkAddress: "",
        jumpType: "",
        linkType: 1,
        channelId: "",
        displayMode: "",
      },
      cusId: "",
      isChange: true,
      isEdit: false,
      jumpTypeList: [
        { key: "0", value: "请选择跳转界" },
        { key: 1, value: "开通VIP界面" },
        { key: 2, value: "充值界面" },
        { key: 3, value: "上传短视频界面" },
        { key: 4, value: "上传帖子界面" },
      ],
      appType: [
        { key: 0, value: "首页" },
        { key: 1, value: "短视频" },
        { key: 2, value: "广场社区" },
      ],
      channelOptions: [],
      rules: {
        adName: [
          { required: true, message: "banner名称不能为空", trigger: "blur" },
        ],
        channelId: [{ required: true, message: "请选择渠道", trigger: "blur" }],
        displayMode: [
          { required: true, message: "请选择要显示的页面", trigger: "blur" },
        ],
      },
    };
  },
  computed: {},
  methods: {
    beforeUpload(file) {},
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
    changeChannel(val) {
      this.isChange = false;
      this.form.channelId = val;
    },
    //确定
    handleSubmit(formName) {
      if (this.isChange) this.form.channelId = this.cusId;
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
                this.handleCancel();
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
      this.$parent.isShow = false;
      this.form = {
        adName: "",
        iosImg: "",
        azImg: "",
        adType: 2,
        linkAddress: "",
        jumpType: "",
        linkType: 1,
        channelId: "",
        displayMode: "",
        id: "",
      };
      this.cusId = "";
      this.isChange = true;
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
  margin-top: 10px;
}
</style>
