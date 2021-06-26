<template>
  <el-dialog
    center
    class="dialog-style my-dialog mine"
    title="影片续传"
    :before-close="handleCancel"
    :visible.sync="show"
    width="50%"
    top="10vh"
    :close-on-click-modal="false"
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)"
    element-loading-text="Loading"
  >
    <el-form
      ref="upruleForm"
      :model="uploadForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item>
        <el-upload
          ref="upload"
          multiple
          class="upload-demo"
          accept=".m3u8,.ts"
          action
          :auto-upload="false"
          :data="uploadForm"
          :on-remove="removeOK"
          :on-change="handleChange"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">选择影片文件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item v-show="showTimes">
        <div class="show_text">
          上传成功 {{ times }}，上传失败 {{ errorTimes }}
        </div>
      </el-form-item>
      <el-form-item label="已上传的片段">
        <div class="old_filenames">
          <div class="old_item" v-for="(it, idx) in oldFileNames" :key="idx">
            {{ it }}
          </div>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleUploadFilm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getResumeVideoUrl, putVideo, updateFilmEdit } from "@/api/film_api";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      uploadForm: {
        path: "",
        title: "",
        coverPath: "",
        id: "",
        labelIds: "",
      },
      fileList: [],
      fileNames: [],
      oldFileNames: [],
      rawList: [],
      times: 0,
      errorTimes: 0,
      showTimes: false,
    };
  },
  methods: {
    handleChange(file, fileList) {
      //文件列表变化时
      this.fileList = fileList;
      this.fileNames = this.fileList
        .map((it) => {
          if (!it.name.includes("m3u8")) return it.name;
        })
        .filter(Boolean);
    },
    removeOK(file, fileList) {
      this.fileList = fileList;
    },
    uploadFile() {
      let videoUploadUrlVoList = [];
      this.fileList.forEach((item) => {
        let params = {
          fileName: item.name,
          fileSize: item.size,
          labelIds: this.uploadForm.labelTag,
          path: this.uploadForm.path || "",
        };
        videoUploadUrlVoList.push(params);
        this.rawList.push(item.raw);
      });
      if (videoUploadUrlVoList.length <= 0) return;
      this.loading = true;
      // 生成上传链接;
      getResumeVideoUrl(JSON.stringify(videoUploadUrlVoList))
        .then((res) => {
          if (res.code * 1 === 200) {
            new Promise((resolve, reject) => {
              res.data.forEach((obj, i) => {
                let name = obj.objectName.slice(
                  obj.objectName.lastIndexOf("/") + 1,
                  obj.objectName.length
                );
                let raw = this.rawList.find((it) => it.name === name);

                putVideo(
                  obj.region,
                  {
                    "content-type": obj.contentType,
                  },
                  raw
                )
                  .then(() => {
                    this.showTimes = true;
                    this.times++;
                    if (this.times + this.errorTimes === this.fileList.length) {
                      let all_filenames = [
                        ...this.oldFileNames,
                        ...this.fileNames,
                      ];
                      let file_names = [...new Set(all_filenames)]
                        .filter(Boolean)
                        .join(",");
                      delete this.uploadForm.path;
                      let params = {
                        ...this.uploadForm,
                        fileNames: file_names,
                      };
                      this._uploadVideoFunction(params);
                    }
                    resolve();
                  })
                  .catch(() => {
                    this.errorTimes++;
                    reject();
                  });
              });
            }).catch(() => {
              this.loading = false;
              this.$message.error("上传失败");
              this.fileList = [];
              this.errorTimes = 0;
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          this.$message.error("上传失败");
        });
    },

    //更新与上传视频
    _uploadVideoFunction(data) {
      updateFilmEdit(data)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success("上传成功");
            this.handleCancel();
            this.$parent.fetchFilmData();
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.handleCancel();
          this.loading = false;
          this.$parent.iscarryon = false;
          this.showTimes = false;
        });
    },
    //确定
    handleUploadFilm() {
      if (this.fileList.length <= 0)
        return this.$message.error("请选择要上传的视频");
      let bolList = [];
      let sizeList = [];
      this.fileList.forEach((item) => {
        sizeList.push(item.size);
        if (!item.name.includes(".m3u8")) {
          return bolList.push(false);
        }
        return bolList.push(true);
      });
      let arr = sizeList.filter((it) => it >= 15 * 1024 * 1024);
      if (arr.length > 0) {
        this.$message.error("文件大小超过预定值15MB,请重新切片");
      } else {
        this.uploadFile();
      }
    },

    //取消弹窗
    handleCancel() {
      this.fileList = [];
      this.file_List = [];
      this.fileNames = [];
      this.rawList = [];
      this.uploadForm = {
        path: "",
        title: "",
        coverPath: "",
        id: "",
        labelIds: "",
      };
      this.times = 0;
      this.errorTimes = 0;
      this.$parent.iscarryon = false;
      this.showTimes = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.label {
  .label_text {
    margin: 0;
    padding: 0;
    line-height: 1.5;
  }
  .tip {
    color: #ccc;
  }
}
>>> .el-dialog__body {
  overflow: auto;
  max-height: 70vh;
}
>>> .el-upload-list {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  margin: 20px 0;
}
>>> .el-upload-list__item {
  flex: 1;
}
>>> .el-upload-list__item:first-child {
  margin-top: 0;
}
.avatar {
  width: 130px;
  height: 100px;
  object-fit: cover;
  margin-top: 5px;
}
.up_text {
  margin-left: 30px;
}
.old_filenames {
  border: 1px solid #409eff;
  border-radius: 8px;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-content: flex-start;
  min-height: 10vh;
  padding: 0 15px;
  .old_item {
    width: 100px;
    height: 30px;
    line-height: 30px;
  }
}
.show_text {
  font-size: 15px;
  color: #f00;
}
</style>
