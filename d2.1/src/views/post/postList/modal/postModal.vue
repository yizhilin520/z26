<template>
  <el-dialog
    custom-class="my-dialog"
    center
    title="帖子发布"
    width="50%"
    :visible.sync="show"
    :before-close="handleCancel"
  >
    <div class="form_box">
      <el-form ref="ruleForm" :model="ruleForm" class="demo-ruleForm">
        <el-form-item label="">
          <el-select
            v-model="ruleForm.authorId"
            clearable
            placeholder="选择官方账号"
            style="width:50%"
          >
            <el-option
              v-for="item in nickOptions"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="" prop="">
          <el-input
            v-model="ruleForm.content"
            show-word-limit
            placeholder="请输入帖子内容"
            clearable
            type="textarea"
            :rows="5"
            :autosize="{ minRows: 5, maxRows: 10 }"
            maxlength="2000"
          />
        </el-form-item>
        <el-form-item label="">
          <el-upload
            class="upload-demo"
            action
            multiple
            accept=".jpg,jpeg,.png,.gif,.JPG,.JPEG,.PNG,.mp4,.MP4"
            :auto-upload="false"
            :limit="9"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :on-change="handleChange"
            :on-remove="handleRemove"
          >
            <el-button size="small" style="width: 100px" type="primary"
              >上传</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item label="" prop="">
          <el-alert
            title="*上传处可添加图片或视频，图片一次最多只能添加9张，视频一次最多只能添加1个。图片和视频不能同时添加。注：视频格式-mp4/图片格式-(jpg、jpeg、png、gif)"
            type="warning"
          >
          </el-alert>
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
import { uploadImage, uploadVideo, addPost } from "@/api/post_api";

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      ruleForm: {
        authorId: "",
        content: "",
        pictures: "",
        videos: "",
        coverVideo: ""
      },
      accountList: [],
      fileList: [],
      type: "mp4",
      sxffList: [],
      isSxff: false,
      nickOptions: []
    };
  },
  mounted() {},
  methods: {
    //取消弹窗
    handleCancel() {
      this.$parent.isPost = false;
      this.fileList = [];
      this.ruleForm = {
        authorId: "",
        content: "",
        pictures: "",
        videos: "",
        coverVideo: ""
      };
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
      this.sxffList = this.fileList.map(it => {
        return it.name.slice(it.name.lastIndexOf(".") + 1, it.name.length);
      });
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 9 个文件，本次选择了 ${files.length} 个文件`
      );
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
      this.sxffList = this.fileList.map(it => {
        return it.name.slice(it.name.lastIndexOf(".") + 1, it.name.length);
      });
    },

    checkSxffCount() {
      return this.sxffList.reduce(function(prev, next) {
        prev[next.toLowerCase()] = prev[next.toLowerCase()] + 1 || 1;
        return prev;
      }, {});
    },
    checked() {
      let arr = Object.keys(this.checkSxffCount());
      if (arr.includes("mp4") || arr.includes("Mp4")) {
        this.type = "mp4";
      } else {
        this.type = "";
      }
      return new Promise((resolve, reject) => {
        if (this.checkSxffCount().mp4 > 1) {
          this.$message.warning("只能添加一个视频");
          reject();
        } else if (
          this.checkSxffCount().mp4 == 1 &&
          (arr.includes("jpg") ||
            arr.includes("jpeg") ||
            arr.includes("png") ||
            arr.includes("gif") ||
            arr.includes("tiff") ||
            arr.includes("bmp"))
        ) {
          this.$message.warning("图片和视频不能同时添加");
          reject();
        } else {
          if (this.fileList.length > 0) {
            if (this.type == "mp4") {
              this.handleUpVideo();
            } else {
              this.handleUpImage();
            }
          } else {
            this.publish();
          }
          resolve();
        }
      });
    },
    handleSubmit() {
      // debugger
      if (this.ruleForm.authorId == "") {
        this.$message.warning("官方账号不能为空");
        return;
      }
      this.checked();
    },
    //发帖
    publish() {
      addPost({ ...this.ruleForm })
        .then(res => {
          if (res.code * 1 === 200) {
            this.$parent.fetchData();
          }
        })
        .catch(e => {
          console.error(e);
          this.$message.error("发布失败");
        })
        .finally(() => {
          this.handleCancel();
        });
    },
    // 上传视频
    handleUpVideo() {
      let formData = new FormData();
      let isLt100M = false;
      this.fileList.forEach(file => {
        if (file.size / 1024 / 1024 > 100) {
          this.$message.error("上传视频大小不能超过100M");
          isLt100M = true;
        }
        formData.append("file", file.raw);
      });
      if (isLt100M) return;
      uploadVideo(formData)
        .then(res => {
          if (res.code * 1 === 200 && res.data != null) {
            let { imageUrl, videoUrl } = res.data;
            this.ruleForm.videos = videoUrl;
            this.ruleForm.coverVideo = imageUrl;
            this.publish();
          }
        })
        .catch(e => {
          console.error(e);
          this.$message.error("上传失败");
          this.handleCancel();
        });
    },
    // 上传图片
    handleUpImage() {
      let formData = new FormData();
      this.fileList.forEach(file => {
        formData.append("file", file.raw);
      });
      uploadImage(formData)
        .then(res => {
          if (res.code * 1 === 200 && res.data != null) {
            this.ruleForm.pictures = res.data;
            this.publish();
          }
        })
        .catch(e => {
          console.error(e);
          this.$message.error("上传失败");
          this.handleCancel();
        });
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
.demo-ruleForm {
  width: 80%;
  margin: 0 auto;
}
</style>
