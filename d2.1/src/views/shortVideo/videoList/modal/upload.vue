<template>
  <el-dialog
    center
    custom-class="custom-dialog my-dialog"
    title="视频上传"
    :before-close="handleCancel"
    :visible.sync="show"
    width="50%"
    top="10vh"
    :close-on-click-modal="false"
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    element-loading-text="Loading"
  >
    <el-form
      ref="upruleForm"
      :model="upruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item>
        <el-input
          v-model="upruleForm.videoTitle"
          minlength="2"
          maxlength="30"
          show-word-limit
          type="textarea"
          placeholder="请输入视频名称"
          rows="3"
        />
      </el-form-item>
      <el-upload
        v-if="isShowUpload"
        ref="upload"
        action
        multiple
        class="upload-demo"
        accept=".mp4, .MP4"
        :data="upruleForm"
        :http-request="uploadsubmit"
        :on-change="handleChange"
        :on-remove="removeOK"
        :before-upload="beforeUploadVideo"
        :auto-upload="false"
        :limit="10"
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <el-button class="e_btn" size="small" type="primary"
          >选择视频上传</el-button
        >
        <div class="e_text">
          <span class="font-warn"
            >* 上传的视频必须为大于10秒，小于等于10分钟</span
          >
        </div>
      </el-upload>
      <el-form-item style="margin-top: 15px" v-if="isAuthor">
        <el-select
          placeholder="请选择官方账号昵称"
          v-model="upruleForm.authorId"
        >
          <el-option
            v-for="item in nickIdOptions"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <p class="label_text">
          选择勾选标签 <span class="tip">（至少选择一个）</span>
        </p>
        <el-checkbox-group @change="handleCheckbox" v-model="labelTagList">
          <el-checkbox
            v-for="item in labelNameList"
            :key="item.id"
            :label="item.id"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button
        type="primary"
        :disabled="btnDisabled"
        @click="handleUploadFilm('upload')"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { getNewVideoUrl, putVideo, uploadOrUpdate } from "@/api/video_api";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    nickIdOptions: {
      type: Array,
      default: [],
    },
    labelNameList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      loading: false,
      upruleForm: {
        videoTitle: "",
        authorId: "",
        duration: 0,
      },
      linkData: [],
      errArr: [],
      row: {},
      labelTag: "",
      labelTagList: [],
      isShowUpload: true,
      isAuthor: true,
      fileList: [],
      errTimes: 0,
      succTimes: 0,
      isUpload: false,
      btnDisabled: false,
      durationTime: [],
    };
  },
  watch: {
    succTimes(newVal) {
      // this.succTimes = newVal;
      // console.log(newVal, "999999");
      // this.$emit("getUploadValue", { type: "succTimes", value: newVal });
      // deep: true
    },
    btnDisabled() {
      this.$refs.upload.submit();
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.btnDisabled = false;
      }, 2000);
    },
  },
  methods: {
    //上传视频 http-request
    uploadsubmit(file, result) {
      // if (this.upruleForm.duration == 0) return;
    },
    //文件列表变化时
    handleChange(file, fileList) {
      this.fileList = fileList;
      if (this.fileList.length > 0) {
        this.btnDisabled = true;
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 10 个文件`);
    },
    removeOK(file, fileList) {
      this.fileList = fileList;
    },
    //上传前回调
    beforeUploadVideo(file) {
      let _this = window;
      this.fileList.forEach((it) => {
        let _URL = _this.URL || _this.webkitURL;
        let videoElement = document.createElement("video");
        videoElement.src = _URL.createObjectURL(it.raw);
        videoElement.addEventListener("loadedmetadata", (_event) => {
          this.durationTime.push({
            key: it.name,
            value: videoElement.duration,
          });
        });
      });
      let arr = [
        ...new Set(this.durationTime.map((v) => JSON.stringify(v))),
      ].map((v) => JSON.parse(v));
      this.str1 = arr
        .map((it) => {
          if (it.value < 10) return it.key;
        })
        .filter(Boolean)
        .join(",");
      this.str2 = arr
        .map((it) => {
          if (it.value > 10 * 60) return it.key;
        })
        .filter(Boolean)
        .join(",");
    },
    // 勾选视频标签
    handleCheckbox(val) {
      this.labelTag = val.join(",");
    },
    commonCheck() {
      this.length = this.fileList.length;
      let len = this.upruleForm.videoTitle.length;
      if (len > 30 || len < 2) {
        this.$message.error("视频文本长度需在2-30个字符之间");
        return false;
      }
      if (this.upruleForm.videoTitle === "") {
        this.$message.error("请输入视频文本");
        return false;
      }
      if (this.upruleForm.authorId === "") {
        this.$message.error("请选择官方账号昵称");
        return false;
      }
      if (this.labelTagList.length <= 0) {
        this.$message.error("请选择视频标签");
        return false;
      }
      if (this.fileList.length === 0 && this.isShowUpload) {
        this.$message({
          message: "请先选取文件",
          type: "warning",
        });
        return false;
      }
    },
    //确定
    handleUploadFilm() {
      this.commonCheck();
      this.$emit("getUploadValue", { type: "length", value: this.length });
      if (this.isShowUpload) {
        this.$nextTick(() => {
          this.$refs.upload.submit();
        });
        if (this.str1.length > 0) {
          this.$message.error(`${this.str1}小于10秒`);
          this.fileList = [];
          this.durationTime = [];
          return false;
        }
        if (this.str2.length > 0) {
          this.$message.error(`${this.str2}大于10分钟`);
          this.fileList = [];
          this.durationTime = [];
          return false;
        }
        if (this.fileList.length <= 0) return;
        this.fileList.forEach((item) => {
          let params = {
            fileName: item.name,
            fileSize: item.size,
            labelIds: this.labelTag,
          };
          // 生成上传链接;
          this.loading = true;
          getNewVideoUrl({ ...params })
            .then((res) => {
              if (res.code === 200) {
                let obj = res.data[0];
                putVideo(
                  obj.region,
                  {
                    "content-type": obj.contentType,
                  },
                  item.raw
                )
                  .then((res) => {
                    if (res == undefined || res === "") {
                      let formdata = new FormData();
                      formdata.append("videoTitle", this.upruleForm.videoTitle);
                      formdata.append("author", this.upruleForm.authorId);
                      formdata.append("bucketName", obj.bucketName);
                      formdata.append("objectName", obj.objectName);
                      formdata.append("sign", obj.sign);
                      formdata.append("labelIds", this.labelTag);
                      this._uploadVideoFunction(formdata);
                    }
                  })
                  .catch((err) => {
                    // this.loading = false;
                    this.$nextTick(() => {
                      this.$message.error("上传失败");
                      this.errTimes += 1;
                      this.errArr.push(this.errTimes);
                      this.$emit("getUploadValue", {
                        type: "errTimes",
                        value: this.errTimes,
                      });
                      this.$emit("getUploadValue", {
                        type: "errArr",
                        value: this.errArr,
                      });
                    });
                    // console.log(err, "putVideo....");
                  });
              }
            })
            .catch((err) => {
              console.log(err);
              // this.loading = false;
            });
        });
      } else {
        this.$nextTick(() => {
          if (this.$refs.upload) this.$refs.upload.submit();
        });
        this.uploadVodeoFun();
      }
    },
    // 编辑 上传
    uploadVodeoFun(file) {
      let formdata = new FormData();
      if (!this.isShowUpload) {
        formdata.append("videoId", this.row.videoId);
        this.labelTag = this.labelTagList.join(",");
      }
      formdata.append("videoTitle", this.upruleForm.videoTitle);
      formdata.append("author", this.upruleForm.authorId);
      formdata.append("bucketName", this.linkData.bucketName);
      formdata.append("objectName", this.linkData.objectName);
      formdata.append("sign", this.linkData.sign);
      formdata.append("labelIds", this.labelTag);
      this._uploadVideoFunction(formdata);
    },
    //更新与上传视频
    _uploadVideoFunction(formdata) {
      // this.loading = true;
      uploadOrUpdate(formdata)
        .then((res) => {
          if (res.code === 200) {
            this.isDisabled = false;
            this.loading = false;
            this.fileList = [];
            this.$parent.isUpload = false;
            this.$message.success("上传成功");
            this.$parent.fetchFilmData();
            this.$nextTick(() => {
              if (this.isShowUpload) this.succTimes += 1;
              this.$emit("getUploadValue", {
                type: "succTimes",
                value: this.succTimes,
              });
            });
          }
        })
        .catch((err) => {
          this.$nextTick(() => {
            // this.$message.error("上传失败");
            if (!this.isShowUpload) this.errTimes += 1;
            this.errArr.push(this.errTimes);
            this.$emit("getUploadValue", {
              type: "errTimes",
              value: this.errTimes,
            });
            this.$emit("getUploadValue", {
              type: "errArr",
              value: this.errArr,
            });
            this.fileList = [];
            this.loading = false;
          });
        })
        .finally(() => {
          // this.upEdit = false;
          this.loading = false;
        });
    },
    //取消弹窗
    handleCancel() {
      this.$parent.isUpload = false;
      this.labelTagList = [];
      this.labelTag = "";
      this.fileList = [];
      this.upruleForm = {
        videoTitle: "",
        authorId: "",
        duration: 0,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.label_text {
  margin: 0;
  padding: 0;
  line-height: 1.5;
}
.tip {
  color: #ccc;
}
.upload-demo {
  padding-right: 20px;
}

.e_text {
  margin-top: 50px;
  margin-left: 80px;
}

>>> .el-dialog__body {
  overflow: auto;
  max-height: 70vh;
}
>>> .el-upload-list {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-items: center;
  margin-left: 100px;
  padding: 10px 0px 0;
  .el-upload-list__item {
    flex: 1;
  }
}
</style>
