<template>
  <div class="channel_user">
    <!-- 基础数据概览-->
    <div class="base">
      <div class="title">基础数据概览</div>
      <div class="base-content">
        <el-row :gutter="32">
          <div v-for="(item, idx) in baseList" :key="idx">
            <el-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4">
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

    <!-- 渠道基础数据 -->
    <div class="base">
      <div class="title">渠道基础数据</div>
      <div style="margin-top: 20px"></div>
      <el-table
        ref="multipleTable"
        max-height="500"
        :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
        :data="list"
        border
        fit
        size="small"
      >
        <el-table-column align="center" label="渠道ID" prop="channelId" />
        <el-table-column align="center" label="渠道名称" prop="channelName" />
        <el-table-column align="center" label="渠道url" prop="channelUrl" />
        <el-table-column align="center" label="总用户数" prop="sumUser" />
        <el-table-column
          align="center"
          label="当日新增用户"
          prop="todayNewUser"
        />
        <el-table-column
          align="center"
          label="当日活跃游客用户"
          prop="activeVisitor"
        />
        <el-table-column
          align="center"
          label="当日活跃注册用户"
          prop="activeCount"
        />
        <el-table-column
          align="center"
          label="当前在线用户"
          prop="onlineCount"
        />
        <el-table-column align="center" label="首次启动次数" prop="first" />
        <el-table-column align="center" label="总启动次数" prop="startCount" />
        <el-table-column align="center" label="付费用户数" prop="payCount" />
        <el-table-column
          align="center"
          label="付费总金额（元）"
          prop="payAmount"
        />
        <el-table-column
          align="center"
          fixed="right"
          width="180"
          prop="created_at"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleEdit(scope.row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="margin-top: 15px"></div>

    <div class="base">
      <!-- 渠道留存数据 -->
      <div class="trend">
        <div class="title-box">
          <div class="title">渠道留存数据</div>
        </div>
        <div style="margin-top: 20px"></div>
        <el-row :gutter="32">
          <el-col>
            <el-table
              ref="multipleTable"
              max-height="550"
              style="width: 100%"
              :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
              :data="trendList"
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
                <el-table-column align="center" label="安卓" prop="newUserAZ" />
              </el-table-column>
              <el-table-column align="center" label="次日留存率">
                <el-table-column align="center" label="全部" prop="nextDay" />
                <el-table-column
                  align="center"
                  label="苹果"
                  prop="nextDayIOS"
                />
                <el-table-column align="center" label="安卓" prop="nextDayAZ" />
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
    <!-- 详情 -->
    <detail-view :titleList="titleList" :show="isDetail" ref="detail" />
  </div>
</template>

<script>
import {
  channelCount,
  BasicsChannelList,
  BasicsChannelRemain,
} from "@/api/statistics_api";
import DetailView from "./component/DetailView";
export default {
  name: "ChannelUser",
  components: {
    DetailView,
  },
  data() {
    return {
      pageSize: 10,
      pageNum: 1,
      total: 0,
      baseList: [
        {
          title: "该渠道总用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0",
        },
        {
          title: "该渠道总注册用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0",
        },
        {
          title: "该渠道昨日新增用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0",
        },

        {
          title: "该渠道今日新增用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0",
        },
        {
          title: "该渠道当前在线用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0",
        },
      ],
      titleList: ["基础数据详情", "留存统计详情"],
      isDetail: false,
      list: [],
      trendList: [],
      itemData: {},
      detailData: {
        list: [],
      },
    };
  },
  mounted() {
    this.fetchGetData();
    this.fetchGetBaseList();
    this.fetchTrendList();
  },
  methods: {
    // 头部数据
    fetchGetData() {
      channelCount().then((res) => {
        if (res.code === 200) {
          const { backUserChannelVo } = res.data;
          // 该渠道总用户
          this.baseList[0].userNums = backUserChannelVo.sumChannelUser;
          this.baseList[0].iosNums = backUserChannelVo.iosSumChannelUser;
          this.baseList[0].androidNums = backUserChannelVo.azSumChannelUser;
          // 该渠道总注册用户
          this.baseList[1].userNums = backUserChannelVo.registerChannelUser;
          this.baseList[1].iosNums = backUserChannelVo.iosRegisterChannelUser;
          this.baseList[1].androidNums =
            backUserChannelVo.azRegisterChannelUser;
          // 该渠道昨日新增用户
          this.baseList[2].userNums = backUserChannelVo.yesterdayChannelUser;
          this.baseList[2].iosNums = backUserChannelVo.iosYesterdayChannelUser;
          this.baseList[2].androidNums =
            backUserChannelVo.azYesterdayChannelUser;
          // 该渠道今日新增用户
          this.baseList[3].userNums = backUserChannelVo.todayChannelUser;
          this.baseList[3].iosNums = backUserChannelVo.iosTodayChannelUser;
          this.baseList[3].androidNums = backUserChannelVo.azTodayChannelUser;
          // 该渠道当前在线用户
          this.baseList[4].userNums = backUserChannelVo.onlineChannelUser;
          this.baseList[4].iosNums = backUserChannelVo.iosOnlineChannelUser;
          this.baseList[4].androidNums = backUserChannelVo.azOnlineChannelUser;
        }
      });
    },
    // 渠道基础数据
    fetchGetBaseList() {
      BasicsChannelList()
        .then((res) => {
          if (res.code * 1 === 200) {
            this.list = res.data;
          }
        })
        .catch(() => {});
    },
    // 渠道留存数据
    fetchTrendList() {
      BasicsChannelRemain({ pageNum: this.pageNum, pageSize: this.pageSize })
        .then((res) => {
          if (res.code * 1 === 200) {
            let { pageSize, pageNum, total, list } = res.data;
            this.pageSize = pageSize;
            this.pageNum = pageNum;
            this.total = total * 1;
            this.trendList = list.filter(Boolean);
            this.trendList.map((e) => {
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
          }
        })
        .catch(() => {});
    },

    // 转百分比
    turnPercent(item) {
      return item >= 1 ? "100%" : (parseFloat(item) * 100).toFixed(2) + "%";
    },
    //查看 详情
    handleEdit(row) {
      this.isDetail = true;
      this.$refs["detail"].childId = row.channelId;
      this.$refs["detail"].fetchGetDetail();
    },

    // 切换pageSize
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchTrendList();
    },
    // 切换pageNum
    handleCurrentChange(val) {
      this.pageNum = val;
      this.fetchTrendList();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>
