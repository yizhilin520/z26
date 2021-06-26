<template>
  <el-dialog
    custom-class="my-dialog"
    center
    title="帖子详情"
    width="50%"
    :visible.sync="show"
    :before-close="handleCancel"
    v-if="data != null"
  >
    <div class="form_box">
      <div>
        <!-- text -->
        <div class="text">
          {{ data.content }}
        </div>

        <!-- video -->
        <div v-if="data.videos" class="post_video">
          <div class="d_video">
            <video
              id="container"
              class="video-js vjs-big-play-centered my_video"
              controls
              :src="data.videos"
              preload="auto"
              webkit-playsinline="true"
              playsinline="true"
            ></video>
          </div>
        </div>
        <!-- img -->
        <div v-else-if="data.pictures" class="img_list">
          <div v-for="(it, idx) in data.pictures.split(',')" :key="idx">
            <el-image
              class="tb_image"
              :src="it"
              fit="cover"
              :preview-src-list="[it]"
            >
              <div slot="placeholder" class="tb_image_pl">
                加载中<span class="dot">...</span>
              </div>
              <div slot="error" class="tb_image_pl">
                <img
                  class="tb_img"
                  src="@/assets/images/d_avatar@2x.png"
                  alt="图片加载失败"
                />
              </div>
            </el-image>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
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
      data: null
    };
  },
  mounted() {},
  methods: {
    //取消弹窗
    handleCancel() {
      if (sessionStorage.getItem("list"))
        this.$parent.dataList = JSON.parse(sessionStorage.getItem("list"));
      if (this.data.videos) {
        let myVideo = document.getElementById("container");
        myVideo.currentTime = 0;
        myVideo.pause();
        this.data.videos = "";
      }
      this.$parent.isView = false;
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
  height: 100%;
}
.demo-ruleForm {
  width: 80%;
  margin: 0 auto;
}
.demo-image {
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.block {
  display: inline;
}
>>> .my-dialog {
  min-height: 35vh;
  .el-dialog__body {
    min-height: 55vh;
    height: 55vh;
    padding: 15px 40px 40px;
  }
  .text {
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 30px;
  }
  .d_video {
    margin-top: 30px;
    background: #3fdd86;
    min-width: 40vw;
    width: 45vw;
    height: 370px;
  }
  .my_video {
    width: 100%;
    height: 100%;
  }
  .img_list {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    .tb_image {
      width: 100px;
      height: 100px;
      text-align: center;
      margin-left: 10px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .post_video {
    position: relative;
  }
}
</style>
