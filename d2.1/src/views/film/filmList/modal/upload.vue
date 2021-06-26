<template>
  <el-dialog
    center
    class="dialog-style my-dialog mine"
    title="影片上传"
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
        <el-input
          v-model="uploadForm.title"
          show-word-limit
          type="textarea"
          placeholder="请输入影片名称"
          rows="2"
          minlength="1"
          maxlength="30"
        />
      </el-form-item>
      <el-form-item label="">
        <el-upload
          class="first_image"
          action
          :show-file-list="false"
          :multiple="false"
          accept="image/*"
          :http-request="handleFirstUpImage"
        >
          <el-button size="small" style="width: 100px" type="primary"
            >选择影片封面 </el-button
          ><span>（选填）</span>
          <br />
          <div class="cover_img">
            <img
              v-if="uploadForm.coverPath"
              :src="uploadForm.coverPath"
              class="cover_avatar"
            />
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item v-if="!isEdit">
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
      <el-form-item v-if="showTimes">
        <div class="show_text">
          上传成功 {{ times }}，上传失败 {{ errorTimes }}
        </div>
      </el-form-item>
      <el-form-item label="">
        <div>影片模式</div>
        <el-radio-group v-model="uploadForm.filmType">
          <el-radio :label="it.key" v-for="it in filmMode" :key="it.key">{{
            it.value
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="label">
        <p class="label_text">
          影片标签 <span class="label_text tip">（至少选1个）</span>
        </p>
        <el-checkbox-group @change="handleCheckbox" v-model="tagList">
          <el-checkbox
            v-for="item in labelList"
            :key="item.id"
            :label="item.id"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleUploadFilm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  getNewVideoUrl,
  putVideo,
  uploadOrUpdateLong,
  uploadImage,
  updateFilmEdit,
} from "@/api/film_api";
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
        title: "",
        labelTag: "",
        coverPath: "",
        filmType: "",
      },
      labelList: [],
      tagList: [],
      fileList: [],
      fileNames: [],
      data: null,
      isEdit: false,
      path: "",
      rawList: [],
      times: 0,
      showTimes: false,
      errorTimes: 0,
      filmMode: [
        { key: 0, value: "免费" },
        { key: 1, value: "VIP" },
      ],
    };
  },
  methods: {
    // 影片封面上传
    handleFirstUpImage(file) {
      let formData = new FormData();
      formData.append("file", file.file);
      uploadImage(formData)
        .then((res) => {
          if (res.code * 1 === 200) {
            this.uploadForm.coverPath = res.data;
          }
        })
        .catch(() => {});
    },
    handleChange(file, fileList) {
      //文件列表变化时
      this.fileList = fileList;
      this.fileNames = this.fileList
        .map((it) => {
          if (!it.name.includes("m3u8")) return it.name;
        })
        .filter(Boolean);
    },
    // 判断条件
    handleVerification() {
      if (this.uploadForm.title === "") {
        this.$message.error("请输入影片名称不能为空");
        this.halfUpdate = false;
        return false;
      }
      if (this.fileList.length <= 0) {
        this.$message.error("请选择要上传的视频");
        this.halfUpdate = false;
        return false;
      }
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
          path: "",
        };
        videoUploadUrlVoList.push(params);
        this.rawList.push(item.raw);
      });
      if (videoUploadUrlVoList.length <= 0) return;
      this.loading = true;
      // 生成上传链接;
      getNewVideoUrl(JSON.stringify(videoUploadUrlVoList))
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
                    // this.loading = false;
                    let hasObjName = obj.objectName
                      .slice(
                        obj.objectName.lastIndexOf("/") + 1,
                        obj.objectName.length
                      )
                      .includes("m3u8");
                    if (hasObjName) {
                      this.data = res.data[i];
                    }
                    if (this.times + this.errorTimes === this.fileList.length) {
                      let formdata = new FormData();
                      formdata.append("title", this.uploadForm.title);
                      formdata.append("objectName", this.data.objectName);
                      formdata.append("sign", this.data.sign);
                      formdata.append("labelIds", this.uploadForm.labelTag);
                      formdata.append("coverPath", this.uploadForm.coverPath);
                      formdata.append("fileNames", this.fileNames.join(","));
                      formdata.append("videoMode", this.uploadForm.filmType);
                      this._uploadVideoFunction(formdata);
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
    _uploadVideoFunction(formdata) {
      uploadOrUpdateLong(formdata)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success("上传成功");
            this.handleCancel();
            this.$parent.fetchFilmData();
            this.showTimes = false;
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.handleCancel();
          this.loading = false;
          this.$parent.isUpload = false;
          this.showTimes = false;
        });
    },
    //确定
    handleUploadFilm() {
      if (this.isEdit) {
        this.hanleFilmEdit();
      } else {
        if (this.uploadForm.labelTag === "") {
          this.$message.error("请选择勾选标签");
          return false;
        }
        if (this.uploadForm.filmType === "") {
          this.$message.error("请选择影片模式");
          return false;
        }
        if (this.fileList.length <= 0) {
          this.handleVerification();
        } else {
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
        }
      }
    },
    // 长影片编辑
    hanleFilmEdit() {
      let { title, labelTag, id, coverPath,filmType } = this.uploadForm;
      let params = {
        labelIds: labelTag,
        title,
        id,
        coverPath,
        videoMode: filmType
      };
      this.loading = true;
      updateFilmEdit({ ...params })
        .then((res) => {
          if (res.code * 1 === 200) {
            this.$parent.fetchFilmData();
            this.loading = false;
            this.$parent.isUpload = false;
            this.handleCancel();
          }
        })
        .catch(() => {});
    },
    // 勾选视频标签
    handleCheckbox(val) {
      this.uploadForm.labelTag = val.join(",");
    },
    //取消弹窗
    handleCancel() {
      this.fileList = [];
      this.tagList = [];
      this.file_List = [];
      this.fileNames = [];
      this.rawList = [];
      this.uploadForm = {
        title: "",
        labelTag: "",
        id: "",
        coverPath: "",
        filmType: ""
      };
      this.times = 0;
      this.errorTimes = 0;
      this.$parent.isUpload = false;
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
.cover_img {
  margin: 7vh 0 5vh 10vh;
}
.cover_avatar {
  // width: calc(166px + 20%);
  // height: calc(90px + 20%);
  width: 166px;
  height: 90px;
  border-radius: 6px;
  transform: scale(2);
}
>>> .el-upload {
  text-align: left;
}
.up_text {
  margin-left: 30px;
}
.show_text {
  font-size: 15px;
  color: #f00;
}
</style>
