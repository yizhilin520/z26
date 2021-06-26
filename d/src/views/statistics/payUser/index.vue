<template>
  <div class="s-pay">
    <!-- 付费用户数据-->
    <div class="base">
      <div class="title">付费用户数据</div>
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

    <div class="base">
      <!-- 渠道基础数据 -->
      <div class="trend">
        <div class="title-box">
          <div class="btns">
            <div
              v-for="item in payBtnsList"
              :key="item.value"
              :class="[idx === item.value ? 'btn-active' : 'btn-txt']"
              @click="handleBtns(item)"
            >
              <div>{{ item.name }}</div>
            </div>
          </div>
          <div class="e_form">
            <el-form
              class="demo-form-inline search_class"
              label-width="100px"
              :inline="true"
              :model="form"
            >
              <el-form-item label="">
                <el-select v-model="form.platform">
                  <el-option
                    v-for="item in platformOptions"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-select v-model="form.id">
                  <el-option
                    v-for="item in channelOptions"
                    :key="item.id"
                    :label="item.channelName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div style="margin-top: 20px"></div>
        <div class="line_chart">
          <other-chart height="450px" width="100%" :chart-data="payChartData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userPayCount, userPayPolyline } from "@/api/income_api";
import { channelDownList } from "@/api/statistics_api";
import OtherChart from "@/components/vueEcharts/OtherChart";
import { parseTime } from "@/utils/index.js";
export default {
  name: "PayUser",
  components: { OtherChart },
  data() {
    return {
      form: {
        platform: "-1",
        id: "-1"
      },
      channelOptions: [{ id: "-1", channelName: "全部渠道" }],
      platformOptions: [
        { key: "-1", value: "全部终端" },
        { key: "0", value: "iOS" },
        { key: "1", value: "安卓" }
      ],
      baseList: [
        {
          title: "总付费用户数",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0"
        },
        {
          title: "昨日付费用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0"
        },
        {
          title: "昨日首次付费用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0"
        },

        {
          title: "今日付费用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0"
        },
        {
          title: "今日首次付费用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0"
        }
      ],
      payBtnsList: [
        { name: "时段付费用户", value: "0" },
        { name: "时段首次付费用户", value: "1" },
        { name: "每周付费用户", value: "2" },
        { name: "每月付费用户", value: "3" }
      ],
      idx: "0",
      playDateTime: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      payChartData: {
        expectedData: [],
        dateData: []
      }
    };
  },
  mounted() {
    this.fetchData();
    this.fetchDownList();
    this.fetchPayPolyline();
  },
  methods: {
    fetchData() {
      userPayCount()
        .then(res => {
          if (res.code * 1 === 200) {
            let {
              azSumPayCount,
              azTodayFirstPayCount,
              azTodayPayCount,
              azYesterdayFirstPayCount,
              azYesterdayPayCount,
              iosSumPayCount,
              iosTodayFirstPayCount,
              iosTodayPayCount,
              iosYesterdayFirstPayCount,
              iosYesterdayPayCount,
              sumPayCount,
              todayPayCount,
              yesterdayFirstPayCount,
              yesterdayPayCount,
              todayFirstPayCount
            } = res.data.appUserPayVo;
            this.baseList[0].userNums = sumPayCount;
            this.baseList[0].iosNums = iosSumPayCount;
            this.baseList[0].androidNums = azSumPayCount;

            this.baseList[1].userNums = yesterdayPayCount;
            this.baseList[1].iosNums = iosYesterdayPayCount;
            this.baseList[1].androidNums = azYesterdayPayCount;

            this.baseList[2].userNums = yesterdayFirstPayCount;
            this.baseList[2].iosNums = iosYesterdayFirstPayCount;
            this.baseList[2].androidNums = azYesterdayFirstPayCount;

            this.baseList[3].userNums = todayPayCount;
            this.baseList[3].iosNums = iosTodayPayCount;
            this.baseList[3].androidNums = azTodayPayCount;

            this.baseList[4].userNums = todayFirstPayCount;
            this.baseList[4].iosNums = iosTodayFirstPayCount;
            this.baseList[4].androidNums = azTodayFirstPayCount;
          }
        })
        .catch(() => {});
    },
    // 渠道下拉列表
    fetchDownList() {
      channelDownList()
        .then(res => {
          if (Number(res.code) === 200) {
            this.channelOptions.push(...res.data);
          }
        })
        .catch(err => console.log(err));
    },
    // 折线数据
    fetchPayPolyline() {
      let params = {
        startTime:
          this.idx === "2"
            ? parseTime(Date.now() - 24 * 3600 * 1000 * 6, "{y}-{m}-{d}")
            : this.idx === "3"
            ? parseTime(Date.now() - 24 * 3600 * 1000 * 30, "{y}-{m}-{d}")
            : "",
        endTime:
          this.idx === "2" || this.idx === "3"
            ? parseTime(Date.now(), "{y}-{m}-{d}")
            : "",
        type: this.idx,
        originType: this.form.platform,
        channelId: this.form.id
      };
      userPayPolyline({ ...params })
        .then(res => {
          if (res.code * 1 === 200) {
            switch (this.idx) {
              case "0":
                let { userPayTimeVoList } = res.data;
                this.payChartData.expectedData = userPayTimeVoList.map(item => {
                  return item.count;
                });
                this.payChartData.dateData = userPayTimeVoList.map(item => {
                  return `${item.hour >= 10 ? item.hour : "0" + item.hour}点`;
                });
                break;
              case "1":
                let { firstPay } = res.data;
                this.payChartData.expectedData = firstPay.map(item => {
                  return item.count;
                });
                this.payChartData.dateData = firstPay.map(item => {
                  return `${item.hour >= 10 ? item.hour : "0" + item.hour}点`;
                });
                break;
              case "2":
                let { weekPay } = res.data;
                this.payChartData.expectedData = weekPay.map(item => {
                  return item.count;
                });
                this.payChartData.dateData = weekPay.map(item => {
                  return item.createTime;
                });
                break;
              case "3":
                let { monthPay } = res.data;
                this.payChartData.expectedData = monthPay.map(item => {
                  return item.count;
                });
                this.payChartData.dateData = monthPay.map(item => {
                  return item.createTime.slice(
                    item.createTime.indexOf("-") + 1,
                    item.createTime.length
                  );
                });
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
      this.form = {
        platform: "-1",
        id: "-1"
      };
      this.fetchPayPolyline();
    },
    handleSearch() {
      this.fetchPayPolyline();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>
