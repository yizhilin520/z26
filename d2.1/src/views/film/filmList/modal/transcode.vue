<template>
  <el-dialog
    center
    custom-class="custom-dialog my-dialog"
    title="选择转码方式"
    :visible.sync="show"
    width="50%"
    :before-close="handleCancel"
  >
    <el-form
      style="padding-left: 45%;"
      :model="transForm"
      class="demo-ruleForm"
    >
      <el-form-item>
        <el-radio v-model="transForm.checkType" label="1">标清</el-radio>
      </el-form-item>
      <el-form-item>
        <el-radio v-model="transForm.checkType" label="2">重新编码</el-radio>
      </el-form-item>
    </el-form>
    <div class="trans_txt">
      说明：
      <p>已转码过的视频将不再进行二次转码</p>
      <p>标清（转码为符合手机播放的尺寸横屏960*544或竖屏544*960）</p>
      <p>
        重编码（不改变视频原来尺寸，只是将视频重新编码符合流畅播放的标准）
      </p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleTranscode">确 定</el-button>
    </span>
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
      transForm: {
        checkType: "1"
      }
    };
  },
  methods: {
    //确定
    handleTranscode() {},
    //取消弹窗
    handleCancel() {
      this.$parent.isTrans = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.trans_txt {
  text-align: left;
  margin: 0 25%;
  width: 100%;
}
</style>
