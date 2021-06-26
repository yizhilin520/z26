<template>
  <div class="s-user">
    <div class="base">
      <div class="p_chart">
        <h4>短视频上传</h4>
        <div class="btns">
          <div
            v-for="item in uploadList"
            :key="item.value"
            :class="[idx === item.value ? 'btn-active' : 'btn-txt']"
            @click="handleBtns('video', item)"
          >
            <div>{{ item.name }}</div>
          </div>
        </div>
        <div class="p_text" ref="upload"></div>
      </div>
    </div>
    <div style="margin-top:30px"></div>
    <div class="base">
      <div class="p_chart">
        <h4>帖子发布</h4>
        <div class="btns">
          <div
            v-for="item in postList"
            :key="item.value"
            :class="[index === item.value ? 'btn-active' : 'btn-txt']"
            @click="handleBtns('post', item)"
          >
            <div>{{ item.name }}</div>
          </div>
        </div>
        <div class="p_text" ref="post"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { userUpload } from "@/api/income_api";
export default {
  name: "UserUpload",
  components: {},
  data() {
    return {
      idx: "1",
      index: "1",
      uploadList: [
        { name: "昨日上传", value: "1" },
        { name: "今日上传", value: "2" },
        { name: "上周上传", value: "3" },
        { name: "本周上传", value: "4" },
        { name: "上月上传", value: "5" },
        { name: "本月上传", value: "6" }
      ],
      postList: [
        { name: "昨日发布", value: "1" },
        { name: "今日发布", value: "2" },
        { name: "上周发布", value: "3" },
        { name: "本周发布", value: "4" },
        { name: "上月发布", value: "5" },
        { name: "本月发布", value: "6" }
      ],
      uploadData: null
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      let res = await userUpload();
      if (res.code * 1 === 200) {
        this.uploadData = res.data.appUserUploadVo;
        this.splitData();
      }
    },
    splitData() {
      let {
        yesterdayUploadVideo,
        yesterdayUploadPass,
        todayUploadVideo,
        todayUploadPass,
        lastWeekUploadVideo,
        lastWeekUploadPass,
        thisWeekUploadVideo,
        thisWeekUploadPass,
        lastMonthUploadVideo,
        lastMonthUploadPass,
        thisMonthUploadVideo,
        thisMonthUploadPass,
        yesterdayUploadPost,
        yesterdayPostPass,
        todayUploadPost,
        todayPostPass,
        lastWeekUploadPost,
        lastWeekPostPass,
        thisWeekUploadPost,
        thisWeekPostPass,
        lastMonthUploadPost,
        lastMonthPostPass,
        thisMonthUploadPost,
        thisMonthPostPass
      } = this.uploadData;
      let idx = this.idx;
      let index = this.index;
      idx === "1"
        ? this.uploadHtml("昨日", yesterdayUploadVideo, yesterdayUploadPass)
        : idx === "2"
        ? this.uploadHtml("今日", todayUploadVideo, todayUploadPass)
        : idx === "3"
        ? this.uploadHtml("上周", lastWeekUploadVideo, lastWeekUploadPass)
        : idx === "4"
        ? this.uploadHtml("本周", thisWeekUploadVideo, thisWeekUploadPass)
        : idx === "5"
        ? this.uploadHtml("上月", lastMonthUploadVideo, lastMonthUploadPass)
        : idx === "6"
        ? this.uploadHtml("本月", thisMonthUploadVideo, thisMonthUploadPass)
        : "";
      index === "1"
        ? this.postHtml("昨日", yesterdayUploadPost, yesterdayPostPass)
        : index === "2"
        ? this.postHtml("今日", todayUploadPost, todayPostPass)
        : index === "3"
        ? this.postHtml("上周", lastWeekUploadPost, lastWeekPostPass)
        : index === "4"
        ? this.postHtml("本周", thisWeekUploadPost, thisWeekPostPass)
        : index === "5"
        ? this.postHtml("上月", lastMonthUploadPost, lastMonthPostPass)
        : index === "6"
        ? this.postHtml("本月", thisMonthUploadPost, thisMonthPostPass)
        : "";
    },
    uploadHtml(str, num1, num2) {
      this.$refs.upload.innerHTML = this.html(str, num1, num2);
    },
    postHtml(str, num1, num2) {
      this.$refs.post.innerHTML = this.html(str, num1, num2);
    },
    html(str, num1, num2) {
      return `${str}上传<span style="color: #02a7f0;"> ${num1 ||
        0} </span>部，审核通过<span style="color: #02a7f0;"
              > ${num2 || 0} </span>部`;
    },
    // 切换btns
    handleBtns(type, it) {
      type === "video" ? (this.idx = it.value) : (this.index = it.value);
      this.splitData();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/statistics.scss";

.p_chart {
  .btns {
    width: 70%;
    justify-content: space-between;
  }
  .p_line {
    margin-top: 40px;
  }
  .p_text {
    margin-top: 20px;
    font-size: 24px;
    font-weight: bold;
    .p_num {
      display: inline-block;
      color: #02a7f0;
    }
  }
}
.btns {
  @extend .disflex;
}
.btn-txt,
.btn-active {
  width: auto;
  height: 35px;
  line-height: 35px;
  text-align: center;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0 30px !important;
  border-radius: 20px;
  font-size: 14px;
}
.btn-active {
  background: #169bd5;
  color: #fff;
}
.btn-txt {
  border: 1px solid #ccc;
}
.base:hover {
  box-shadow: none !important;
}
.base {
  padding: 20px 25px 40px !important;
  border: 1px solid #dbdbdb;
}
</style>
