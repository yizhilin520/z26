<template>
  <el-dialog
    center
    class="dialog-style my-dialog mine"
    title="视频详情"
    :visible.sync="show"
    width="50%"
    :before-close="handleCancel"
  >
    <el-tree
      default-expand-all
      empty-text="该视频文件无法解析"
      :data="videoInfoList"
      :props="defaultProps"
    />
  </el-dialog>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    videoInfoData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      list: [],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  computed: {
    data() {
      return this.videoInfoData;
    },
    videoInfoList() {
      if (this.data != null) {
        this.list.push({
          label: "概览",
          children: [
            { label: `视频ID: ${this.data.videoId}` },
            {
              label: `视频类型: ${
                this.data.standard == "0"
                  ? "源文件"
                  : this.data.standard == "1"
                  ? "标清"
                  : "重新编码"
              }`
            },
            { label: `宽(px): ${this.data.width}` },
            { label: `高(px): ${this.data.height}` },
            {
              label: `文件大小(M): ${parseFloat(
                this.data.size / (1024 * 1024)
              ).toFixed(2)}`
            },
            { label: `存储的oss桶名称: ${this.data.bucketName}` },
            {
              label: "音频",
              children: [
                { label: `编码器名称: ${this.data.audioDecoder}` },
                { label: `采样率: ${this.data.audioSamplingRate}` },
                { label: `通道数: ${this.data.audioChannels}` },
                { label: `比特率: ${this.data.audioBitRate / 1000}` }
              ]
            },
            {
              label: "视频",
              children: [
                { label: `编码格式: ${this.data.videoFormat}` },
                { label: `时长(s): ${this.data.videoDuration / 1000}` },
                { label: `比特率: ${this.data.videoBitRate / 1000}` },
                { label: `流解码器: ${this.data.videoDecoder}` },
                { label: `帧率(FPS): ${this.data.videoFrameRate}` },
                { label: `封面地址: ${this.data.coverImage}` },
                { label: `视频地址: ${this.data.videoPath}` }
              ]
            }
          ]
        });
      } else {
        this.list = [];
      }
      return this.list;
    }
  },
  methods: {
    //取消弹窗
    handleCancel() {
      this.$parent.isView = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.mine >>> .el-tree-node__label {
  display: inline-block;
  width: 830px;
  word-break: break-all;
  white-space: pre-wrap;
}
.mine >>> .el-tree-node__content {
  height: 40px;
}
>>> .el-upload-list {
  text-align: left;
  width: 80%;
  margin: 0 auto;
}
>>> .el-dialog__body {
  padding: 0px 25px 30px;
  overflow-y: auto;
  height: 75vh;
}
</style>
