<template>
  <div class="s-trend">
    <div class="base">
      <!-- 时段折线图 -->
      <div class="p_chart">
        <div class="btns">
          <div
            v-for="item in trendList"
            :key="item.value"
            :class="[idx === item.value ? 'btn-active' : 'btn-txt']"
            @click="handleBtns(item)"
          >
            <div>{{ item.name }}</div>
          </div>
        </div>
        <div class="search">
          <el-date-picker
            v-model="trendDateTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="handleDateChange"
          />
          <div style="margin: 0 15px"></div>
          <el-button type="primary" @click="handleTrendSearch">查询</el-button>
        </div>
        <div class="p_line">
          <line-chart
            height="450px"
            width="100%"
            :percent="true"
            :chart-data="trendChartData"
          />
        </div>
        <div class="base-content">
          <div class="title-box">
            <div class="title">总用户留存统计</div>
          </div>
          <el-row :gutter="32">
            <el-col>
              <el-table
                ref="multipleTable"
                max-height="550"
                :data="remainList"
                style="width: 97%; margin: 0 1.5%"
                :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
                border
                fit
                size="small"
              >
                <el-table-column align="center" label="日期" prop="countDate" />
                <el-table-column align="center" label="新增用户">
                  <el-table-column align="center" label="全部" prop="newUser" />
                  <el-table-column
                    align="center"
                    label="苹果"
                    prop="newUserIOS"
                  />
                  <el-table-column
                    align="center"
                    label="安卓"
                    prop="newUserAZ"
                  />
                </el-table-column>
                <el-table-column align="center" label="次日留存率">
                  <el-table-column align="center" label="全部" prop="nextDay" />
                  <el-table-column
                    align="center"
                    label="苹果"
                    prop="nextDayIOS"
                  />
                  <el-table-column
                    align="center"
                    label="安卓"
                    prop="nextDayAZ"
                  />
                </el-table-column>
                <el-table-column align="center" label="7日留存率">
                  <el-table-column
                    align="center"
                    label="全部"
                    prop="sevenCount"
                  />
                  <el-table-column
                    align="center"
                    label="苹果"
                    prop="sevenCountIOS"
                  />
                  <el-table-column
                    align="center"
                    label="安卓"
                    prop="sevenCountAZ"
                  />
                </el-table-column>
                <el-table-column align="center" label="30日留存率">
                  <el-table-column
                    align="center"
                    label="全部"
                    prop="thirtyCount"
                  />
                  <el-table-column
                    align="center"
                    label="苹果"
                    prop="thirtyCountIOS"
                  />
                  <el-table-column
                    align="center"
                    label="安卓"
                    prop="thirtyCountAZ"
                  />
                </el-table-column>
              </el-table>
              <div class="block" style="text-align: right; margin-top: 10px">
                <el-pagination
                  :page-sizes="[10, 20, 30, 40]"
                  layout="total, sizes, prev, pager, next, jumper"
                  :page-size="pageSize"
                  :current-page.sync="pageNum"
                  background
                  :total="total"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userRemainList, userRetentionPolyline } from "@/api/statistics_api";
import lineChart from "@/components/vueEcharts/Linechart";
export default {
  name: "UserTrend",
  components: {
    lineChart,
  },
  data() {
    return {
      trendList: [
        // { name: "日留存率", value: "0" },
        { name: "周留存率", value: "1" },
        { name: "月留存率", value: "2" },
      ],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      idx: "1",
      trendDateTime: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      remainList: [],
      trendChartData: {
        expectedData: [],
        dateData: [],
        actualData: [],
      },
    };
  },
  mounted() {
    this.fetchPolyline();
    this.fetchUserRemainList();
  },
  methods: {
    //拆线图数据
    fetchPolyline() {
      let params = {
        startTime: (this.trendDateTime && this.trendDateTime[0]) || "",
        endTime: (this.trendDateTime && this.trendDateTime[1]) || "",
        type: this.idx,
      };
      userRetentionPolyline({ ...params })
        .then((res) => {
          if (res.code * 1 === 200) {
            switch (this.idx) {
              case "0":
                let { nextDayAzUser, nextDayIosUser } = res.data;
                this.trendChartData.expectedData = nextDayIosUser.map(
                  (item) => {
                    return item.count;
                  }
                );
                this.trendChartData.dateData = nextDayAzUser.map((item) => {
                  return `${item.hour >= 10 ? item.hour : "0" + item.hour}点`;
                });
                this.trendChartData.actualData = nextDayAzUser.map((item) => {
                  return item.count;
                });
                break;
              case "1":
                let { sevenDayIosUser, sevenDayAzUser } = res.data;
                this.trendChartData.expectedData = sevenDayIosUser.map(
                  (item) => {
                    return item.count;
                  }
                );
                this.trendChartData.dateData = sevenDayAzUser.map((item) => {
                  return item.createTime;
                });
                this.trendChartData.actualData = sevenDayAzUser.map((item) => {
                  return item.count;
                });
                break;
              case "2":
                let { thirtyDayAzUser, thirtyDayIosUser } = res.data;
                this.trendChartData.expectedData = thirtyDayIosUser.map(
                  (item) => {
                    return item.count;
                  }
                );
                this.trendChartData.dateData = thirtyDayAzUser.map((item) => {
                  return item.createTime;
                });
                this.trendChartData.actualData = thirtyDayAzUser.map((item) => {
                  return item.count;
                });
                break;

              default:
                break;
            }
          }
        })
        .catch(() => {});
    },
    // 列表数据
    fetchUserRemainList() {
      userRemainList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      })
        .then((res) => {
          if (res.code * 1 === 200) {
            let { pageNum, pageSize, total, list } = res.data;
            this.remainList = list;
            this.remainList.map((e) => {
              e.nextDay = this.turnPercent(e.nextDay);
              e.nextDayIOS = this.turnPercent(e.nextDayIOS);
              e.nextDayAZ = this.turnPercent(e.nextDayAZ);
              e.sevenCount = this.turnPercent(e.sevenCount);
              e.sevenCountIOS = this.turnPercent(e.sevenCountIOS);
              e.sevenCountAZ = this.turnPercent(e.sevenCountAZ);
              e.thirtyCount = this.turnPercent(e.thirtyCount);
              e.thirtyCountIOS = this.turnPercent(e.thirtyCountIOS);
              e.thirtyCountAZ = this.turnPercent(e.thirtyCountAZ);
            });
            this.pageNum = pageNum;
            // this.pageSize = pageSize;
            this.total = Number(total);
          }
        })
        .catch(() => {});
    },
    // 转百分比
    turnPercent(item) {
      return item >= 1 ? "100%" : (parseFloat(item) * 100).toFixed(2) + "%";
    },
    // 切换btns
    handleBtns(it) {
      this.idx = it.value;
      this.trendDateTime = [];
      this.fetchPolyline();
    },

    // 日期查询
    handleTrendSearch() {
      this.fetchPolyline();
    },
    // 清除时间
    handleDateChange(val) {
      if (val === null) {
        this.trendDateTime = [];
        this.fetchPolyline();
      }
    },
    // 切换pageSize
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchUserRemainList();
    },
    // 切换pageNum
    handleCurrentChange(val) {
      this.pageNum = val;
      this.fetchUserRemainList();
    },
    handleScroll() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>
