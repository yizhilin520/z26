<template>
  <div class="s-user">
    <div class="base">
      <div class="title">营收金额数据</div>
      <div class="base-content">
        <el-row :gutter="32">
          <div v-for="(item, idx) in baseList" :key="idx">
            <el-col :xs="12" :sm="12" :md="6" :lg="4" :xl="4">
              <el-card class="box-card" shadow="hover">
                <div>{{ item.title }}</div>
                <h4>{{ item.userNums }}</h4>
              </el-card>
            </el-col>
          </div>
        </el-row>
      </div>
    </div>
    <div style="margin-top: 15px"></div>

    <div style="margin-top: 15px"></div>

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
          <other-chart
            height="450px"
            width="100%"
            :chart-data="timePeriodData"
          />
        </div>
        <!-- <div class="e_table">
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
        </div> -->
      </div>

      <!-- 每日收入趋势 -->
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

      <!-- 历史营收信息 -->
      <div class="trend">
        <div class="top-box">
          <div class="titles">历史营收信息</div>
          <div class="e_form_input">
            <i
              class="el-icon-caret-left icon"
              @click="handleClickIcon('left')"
            ></i>
            <el-input
              v-model="amountDate"
              readonly
              :style="{ width: '100px' }"
            ></el-input>
            <i
              class="el-icon-caret-right icon"
              @click="handleClickIcon('right')"
            ></i>
            <span class="yuan">单位：元</span>
          </div>
        </div>
        <div style="margin-top: 15px"></div>
        <div class="e_table">
          <table class="time_table" v-if="historyIncome.length > 0">
            <tbody class="tbody_wrap">
              <tr v-for="(item, index) in historyIncome" :key="index">
                <td class="my_td">{{ index + 1 }} 月</td>
                <td>
                  {{ item }}
                </td>
              </tr>
            </tbody>
          </table>
          <el-table v-else border empty-text="表格暂无数据"> </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OtherChart from "@/components/vueEcharts/OtherChart";
import LineChart from "@/components/vueEcharts/Linechart";
import { parseTime } from "@/utils/index.js";
import Dayjs from "dayjs";
import {
  incomeAmountCount,
  incomeAmountCountSomeDay,
  incomeAmountCountSection,
  historyIncome,
} from "@/api/income_api";
export default {
  name: "IncomeAmount",
  components: { OtherChart, LineChart },
  data() {
    return {
      baseList: [
        {
          title: "总营收（元）",
          userNums: "0",
        },
        {
          title: "昨日营收（元）",
          userNums: "0",
        },
        {
          title: "今日营收（元）",
          userNums: "0",
        },

        {
          title: "上月营收（元）",
          userNums: "0",
        },
        {
          title: "本月营收（元）",
          userNums: "0",
        },
      ],

      playDateTime: "",
      incomeDateTime: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      everyDayData: {
        expectedData: [],
        dateData: [],
        actualData: [],
      },
      timePeriodData: {
        expectedData: [],
        dateData: [],
        actualData: [],
        nameData: [],
      },
      tableData: [],
      amountDate: Dayjs().format("YYYY"),
      historyIncome: [],
    };
  },
  mounted() {
    this.getFetchData();
    this.getHistoryIncome();
  },
  methods: {
    getFetchData() {
      incomeAmountCount()
        .then((res) => {
          if (res.code * 1 === 200) {
            let {
              rechargeHalfMonthStatsRes,
              rechargeInComeStatsRes,
              rechargeTimePeriodStatsRes,
            } = res.data;

            // 总营收（元）
            this.baseList[0].userNums = rechargeInComeStatsRes.totalIncome;

            // 昨日营收（元）
            this.baseList[1].userNums = rechargeInComeStatsRes.yesterdayIncome;

            // 今日营收（元）
            this.baseList[2].userNums = rechargeInComeStatsRes.todayIncome;

            // 上月营收（元）
            this.baseList[3].userNums = rechargeInComeStatsRes.lastMonthIncome;

            // 本月营收（元）
            this.baseList[4].userNums = rechargeInComeStatsRes.thisMonthIncome;

            this.everyDayData.expectedData = rechargeHalfMonthStatsRes.map(
              (item) => {
                return item.count;
              }
            );
            this.everyDayData.dateData = rechargeHalfMonthStatsRes.map(
              (item) => {
                return item.currDate;
              }
            );
            this.timePeriodData.expectedData =
              rechargeTimePeriodStatsRes[0].map((item) => {
                return item.count;
              });
            this.timePeriodData.dateData = rechargeTimePeriodStatsRes[0].map(
              (item) => {
                return `${item.hour >= 10 ? item.hour : "0" + item.hour}点`;
              }
            );
          }
        })
        .catch(() => {});
    },
    //历史营收
    getHistoryIncome() {
      historyIncome({ toYear: this.amountDate })
        .then((res) => {
          if (res.code * 1 === 200) {
            let {
              apr,
              aug,
              dece,
              feb,
              jan,
              july,
              june,
              mar,
              may,
              nov,
              oct,
              sept,
            } = res.data;
            let obj = {
              jan,
              feb,
              mar,
              apr,
              may,
              june,
              july,
              aug,
              sept,
              oct,
              nov,
              dece,
            };
            this.historyIncome = Object.values(obj);
          }
        })
        .catch(() => {});
    },
    handleTimeSearch() {
      incomeAmountCountSomeDay({
        startDate: this.playDateTime || parseTime(Date.now(), "{y}-{m}-{d}"),
      })
        .then((res) => {
          if (res.code * 1 === 200) {
            this.timePeriodData.expectedData = res.data.map((item) => {
              return item.count;
            });
            this.timePeriodData.dateData = res.data.map((item) => {
              return `${item.hour >= 10 ? item.hour : "0" + item.hour}点`;
            });
            this.timePeriodData.actualData = res.data.map((item) => {
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
          parseTime(Date.now() - 24 * 3600 * 1000 * 6, "{y}-{m}-{d}"),
        endDate: this.incomeDateTime[1] || parseTime(Date.now(), "{y}-{m}-{d}"),
      })
        .then((res) => {
          if (res.code * 1 === 200) {
            this.everyDayData.expectedData = res.data.map((item) => {
              return item.count;
            });
            this.everyDayData.dateData = res.data.map((item) => {
              return item.currDate;
            });
            this.everyDayData.actualData = res.data.map((item) => {
              return item.count;
            });
          }
        })
        .catch(() => {});
    },
    // 历史营收数据
    handleClickIcon(type) {
      let addYear = Dayjs(this.amountDate).add(1, "year").format("YYYY");
      let subYear = Dayjs(this.amountDate).subtract(1, "year").format("YYYY");
      let nowYear = Dayjs().format("YYYY");
      switch (type) {
        case "left":
          this.amountDate = subYear;
          this.getHistoryIncome();
          return;
        case "right":
          if (addYear > nowYear) return;
          this.amountDate = addYear;
          this.getHistoryIncome();
          return;
        default:
          return;
      }
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
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/statistics.scss";
// .time_table {
//   width: 100%;
//   border-spacing: 0;
//   border: 1px solid #979797;
//   border-collapse: collapse;
//   table-layout: fixed;
//   // min-height: 150px;
//   th,
//   td {
//     padding: 10px 0px;
//     color: #6e7177;
//     text-align: center;
//     line-height: 1.5;
//   }
//   th {
//     background: rgb(73, 213, 255);
//     font-weight: 500;
//   }
//   td {
//     box-sizing: border-box;
//     text-overflow: ellipsis;
//     vertical-align: middle;
//     word-break: break-all;
//     overflow: hidden;
//   }
// }
.title-box {
  margin: 20px 15px;
}
.trend {
  min-height: 550px !important;
}
.e_form_input {
  margin-top: 15px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .icon {
    font-size: 20px;
    cursor: pointer;
  }
  >>> .el-input__inner {
    text-align: center;
    font-size: 16px;
    color: #333;
    font-weight: 600;
  }
}
.yuan {
  margin-left: 15px;
  color: #6e7177;
}
.time_table {
  width: 50%;
  border-spacing: 0;
  border: 1px solid #dcdfe6;
  border-collapse: collapse;
  table-layout: fixed;
  .tbody_wrap {
    display: flex;
    width: 100%;
    flex-shrink: 0;
    flex-flow: row wrap;
    font-size: 16px;
    td {
      padding: 10px 0px;
      color: #6e7177;
      text-align: center;
      line-height: 1.5;
    }
    tr:nth-child(even) {
      background-color: rgba(235, 225, 225, 0.3);
    }
    tr {
      width: 100%;
      display: flex;
      td {
        flex: 1;
        text-align: center;
        border: 0;
      }
      .my_td {
        background: rgba(73, 213, 255, 0.3);
        font-weight: 500;
      }
    }
  }
}
</style>
