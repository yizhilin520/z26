<template>
  <el-dialog
    center
    title="影片详情"
    :visible.sync="show"
    width="50%"
    class="dialog-style my-dialog mine"
    :before-close="handleCancel"
  >
    <el-tree
      default-expand-all
      empty-text="该视频文件无法解析"
      :data="dataInfo"
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
    }
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label"
      },
      dataInfo: []
    };
  },
  mounted() {},
  methods: {
    //取消弹窗
    handleCancel() {
      this.$parent.isTree = false;
      this.dataInfo = [];
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
  max-height: 75vh;
}
</style>
