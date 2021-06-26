<template>
  <el-dialog
    center
    title="播放视频"
    :visible.sync="show"
    width="50%"
    custom-class="my-dialog"
    :before-close="handleCancel"
  >
    <div style="text-align: center;" class="play_video">
      <video ref="videoRef" id="container" controls></video>
    </div>
  </el-dialog>
</template>
<script>
import Hls from "hls.js";
export default {
  name: "PlayFilm",
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { hls: null };
  },
  mounted() {},
  methods: {
    playVideo(url) {
      this.hls = new Hls();
      this.hls.loadSource(url);
      this.hls.attachMedia(this.$refs.videoRef);
      this.hls.on(Hls.Events.MANIFEST_PARSED, function() {
        this.$refs.videoRef.play();
      });
    },
    //取消弹窗
    handleCancel() {
      this.hls.detachMedia(this.$refs.videoRef);
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
  width: 100%;
  height: 550px;
}
#container {
  width: 100%;
  height: 100%;
}
</style>
