<template>
  <div class="s-user">
    <!-- 视频数据总览-->
    <div class="base">
      <h3 class="title">播放数据概览</h3>
      <div class="base-content">
        <el-row :gutter="32">
          <div v-for="(item, idx) in baseList" :key="idx">
            <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="5">
              <el-card class="box-card" shadow="hover">
                <div>{{ item.title }}</div>
                <h4>{{ item.userNums }}</h4>
              </el-card>
              <div v-show="item.iosImg" class="des">
                <img class="des-img" :src="item.iosImg" alt />
                <p class="text_right">{{ item.ios }}</p>
                <p>{{ item.iosNums }}</p>
              </div>
              <div v-show="item.androidImg" class="des">
                <img class="des-img" :src="item.androidImg" alt />
                <p class="text_right">{{ item.android }}</p>
                <p>{{ item.androidNums }}</p>
              </div>
            </el-col>
          </div>
        </el-row>
      </div>
    </div>

    <div style="margin-top: 20px"></div>

    <div class="base">
      <!-- 时段折线图 -->
      <div class="p_chart">
        <div class="btns">
          <div
            v-for="item in playList"
            :key="item.value"
            :class="[idx === item.value ? 'btn-active' : 'btn-txt']"
            @click="handleBtns(item)"
          >
            <div>{{ item.name }}</div>
          </div>
        </div>
        <div class="p_line">
          <line-chart
            height="450px"
            width="100%"
            :chart-data="playChartData"
            v-if="idx === '0'"
          />
          <line-chart
            height="450px"
            width="100%"
            :chart-data="playChartData"
            v-else-if="idx === '1'"
          />
          <line-chart
            height="450px"
            width="100%"
            :chart-data="playChartData"
            v-else
          />
        </div>
      </div>
      <div style="margin-top: 50px"></div>
      <!-- 播放次数统计 -->
      <div class="trend">
        <div class="base-content">
          <div class="title-box">
            <h3 class="title">播放次数统计</h3>
          </div>
          <el-row :gutter="32">
            <el-col>
              <template v-if="idx === '0'">
                <tables
                  :todayNum="todayNum"
                  :iosTodayNum="iosTodayNum"
                  :azTodayNum="azTodayNum"
                  :yesterdayNum="yesterdayNum"
                  :iosYesterdayNum="iosYesterdayNum"
                  :azYesterdayNum="azYesterdayNum"
                ></tables>
              </template>
              <template v-else-if="idx === '1'">
                <tables
                  :todayNum="todayNum"
                  :iosTodayNum="iosTodayNum"
                  :azTodayNum="azTodayNum"
                  :yesterdayNum="yesterdayNum"
                  :iosYesterdayNum="iosYesterdayNum"
                  :azYesterdayNum="azYesterdayNum"
                ></tables>
              </template>
              <template v-else>
                <tables
                  :todayNum="todayNum"
                  :iosTodayNum="iosTodayNum"
                  :azTodayNum="azTodayNum"
                  :yesterdayNum="yesterdayNum"
                  :iosYesterdayNum="iosYesterdayNum"
                  :azYesterdayNum="azYesterdayNum"
                ></tables>
              </template>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { playCount, playTimeCount } from "@/api/statistics_api";
import LineChart from "@/components/vueEcharts/Linechart";
import { parseTime } from "@/utils/index.js";
import helper from "@/utils/helper.js";
import Tables from "./components/Tables";
export default {
  name: "VideoStatistics",
  components: {
    LineChart,
    Tables,
  },
  data() {
    return {
      playList: [
        { name: "时段播放url请求量", value: "0" },
        { name: "时段影片播放次数", value: "1" },
        { name: "时段短视频播放次数", value: "2" },
      ],

      baseList: [
        {
          title: "上月用户在APP的平均停留时长",
          userNums: "",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "",
          android: "安卓",
          androidNums: "",
        },
        {
          title: "本月用户在APP的平均停留时长",
          userNums: "",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "",
          android: "安卓",
          androidNums: "",
        },
        {
          title: "上月用户平均观影时长",
          userNums: "",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "",
          android: "安卓",
          androidNums: "",
        },

        {
          title: "本月用户平均观影时长",
          userNums: "",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "",
          android: "安卓",
          androidNums: "",
        },
        {
          title: "昨日影片观影量",
          userNums: "",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "",
          android: "安卓",
          androidNums: "",
        },
        {
          title: "今日影片观影量",
          userNums: "",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "",
          android: "安卓",
          androidNums: "",
        },
        {
          title: "昨日短视频观影量",
          userNums: "",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "",
          android: "安卓",
          androidNums: "",
        },
        {
          title: "今日短视频观影量",
          userNums: "",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "",
          android: "安卓",
          androidNums: "",
        },
        // {
        //   title: "昨日播放url请求失败率",
        //   userNums: "",
        //   iosImg: require("@/assets/images/ios.png"),
        //   androidImg: require("@/assets/images/android.png"),
        //   ios: "苹果",
        //   iosNums: "",
        //   android: "安卓",
        //   androidNums: "",
        // },
        // {
        //   title: "今日播放url请求失败率",
        //   userNums: "",
        //   iosImg: require("@/assets/images/ios.png"),
        //   androidImg: require("@/assets/images/android.png"),
        //   ios: "苹果",
        //   iosNums: "",
        //   android: "安卓",
        //   androidNums: "",
        // },
      ],
      idx: "0",
      playChartData: {
        expectedData: [],
        dateData: [],
        actualData: [],
        nameData: [],
      },
      todayNum: [],
      iosTodayNum: [],
      azTodayNum: [],
      yesterdayNum: [],
      iosYesterdayNum: [],
      azYesterdayNum: [],
    };
  },
  mounted() {
    this.fetchGetData();
    this.getTodayData();
    this.getYesterdayData();
  },
  methods: {
    fetchGetData() {
      playCount().then((res) => {
        if (res.code * 1 === 200) {
          const { userPlayVo } = res.data;
          this.baseList[0].userNums = helper.formatSeconds(
            userPlayVo.beforeRemainTime
          );
          this.baseList[0].iosNums = helper.formatSeconds(
            userPlayVo.iosBeforeRemainTime
          );
          this.baseList[0].androidNums = helper.formatSeconds(
            userPlayVo.azBeforeRemainTime
          );

          this.baseList[1].userNums = helper.formatSeconds(
            userPlayVo.monthRemainTime
          );
          this.baseList[1].iosNums = helper.formatSeconds(
            userPlayVo.iosMonthRemainTime
          );
          this.baseList[1].androidNums = helper.formatSeconds(
            userPlayVo.azMonthRemainTime
          );

          this.baseList[2].userNums = helper.formatSeconds(
            userPlayVo.beforeAverageTime
          );
          this.baseList[2].iosNums = helper.formatSeconds(
            userPlayVo.iosBeforeAverageTime
          );
          this.baseList[2].androidNums = helper.formatSeconds(
            userPlayVo.azBeforeAverageTime
          );

          this.baseList[3].userNums = helper.formatSeconds(
            userPlayVo.monthAverageTime
          );
          this.baseList[3].iosNums = helper.formatSeconds(
            userPlayVo.iosMonthAverageTime
          );
          this.baseList[3].androidNums = helper.formatSeconds(
            userPlayVo.azMonthAverageTime
          );

          this.baseList[4].userNums = userPlayVo.yesterdayMoveTotal;
          this.baseList[4].iosNums = userPlayVo.iosYesterdayMoveTotal;
          this.baseList[4].androidNums = userPlayVo.azYesterdayMoveTotal;

          this.baseList[5].userNums = userPlayVo.todayMoveTotal;
          this.baseList[5].iosNums = userPlayVo.iosTodayMoveTotal;
          this.baseList[5].androidNums = userPlayVo.azTodayMoveTotal;

          this.baseList[6].userNums = userPlayVo.yesterdayTotal;
          this.baseList[6].iosNums = userPlayVo.iosYesterdayTotal;
          this.baseList[6].androidNums = userPlayVo.azYesterdayTotal;

          this.baseList[7].userNums = userPlayVo.todayTotal;
          this.baseList[7].iosNums = userPlayVo.iosTodayTotal;
          this.baseList[7].androidNums = userPlayVo.azTodayTotal;

          // this.baseList[8].userNums = this.turnPercent(
          //   userPlayVo.yesterdayUrlFail
          // );
          // this.baseList[8].iosNums = this.turnPercent(
          //   userPlayVo.iosYesterdayUrlFail
          // );
          // this.baseList[8].androidNums = this.turnPercent(
          //   userPlayVo.azYesterdayUrlFail
          // );

          // this.baseList[9].userNums = this.turnPercent(userPlayVo.todayUrlFail);
          // this.baseList[9].iosNums = this.turnPercent(
          //   userPlayVo.iosTodayUrlFail
          // );
          // this.baseList[9].androidNums = this.turnPercent(
          //   userPlayVo.azTodayUrlFail
          // );
        }
      });
    },
    // 转百分比
    turnPercent(item) {
      return item >= 1 ? "100%" : (parseFloat(item) * 100).toFixed(2) + "%";
    },
    // 今日
    getTodayData() {
      playTimeCount({
        startDate: parseTime(Date.now(), "{y}-{m}-{d}"),
        type: this.idx,
      })
        .then((res) => {
          if (res.code * 1 === 200) {
            this.playChartData.nameData[0] = "今日";
            switch (this.idx) {
              case "0":
                let { azUrlRequest, iosUrlRequest, urlRequest } = res.data;
                this.playChartData.expectedData = urlRequest.map((item) => {
                  return item.count;
                });
                this.playChartData.dateData = urlRequest.map((item) => {
                  return `${item.hour >= 10 ? item.hour : "0" + item.hour}点`;
                });
                this.azTodayNum = azUrlRequest;
                this.iosTodayNum = iosUrlRequest;
                this.todayNum = urlRequest;
                return;
              case "1":
                let { azMoveNum, iosMoveNum, moveNum } = res.data;
                this.playChartData.expectedData = moveNum.map((item) => {
                  return item.count;
                });
                this.playChartData.dateData = moveNum.map((item) => {
                  return `${item.hour >= 10 ? item.hour : "0" + item.hour}点`;
                });
                this.azTodayNum = azMoveNum;
                this.iosTodayNum = iosMoveNum;
                this.todayNum = moveNum;
                return;
              case "2":
                let { azVideoNum, iosVideoNum, videoNum } = res.data;
                this.playChartData.expectedData = videoNum.map((item) => {
                  return item.count;
                });
                this.playChartData.dateData = videoNum.map((item) => {
                  return `${item.hour >= 10 ? item.hour : "0" + item.hour}点`;
                });
                this.azTodayNum = azVideoNum;
                this.iosTodayNum = iosVideoNum;
                this.todayNum = videoNum;
                return;
              default:
                return;
            }
          }
        })
        .catch(() => {});
    },
    // 昨日
    getYesterdayData() {
      playTimeCount({
        startDate: parseTime(Date.now() - 24 * 3600 * 1000, "{y}-{m}-{d}"),
        type: this.idx,
      })
        .then((res) => {
          if (res.code * 1 === 200) {
            this.playChartData.nameData[1] = "昨日";

            switch (this.idx) {
              case "0":
                let { azUrlRequest, iosUrlRequest, urlRequest } = res.data;
                this.playChartData.actualData = urlRequest.map((item) => {
                  return item.count;
                });
                this.azYesterdayNum = azUrlRequest;
                this.iosYesterdayNum = iosUrlRequest;
                this.yesterdayNum = urlRequest;
                break;
              case "1":
                let { azMoveNum, iosMoveNum, moveNum } = res.data;
                this.playChartData.actualData = moveNum.map((item) => {
                  return item.count;
                });
                this.azYesterdayNum = azMoveNum;
                this.iosYesterdayNum = iosMoveNum;
                this.yesterdayNum = moveNum;
                break;
              case "2":
                let { azVideoNum, iosVideoNum, videoNum } = res.data;
                this.playChartData.actualData = videoNum.map((item) => {
                  return item.count;
                });
                this.azYesterdayNum = azVideoNum;
                this.iosYesterdayNum = iosVideoNum;
                this.yesterdayNum = videoNum;
                break;

              default:
                break;
            }
          }
        })
        .catch(() => {});
    },
    // 切换btns
    handleBtns(it) {
      this.idx = it.value;
      Promise.all[(this.getTodayData(), this.getYesterdayData())];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/statistics.scss";
.base-content {
  margin-left: 0 !important;
}
.play_style {
  font-size: 13px;
}
.p_chart .btns {
  justify-content: space-around !important;
}
</style>
