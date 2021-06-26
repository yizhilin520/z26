<template>
  <el-dialog
  custom-class="my-dialog"
    center
    title="播放视频"
    :visible.sync="show"
    width="900px"
    :before-close="handleCancel"
  >
    <div class="play_video" style="text-align: center;">
      <video
        id="container"
        class="video-js vjs-big-play-centered"
        controls
        :src="url"
        preload="auto"
        webkit-playsinline="true"
        playsinline="true"
      ></video>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "PlayFilm",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  mounted() {
  },
  methods: {
    //取消弹窗
    handleCancel() {
      let myVideo = document.getElementById("container");
      myVideo.currentTime = 0;
      myVideo.pause();
      this.$parent.isPlay = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.play_video {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #3fdd86;
  width: 850px;
  height: 478px;
}
#container {
  width: 100%;
  height: 100%;
}
</style>
