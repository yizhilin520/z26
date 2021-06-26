<template>
  <div class="user-statis">
    <!-- 基础数据概览 -->
    <div class="base">
      <div class="title">基础数据概览</div>
      <div class="base-content">
        <el-row :gutter="32">
          <div v-for="(item, idx) in baseList" :key="idx">
            <el-col :xs="12" :sm="8" :md="6" :lg="4">
              <el-card class="box-card" shadow="hover">
                <div>{{ item.title }}</div>
                <h4>{{ item.userNums }}</h4>
              </el-card>
              <div class="des">
                <img class="des-img" :src="item.iosImg" alt />
                <p class="text_right">{{ item.ios }}</p>
                <p>{{ item.iosNums }}</p>
              </div>
              <div class="des">
                <img class="des-img" :src="item.androidImg" alt />
                <p class="text_right">{{ item.android }}</p>
                <p>{{ item.androidNums }}</p>
              </div>
            </el-col>
          </div>
        </el-row>
      </div>
    </div>
    <div style="margin-top: 20px" />

    <div class="base">
      <!-- 整体趋势 -->
      <div class="trend">
        <div class="title">整体趋势</div>
        <div class="base-content">
          <el-row :gutter="32">
            <el-col :sm="24" :md="16">
              <div class="btns">
                <div
                  v-for="item in trendList"
                  :key="item.value"
                  :class="[idx === item.value ? 'btn-active' : 'btn-txt']"
                  @click="handleTrendBtns(item)"
                >
                  <div>{{ item.name }}</div>
                </div>
              </div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div
                class="right-date"
                v-for="(item, index) in trendList"
                :key="index"
              >
                <el-date-picker
                  v-if="item.value === idx"
                  v-model="trendDateTime[idx]"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  @change="handleDateChange"
                />
              </div>
            </el-col>
            <el-col :sm="12" :md="2">
              <el-button type="primary" @click="handleTrendSearch"
                >查询</el-button
              >
            </el-col>
          </el-row>
          <el-row :gutter="32">
            <el-col>
              <div v-if="idx === '0'" class="line_chart">
                <line-chart
                  height="450px"
                  width="100%"
                  :chart-data="newCountUserData"
                />
              </div>
              <div v-if="idx === '1'" class="line_chart">
                <line-chart
                  height="450px"
                  width="100%"
                  :chart-data="visitorCountData"
                />
              </div>
              <div v-if="idx === '2'" class="line_chart">
                <line-chart
                  height="450px"
                  width="100%"
                  :chart-data="activeRegisterData"
                />
              </div>
              <div v-if="idx === '3'" class="line_chart">
                <line-chart
                  height="450px"
                  width="100%"
                  :chart-data="toatalUsersData"
                />
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div style="margin-top: 20px" />

      <!-- 在线用户趋势 -->
      <div class="trend">
        <div class="title">在线用户趋势</div>
        <div class="base-content">
          <el-row :gutter="16">
            <el-col :sm="12" :md="6" :push="16">
              <div class="right-date">
                <el-date-picker
                  v-model="onlineDateTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  @change="handleOnlineChange"
                />
              </div>
            </el-col>

            <el-col :sm="12" :md="2" :push="16">
              <el-button type="primary" @click="handleOnlineSearch"
                >查询</el-button
              >
            </el-col>
          </el-row>
          <el-row :gutter="32">
            <el-col>
              <div class="line_chart">
                <line-chart
                  height="450px"
                  width="100%"
                  :chart-data="onlineStatisticsData"
                />
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div style="margin-top: 20px" />

      <!-- TOP -->
      <div class="top">
        <el-row>
          <el-col :md="24" :lg="11" :offset="-1">
            <div class="top">
              <el-row :gutter="16">
                <el-col :span="12">
                  <div class="title subtitle">TOP版本</div>
                </el-col>
                <el-col :span="12">
                  <div class="btns">
                    <div
                      v-for="item in versionList"
                      :key="item.value"
                      :class="[
                        versionIdx === item.value ? 'btn-active' : 'btn-txt'
                      ]"
                      @click="handleTopVersionBtns(item)"
                      class="btn-txt"
                    >
                      {{ item.name }}
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="16">
                <el-col :span="24">
                  <div class="btns plantform">
                    <div
                      v-for="item in plantform"
                      :key="item.value"
                      :class="[
                        plantformIdx === item.value ? 'btn-active' : 'btn-txt'
                      ]"
                      @click="handlePlantformBtns(item)"
                      class="btn-txt"
                    >
                      {{ item.name }}
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="16">
                <el-col :span="24">
                  <div class="line_chart">
                    <Barchart
                      height="500px"
                      width="100%"
                      :chart-data="annularWeekData"
                      v-if="annularWeekData.countList.length > 0"
                    />
                    <div v-else class="no_data">暂无数据</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :md="24" :lg="11" :offset="1">
            <el-row :gutter="16">
              <el-col :span="12">
                <div class="title subtitle">TOP渠道</div>
              </el-col>
              <el-col :span="12">
                <div class="top-text">
                  <div
                    v-for="item in topChannelList"
                    :key="item.value"
                    :class="[
                      channelIdx === item.value ? 'btn-active' : 'btn-txt'
                    ]"
                    @click="handleTopChannelBtns(item)"
                    class="btn-txt"
                  >
                    {{ item.name }}
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :span="24">
                <div class="btns plantform" style="height:35px"></div>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :span="24">
                <div class="line_chart">
                  <Barchart
                    height="500px"
                    width="100%"
                    :chart-data="channelWeekData"
                    v-if="channelWeekData.countList.length > 0"
                  />
                  <div v-else class="no_data">暂无数据</div>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getUserStatistics,
  onlineStatistics,
  newDiscountStatistics,
  newAnnularStatistics
} from "@/api/statistics_api";
import { parseTime } from "@/utils/index.js";
import LineChart from "@/components/vueEcharts/Linechart";
import Barchart from "@/components/vueEcharts/Barchart";
export default {
  name: "UserStatistics",
  components: {
    LineChart,
    Barchart
  },
  data() {
    return {
      trendList: [
        { name: "新增用户", value: "0" },
        { name: "活跃游客用户", value: "1" },
        { name: "活跃注册用户", value: "2" },
        { name: "总用户", value: "3" }
      ],
      versionList: [
        { name: "活跃用户", value: "4" },
        { name: "总用户", value: "3" }
      ],
      topChannelList: [
        { name: "活跃用户", value: "0" },
        { name: "总用户", value: "1" }
      ],
      plantform: [{ name: "iOS", value: "0" }, { name: "安卓", value: "1" }],
      baseList: [
        {
          title: "总用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0"
        },
        {
          title: "总注册用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0"
        },
        {
          title: "总游客用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0"
        },
        {
          title: "总会员用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0"
        },
        {
          title: "今日新增用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0"
        },
        {
          title: "昨日新增用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0"
        },
        {
          title: "今日活跃注册用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0"
        },
        {
          title: "昨日活跃注册用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0"
        },
        {
          title: "今日活跃游客用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0"
        },
        {
          title: "昨日活跃游客用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0"
        },
        {
          title: "当前在线用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0"
        }
      ],
      idx: "0",
      versionIdx: "4",
      channelIdx: "0",
      trendDateTime: [],
      keepDateTime: [],
      onlineDateTime: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      //新增用户
      newCountUserData: {
        expectedData: [],
        dateData: [],
        actualData: []
      },
      // 活跃游客用户
      visitorCountData: {
        expectedData: [],
        dateData: [],
        actualData: []
      },
      // 活跃注册用户
      activeRegisterData: {
        expectedData: [],
        dateData: [],
        actualData: []
      },
      // 总用户
      toatalUsersData: {
        expectedData: [],
        dateData: [],
        actualData: []
      },
      // 在线用户趋势
      onlineStatisticsData: {
        expectedData: [],
        dateData: [],
        actualData: []
      },
      dataParams: {
        startTime: "",
        endTime: "",
        userType: 0
      },
      pageSize: 10,
      pageNum: 1,
      total: 0,
      channelList: [],
      //top版本
      annularWeekData: {
        dateList: [],
        name: "",
        countList: []
      },
      // top渠道
      channelWeekData: {
        dateList: [],
        name: "",
        countList: []
      },
      plantformIdx: "0"
    };
  },
  mounted() {
    Promise.all[
      (this.fetchGetData(),
      this.fetchGetTrend(),
      this.getOnlineStatistics(),
      this.fetchAnnularData())
    ];
  },
  methods: {
    // 基础数据概览
    fetchGetData() {
      getUserStatistics().then(res => {
        if (res.code === 200 && res.data !== null) {
          const { appUserStatisticsVo } = res.data;

          // 总用户
          this.baseList[0].userNums = appUserStatisticsVo.sumUser;
          this.baseList[0].iosNums = appUserStatisticsVo.iosSumUser;
          this.baseList[0].androidNums = appUserStatisticsVo.azSumUser;

          // 总注册用户
          this.baseList[1].userNums = appUserStatisticsVo.registerUser;
          this.baseList[1].iosNums = appUserStatisticsVo.iosRegisterUser;
          this.baseList[1].androidNums = appUserStatisticsVo.azRegisterUser;

          // 总游客用户
          this.baseList[2].userNums = appUserStatisticsVo.visitorCount;
          this.baseList[2].iosNums = appUserStatisticsVo.iosvisitorCount;
          this.baseList[2].androidNums = appUserStatisticsVo.azvisitorCount;

          // 总会员用户
          this.baseList[3].userNums = appUserStatisticsVo.vipUser;
          this.baseList[3].iosNums = appUserStatisticsVo.iosVipUser;
          this.baseList[3].androidNums = appUserStatisticsVo.azVipUser;

          // 今日新增用户
          this.baseList[4].userNums = appUserStatisticsVo.todayNewUser;
          this.baseList[4].iosNums = appUserStatisticsVo.iosTodayNewUser;
          this.baseList[4].androidNums = appUserStatisticsVo.azTodayNewUser;

          // 昨日新增用户
          this.baseList[5].userNums = appUserStatisticsVo.yesterdayNewUser;
          this.baseList[5].iosNums = appUserStatisticsVo.iosYesterdayNewUser;
          this.baseList[5].androidNums = appUserStatisticsVo.azYesterdayNewUser;

          // 今日活跃注册用户
          this.baseList[6].userNums = appUserStatisticsVo.todayActiveUser;
          this.baseList[6].iosNums = appUserStatisticsVo.iosTodayActiveUser;
          this.baseList[6].androidNums = appUserStatisticsVo.azTodayActiveUser;

          // 昨日活跃注册用户
          this.baseList[7].userNums = appUserStatisticsVo.yesterdayActiveUser;
          this.baseList[7].iosNums = appUserStatisticsVo.iosYesterdayActiveUser;
          this.baseList[7].androidNums =
            appUserStatisticsVo.azYesterdayActiveUser;

          // 今日活跃游客用户
          this.baseList[8].userNums = appUserStatisticsVo.todayVisitorCount;
          this.baseList[8].iosNums = appUserStatisticsVo.iosTodayVisitorCount;
          this.baseList[8].androidNums =
            appUserStatisticsVo.azTodayVisitorCount;

          // 昨日活跃游客用户
          this.baseList[9].userNums = appUserStatisticsVo.yesterdayVisitorCount;
          this.baseList[9].iosNums =
            appUserStatisticsVo.iosYesterdayVisitorCount;
          this.baseList[9].androidNums =
            appUserStatisticsVo.azYesterdayVisitorCount;

          // 当前在线用户
          this.baseList[10].userNums = appUserStatisticsVo.onlineCount;
          this.baseList[10].iosNums = appUserStatisticsVo.iosonlineCount;
          this.baseList[10].androidNums = appUserStatisticsVo.azOnlineCount;
        }
      });
    },

    // 整体趋势
    fetchGetTrend(data) {
      let params = {
        startTime: "",
        endTime: "",
        userType: 0
      };
      params = Object.assign(params, data);
      newDiscountStatistics(params).then(res => {
        if (res.code === 200 && res.data !== null) {
          const { azUserWeekInfoList, userWeekInfoList } = res.data;
          // 新增用户
          this.newCountUserData.expectedData = userWeekInfoList.map(item => {
            return item.count;
          });
          this.newCountUserData.dateData = userWeekInfoList.map(item => {
            return item.createTime;
          });
          this.newCountUserData.actualData = azUserWeekInfoList.map(item => {
            return item.count;
          });

          // 活跃游客用户 visitorCountData
          this.visitorCountData.expectedData = userWeekInfoList.map(item => {
            return item.count;
          });
          this.visitorCountData.dateData = userWeekInfoList.map(item => {
            return item.createTime;
          });
          this.visitorCountData.actualData = azUserWeekInfoList.map(item => {
            return item.count;
          });

          // 活跃注册用户 activeRegisterData
          this.activeRegisterData.expectedData = userWeekInfoList.map(item => {
            return item.count;
          });
          this.activeRegisterData.dateData = userWeekInfoList.map(item => {
            return item.createTime;
          });
          this.activeRegisterData.actualData = azUserWeekInfoList.map(item => {
            return item.count;
          });

          // 总用户 toatalUsersData
          this.toatalUsersData.expectedData = userWeekInfoList.map(item => {
            return item.count;
          });
          this.toatalUsersData.dateData = userWeekInfoList.map(item => {
            return item.createTime;
          });
          this.toatalUsersData.actualData = azUserWeekInfoList.map(item => {
            return item.count;
          });
        }
      });
    },

    // 用户在线统计
    getOnlineStatistics(data) {
      let params = {
        startTime: "",
        endTime: ""
      };
      params = Object.assign({}, params, data);
      onlineStatistics({ ...params })
        .then(res => {
          if (Number(res.code) === 200) {
            const { azUserWeekInfoList, userWeekInfoList } = res.data;
            // 在线用户
            this.onlineStatisticsData.expectedData = userWeekInfoList.map(
              item => {
                return item.count;
              }
            );
            this.onlineStatisticsData.dateData = userWeekInfoList.map(item => {
              return item.createTime;
            });
            this.onlineStatisticsData.actualData = azUserWeekInfoList.map(
              item => {
                return item.count;
              }
            );
          }
        })
        .catch(() => {});
    },

    // top统计
    fetchAnnularData(data) {
      let params = {
        channelType: 0,
        userType: 4,
        originType: 0
      };
      params = Object.assign(params, data);
      newAnnularStatistics(params).then(res => {
        if (res.code === 200 && res.data !== null) {
          const { annularWeek, channelWeek } = res.data;

          let annularWeekList = annularWeek.filter(it => it.count != 0);
          this.annularWeekData.countList = annularWeekList.map(item => {
            return { value: item.count, name: "版本" + item.version };
          });
          this.versionList.filter(it => {
            it.value == this.versionIdx &&
              (this.annularWeekData.name = it.name);
          });
          this.annularWeekData.dateList = annularWeek.map(item => {
            return "版本" + item.version;
          });

          let channelWeekList = channelWeek.filter(it => it.count != 0);
          this.channelWeekData.countList = channelWeekList.map(item => {
            return { value: item.count, name: item.channelName };
          });

          this.topChannelList.filter(it => {
            it.value == this.channelIdx &&
              (this.channelWeekData.name = it.name);
          });
          this.channelWeekData.dateList = channelWeek.map(item => {
            return item.channelName;
          });
        }
      });
    },

    // 整体趋势时间查询
    handleTrendSearch() {
      let params = {};
      if (
        this.trendDateTime.length <= 0 ||
        this.trendDateTime[this.idx].length <= 0
      ) {
        params = {
          startTime: "",
          endTime: "",
          userType: Number(this.idx)
        };
      } else {
        params = {
          startTime: parseTime(this.trendDateTime[this.idx][0], "{y}-{m}-{d}"),
          endTime: parseTime(this.trendDateTime[this.idx][1], "{y}-{m}-{d}"),
          userType: Number(this.idx)
        };
      }
      this.fetchGetTrend(params);
    },
    //   整体趋势
    handleTrendBtns(item) {
      this.idx = item.value;
      this.trendDateTime = [];
      if (
        this.trendDateTime.length > 0 &&
        this.trendDateTime[this.idx].length > 0
      ) {
        this.dataParams.startTime = parseTime(
          this.trendDateTime[this.idx][0],
          "{y}-{m}-{d}"
        );
        this.dataParams.endTime = parseTime(
          this.trendDateTime[this.idx][1],
          "{y}-{m}-{d}"
        );
      } else {
        this.dataParams.startTime = "";
        this.dataParams.endTime = "";
      }
      switch (item.value) {
        case "0":
          this.dataParams.userType = 0;
          this.fetchGetTrend(this.dataParams);
          break;
        case "1":
          this.dataParams.userType = 1;
          this.fetchGetTrend(this.dataParams);
          break;
        case "2":
          this.dataParams.userType = 2;
          this.fetchGetTrend(this.dataParams);
          break;
        case "3":
          this.dataParams.userType = 3;
          this.fetchGetTrend(this.dataParams);
          break;
        default:
          break;
      }
    },
    // top version 切换
    handleTopVersionBtns(item) {
      console.log(item);
      this.versionIdx = item.value;
      this.plantformIdx = "0";
      let params = {
        userType: this.versionIdx,
        channelType: 0,
        originType: this.plantformIdx
      };
      switch (item.value) {
        case "3":
          this.fetchAnnularData(params);
          break;
        case "4":
          this.fetchAnnularData(params);
          break;
        default:
          break;
      }
    },
    // 系统切换、ios与安卓
    handlePlantformBtns(item) {
      this.plantformIdx = item.value;
      let params = {
        userType: this.versionIdx,
        channelType: 0,
        originType: this.plantformIdx
      };
      switch (item.value) {
        case "0":
          params.originType = item.value;
          this.fetchAnnularData(params);
          break;
        case "1":
          params.originType = item.value;
          this.fetchAnnularData(params);
          break;
        default:
          break;
      }
    },
    // top channel 切换
    handleTopChannelBtns(item) {
      this.channelIdx = item.value;
      let params = {
        userType: this.versionIdx,
        channelType: this.channelIdx,
        originType: this.plantformIdx
      };
      switch (item.value) {
        case "0":
          this.fetchAnnularData(params);
          break;
        case "1":
          this.fetchAnnularData(params);
          break;
        default:
          break;
      }
    },
    // 用户在线查询
    handleOnlineSearch() {
      let params = {};
      if (this.onlineDateTime.length <= 0) {
        params = {
          startTime: "",
          endTime: ""
        };
      } else {
        params = {
          startTime: parseTime(this.onlineDateTime[0], "{y}-{m}-{d}"),
          endTime: parseTime(this.onlineDateTime[1], "{y}-{m}-{d}")
        };
      }
      this.getOnlineStatistics(params);
    },
    // 清除时间
    handleDateChange(val) {
      if (val === null) {
        this.dataParams.startTime = "";
        this.dataParams.endTime = "";
        this.fetchGetTrend(this.dataParams);
      }
    },
    handleOnlineChange(val) {
      if (val === null) {
        let params = {
          startTime: "",
          endTime: ""
        };
        this.getOnlineStatistics(params);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>
