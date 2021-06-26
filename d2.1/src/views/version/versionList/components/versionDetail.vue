<template>
  <el-dialog
    v-if="row != null"
    custom-class="my-dialog"
    center
    title="版本详情"
    width="50%"
    :visible.sync="show"
    :before-close="handleCancel"
  >
    <div class="form_box">
      <h5 class="text">版本号：{{ versionInfo.versionCode }}</h5>
      <h5 class="text">版本名称：{{ versionInfo.versionName }}</h5>
      <h5 class="text">
        更新类型：{{ versionInfo.isUpdate ? "强制更新" : "普通更新" }}
      </h5>
      <h5 class="text">安卓包地址</h5>
      <div class="text" v-if="versionInfo.originType == '1'">
        <div class="" v-for="item in row.appUrl" :key="item.cid">
          <span v-show="item.cid === '0'"
            >生产包下载地址: {{ item.appUrl }}</span
          >
          <span v-show="item.cid === '1'"
            >渠道下载地址一: {{ item.appUrl }}</span
          >
          <span v-show="item.cid === '2'"
            >渠道下载地址二: {{ item.appUrl }}</span
          >
          <span v-show="item.cid === '3'"
            >渠道下载地址三: {{ item.appUrl }}</span
          >
          <span v-show="item.cid === '4'"
            >渠道下载地址四: {{ item.appUrl }}</span
          >
          <span v-show="item.cid === '5'"
            >渠道下载地址五: {{ item.appUrl }}</span
          >
          <span v-show="item.cid === '6'"
            >渠道下载地址六: {{ item.appUrl }}</span
          >
          <span v-show="item.cid === '7'"
            >渠道下载地址七: {{ item.appUrl }}</span
          >
          <span v-show="item.cid === '8'"
            >渠道下载地址八: {{ item.appUrl }}</span
          >
          <span v-show="item.cid === '9'"
            >渠道下载地址九: {{ item.appUrl }}</span
          >
          <span v-show="item.cid === '10'"
            >渠道下载地址十: {{ item.appUrl }}</span
          >
        </div>
      </div>
      <h5 class="text">iOS包地址</h5>
      <div class="text" v-if="versionInfo.originType == '0'">
        <div class="" v-for="item in row.appUrl" :key="item.cid">
          <span v-show="item.cid === '0'"
            >生产包下载地址: {{ item.appUrl }}</span
          >
          <span v-show="item.cid === '1'"
            >渠道下载地址一: {{ item.appUrl }}</span
          >
          <span v-show="item.cid === '2'"
            >渠道下载地址二: {{ item.appUrl }}</span
          >
          <span v-show="item.cid === '3'"
            >渠道下载地址三: {{ item.appUrl }}</span
          >
          <span v-show="item.cid === '4'"
            >渠道下载地址四: {{ item.appUrl }}</span
          >
          <span v-show="item.cid === '5'"
            >渠道下载地址五: {{ item.appUrl }}</span
          >
          <span v-show="item.cid === '6'"
            >渠道下载地址六: {{ item.appUrl }}</span
          >
          <span v-show="item.cid === '7'"
            >渠道下载地址七: {{ item.appUrl }}</span
          >
          <span v-show="item.cid === '8'"
            >渠道下载地址八: {{ item.appUrl }}</span
          >
          <span v-show="item.cid === '9'"
            >渠道下载地址九: {{ item.appUrl }}</span
          >
          <span v-show="item.cid === '10'"
            >渠道下载地址十: {{ item.appUrl }}</span
          >
        </div>
      </div>

      <h5 class="text">更新说明：</h5>
      <div class="text">
        {{ versionInfo.versionExplain }}
      </div>
      <h5 class="text">更新公告标题：</h5>
      <div class="text">{{ versionInfo.versionTitle }}</div>
      <h5 class="text">更新公告内容：</h5>
      <div class="text">
        {{ versionInfo.versionContent }}
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
    }
  },

  data() {
    return {
      row: null
    };
  },
  computed: {
    versionInfo() {
      if (this.row != null) return this.row.versionInfo;
    },
    iosAppUrl() {
      if (this.row != null) return this.row.iosAppUrl;
    },
    azAppUrl() {
      if (this.row != null) return this.row.azAppUrl;
    }
  },
  mounted() {},
  methods: {
    //取消弹窗
    handleCancel() {
      this.$parent.isView = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.form_box {
  display: flex;
  justify-content: center;
  // align-items: center;
  flex-direction: column;
}
.text {
  font-size: 16px;
  line-height: 1.8;
  padding: 5px 100px;
}
h5 {
  margin: 0;
  padding: 0;
}
</style>
