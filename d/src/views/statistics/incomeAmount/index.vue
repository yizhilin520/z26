<template>
  <div class="s-user">
    <div class="base">
      <div class="title">收入金额数据</div>
      <div class="base-content">
        <el-row :gutter="32">
          <div v-for="(item, idx) in baseList" :key="idx">
            <el-col :xs="12" :sm="12" :md="6" :lg="4" :xl="4">
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
    <div style="margin-top: 15px"></div>

    <div style="margin-top:15px"></div>

    <div class="base container">
      <div class="trend">
        <div class="title-box">
          <div class="title">时段收入</div>
          <div class="e_form">
            <el-date-picker
              v-model="playDateTime"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @change="handleTimeChange"
            >
            </el-date-picker>
            <el-button type="primary" @click="handleTimeSearch">查询</el-button>
          </div>
        </div>
        <div style="margin-top: 20px"></div>
        <div class="line_chart">
          <line-chart
            height="450px"
            width="100%"
            :chart-data="timePeriodData"
          />
        </div>
        <div class="e_table">
          <table
            cellspacing="0"
            cellpadding="0"
            border="1"
            class="time_table"
            v-if="todayList.length > 0 || yesterDayList.length > 0"
          >
            <thead>
              <tr>
                <th></th>
                <th v-for="it in todayList" :key="it.hour">
                  {{ `${it.hour >= 10 ? it.hour : "0" + it.hour}点` }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>今日</td>
                <td v-for="it in todayList" :key="it.hour">
                  {{ parseFloat(it.count) }}
                </td>
              </tr>
              <tr>
                <td>昨日</td>
                <td v-for="it in yesterDayList" :key="it.hour">
                  {{ parseFloat(it.count) }}
                </td>
              </tr>
            </tbody>
          </table>
          <el-table v-else border empty-text="表格暂无数据"> </el-table>
        </div>
      </div>
      <div style="margin-top:50px"></div>
      <div class="trend">
        <div class="title-box">
          <div class="title">每日收入趋势</div>
          <div class="e_form">
            <el-date-picker
              size="small"
              v-model="incomeDateTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              @change="hanleDayChange"
            />
            <el-button type="primary" @click="handleDaySearch">查询</el-button>
          </div>
        </div>
        <div style="margin-top: 20px"></div>
        <div class="line_chart">
          <other-chart height="450px" width="100%" :chart-data="everyDayData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OtherChart from "@/components/vueEcharts/OtherChart";
import LineChart from "@/components/vueEcharts/Linechart";
import { parseTime } from "@/utils/index.js";
import {
  incomeAmountCount,
  incomeAmountCountSomeDay,
  incomeAmountCountSection
} from "@/api/income_api";
export default {
  name: "IncomeAmount",
  components: { OtherChart, LineChart },
  data() {
    return {
      baseList: [
        {
          title: "总收入金额",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0"
        },
        {
          title: "昨日收入金额",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0"
        },
        {
          title: "今日收入金额",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0"
        },

        {
          title: "上月收入金额",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0"
        },
        {
          title: "本月收入金额",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0"
        }
      ],

      playDateTime: "",
      incomeDateTime: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      everyDayData: {
        expectedData: [],
        dateData: [],
        actualData: []
      },
      timePeriodData: {
        expectedData: [],
        dateData: [],
        actualData: [],
        nameData: []
      },
      todayList: [],
      yesterDayList: [],
      tableData: []
    };
  },
  mounted() {
    this.getFetchData();
  },
  methods: {
    getFetchData() {
      incomeAmountCount()
        .then(res => {
          if (res.code * 1 === 200) {
            let {
              rechargeHalfMonthStatsRes,
              rechargeInComeStatsRes,
              rechargeTimePeriodStatsRes
            } = res.data;
            this.baseList[0].userNums = rechargeInComeStatsRes.totalIncome;
            this.baseList[0].iosNums = rechargeInComeStatsRes.totalIncomeApple;
            this.baseList[0].androidNums =
              rechargeInComeStatsRes.totalIncomeAndroid;

            this.baseList[1].userNums = rechargeInComeStatsRes.yesterdayIncome;
            this.baseList[1].iosNums =
              rechargeInComeStatsRes.yesterdayIncomeApple;
            this.baseList[1].androidNums =
              rechargeInComeStatsRes.yesterdayIncomeAndroid;

            this.baseList[2].userNums = rechargeInComeStatsRes.todayIncome;
            this.baseList[2].iosNums = rechargeInComeStatsRes.todayIncomeApple;
            this.baseList[2].androidNums =
              rechargeInComeStatsRes.todayIncomeAndroid;

            this.baseList[3].userNums = rechargeInComeStatsRes.lastMonthIncome;
            this.baseList[3].iosNums =
              rechargeInComeStatsRes.lastMonthIncomeApple;
            this.baseList[3].androidNums =
              rechargeInComeStatsRes.lastMonthIncomeAndroid;

            this.baseList[4].userNums = rechargeInComeStatsRes.thisMonthIncome;
            this.baseList[4].iosNums =
              rechargeInComeStatsRes.thisMonthIncomeApple;
            this.baseList[4].androidNums =
              rechargeInComeStatsRes.thisMonthIncomeAndroid;

            this.everyDayData.expectedData = rechargeHalfMonthStatsRes.map(
              item => {
                return item.count;
              }
            );
            this.everyDayData.dateData = rechargeHalfMonthStatsRes.map(item => {
              return item.currDate;
            });
            this.timePeriodData.nameData[0] = rechargeTimePeriodStatsRes[0]
              ? "今日"
              : "";
            this.timePeriodData.nameData[1] = rechargeTimePeriodStatsRes[1]
              ? "昨日"
              : "";
            this.timePeriodData.expectedData = rechargeTimePeriodStatsRes[0].map(
              item => {
                return item.count;
              }
            );
            this.timePeriodData.dateData = rechargeTimePeriodStatsRes[1].map(
              item => {
                return `${item.hour >= 10 ? item.hour : "0" + item.hour}点`;
              }
            );
            this.timePeriodData.actualData = rechargeTimePeriodStatsRes[1].map(
              item => {
                return item.count;
              }
            );
            this.todayList = rechargeTimePeriodStatsRes[0];
            this.yesterDayList = rechargeTimePeriodStatsRes[1];
          }
        })
        .catch(() => {});
    },
    handleTimeSearch() {
      incomeAmountCountSomeDay({
        startDate:
          this.playDateTime ||
          parseTime(Date.now() - 24 * 3600 * 1000, "{y}-{m}-{d}")
      })
        .then(res => {
          if (res.code * 1 === 200) {
            this.timePeriodData.expectedData = res.data.map(item => {
              return item.count;
            });
            this.timePeriodData.dateData = res.data.map(item => {
              return `${item.hour >= 10 ? item.hour : "0" + item.hour}点`;
            });
            this.timePeriodData.actualData = res.data.map(item => {
              return item.count;
            });
          }
        })
        .catch(() => {});
    },
    handleDaySearch() {
      incomeAmountCountSection({
        startDate:
          this.incomeDateTime[0] ||
          parseTime(Date.now() - 24 * 3600 * 1000 * 14, "{y}-{m}-{d}"),
        endDate: this.incomeDateTime[1] || parseTime(Date.now(), "{y}-{m}-{d}")
      })
        .then(res => {
          if (res.code * 1 === 200) {
            this.everyDayData.expectedData = res.data.map(item => {
              return item.count;
            });
            this.everyDayData.dateData = res.data.map(item => {
              return item.currDate;
            });
            this.everyDayData.actualData = res.data.map(item => {
              return item.count;
            });
          }
        })
        .catch(() => {});
    },
    // 清除时间
    handleTimeChange(val) {
      if (val === null) {
        this.playDateTime = "";
        this.handleTimeSearch();
      }
    },
    hanleDayChange(val) {
      if (val === null) {
        this.incomeDateTime = [];
        this.handleDaySearch();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/statistics.scss";
.time_table {
  width: 100%;
  border-spacing: 0;
  border: 1px solid #979797;
  border-collapse: collapse;
  table-layout: fixed;
  // min-height: 150px;
  th,
  td {
    padding: 10px 0px;
    color: #6e7177;
    text-align: center;
    line-height: 1.5;
  }
  th {
    background: rgb(73, 213, 255);
    font-weight: 500;
  }
  td {
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    word-break: break-all;
    overflow: hidden;
  }
}
.title-box {
  margin: 20px 15px;
}
</style>
