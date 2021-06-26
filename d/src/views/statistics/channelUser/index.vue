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

    <div class="base">
      <div class="title">渠道筛选</div>
      <div class="base-content">
        <el-row :gutter="32">
          <el-form
            class="demo-form-inline search_class"
            label-width="80px"
            :inline="true"
            :model="form"
          >
            <el-row>
              <el-col :span="6">
                <el-form-item label="渠道名称">
                  <el-select v-model="form.channelId">
                    <el-option
                      v-for="item in channelOptions"
                      :key="item.id"
                      :label="item.channelName"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="9">
                <el-form-item label="日期选择">
                  <el-date-picker
                    size="mini"
                    v-model="playDateTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    @change="handleDateChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <div>
                  <el-button type="primary" size="small" @click="handleSearch"
                    >查询</el-button
                  >
                  <el-button size="small" type="success" @click="handleRest"
                    >重置</el-button
                  >
                </div>
              </el-col>
            </el-row>
          </el-form>
        </el-row>
      </div>
    </div>

    <div style="margin-top: 15px"></div>

    <div class="base">
      <!-- 渠道基础数据 -->
      <div class="trend">
        <div class="title-box">
          <div class="title">渠道基础数据</div>
          <div class="bar_right" style="position: relative; right: 0px">
            <el-button
              :icon="'el-icon-document'"
              type="primary"
              :loading="downloadLoging"
              size="small"
              @click="handleDownload"
              >导出Excel</el-button
            >
          </div>
        </div>
        <div style="margin-top: 20px"></div>
        <el-table
          ref="multipleTable"
          max-height="500"
          :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
          :data="chanelList"
          border
          fit
          size="small"
        >
          <el-table-column align="center" type="index" label="序号" />
          <el-table-column align="center" label="渠道ID" prop="channelId" />
          <el-table-column align="center" label="渠道名称" prop="channelName" />
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
          <el-table-column
            align="center"
            label="总启动次数"
            prop="startCount"
          />
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
              <el-button
                size="mini"
                type="success"
                @click="handleEdit(scope.row)"
                >详情</el-button
              >
            </template>
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
      </div>
    </div>
    <!-- 详情 -->
    <detail-view :titleList="titleList" :show="showDialog" ref="detail" />
  </div>
</template>

<script>
import {
  userChannelCount,
  getNewChannelList,
  channelDownList,
  newChannelExport,
} from "@/api/statistics_api";
import DetailView from "./component/DetailView";
import { sliceArr } from "@/utils/index.js";
import { exportExcel } from "@/utils/exportExcel";
export default {
  name: "ChannelData",
  components: {
    DetailView,
  },
  data() {
    return {
      form: {
        id: "",
        channelId: "0",
        startDate: "",
        endDate: "",
      },
      pageSize: 10,
      pageNum: 1,
      total: 0,
      channelOptions: [{ id: "0", channelName: "全部" }],
      baseList: [
        {
          title: "渠道总用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0",
        },
        {
          title: "渠道总注册用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0",
        },
        {
          title: "渠道昨日新增用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0",
        },

        {
          title: "渠道今日新增用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0",
        },
        {
          title: "渠道当前在线用户",
          userNums: "0",
          iosImg: require("@/assets/images/ios.png"),
          androidImg: require("@/assets/images/android.png"),
          ios: "苹果",
          iosNums: "0",
          android: "安卓",
          androidNums: "0",
        },
      ],
      downloadLoging: false,
      showDialog: false,
      itemData: {},
      playDateTime: [],
      chanelList: [],
      titleList: ["基础数据详情", "留存统计详情"],
      detailData: {
        list: [],
      },
      remainData: {
        list: [],
      },
      dataList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  mounted() {
    this.fetchGetData();
    this.fetchDownList();
    this.fetchChannelList();
  },
  methods: {
    // 头部数据
    fetchGetData() {
      userChannelCount().then((res) => {
        if (res.code === 200) {
          const { backUserChannelVo } = res.data;
          this.baseList[0].userNums = backUserChannelVo.sumChannelUser;
          this.baseList[0].iosNums = backUserChannelVo.iosSumChannelUser;
          this.baseList[0].androidNums = backUserChannelVo.azSumChannelUser;

          this.baseList[1].userNums = backUserChannelVo.registerChannelUser;
          this.baseList[1].iosNums = backUserChannelVo.iosRegisterChannelUser;
          this.baseList[1].androidNums =
            backUserChannelVo.azRegisterChannelUser;

          this.baseList[2].userNums = backUserChannelVo.yesterdayChannelUser;
          this.baseList[2].iosNums = backUserChannelVo.iosYesterdayChannelUser;
          this.baseList[2].androidNums =
            backUserChannelVo.azYesterdayChannelUser;

          this.baseList[3].userNums = backUserChannelVo.todayChannelUser;
          this.baseList[3].iosNums = backUserChannelVo.iosTodayChannelUser;
          this.baseList[3].androidNums = backUserChannelVo.azTodayChannelUser;

          this.baseList[4].userNums = backUserChannelVo.onlineChannelUser;
          this.baseList[4].iosNums = backUserChannelVo.iosOnlineChannelUser;
          this.baseList[4].androidNums = backUserChannelVo.azOnlineChannelUser;
        }
      });
    },
    // 渠道下拉列表
    fetchDownList() {
      channelDownList()
        .then((res) => {
          if (Number(res.code) === 200) {
            this.channelOptions.push(...res.data);
          }
        })
        .catch((err) => console.log(err));
    },
    // 列表数据
    fetchChannelList() {
      this.form.startDate = this.playDateTime[0] || "";
      this.form.endDate = this.playDateTime[1] || "";
      getNewChannelList({
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        ...this.form,
      })
        .then((res) => {
          if (res.code * 1 === 200) {
            let { pageSize, pageNum, total, list } = res.data;
            this.pageSize = pageSize;
            this.pageNum = pageNum;
            this.total = total * 1;
            this.chanelList = list;
          }
        })
        .catch(() => {});
    },

    // 转百分比
    turnPercent(item) {
      return item >= 1 ? "100%" : (parseFloat(item) * 100).toFixed(2) + "%";
    },
    //查看 详情
    async handleEdit(row) {
      this.showDialog = true;
      this.$refs["detail"].channelId = row.channelId;
      await Promise.all[
        (this.$refs["detail"].fetchGetDetail(),
        this.$refs["detail"].getRemainDetailList())
      ];
    },

    //导出
    async handleDownload() {
      let res = await newChannelExport({ ...this.form });
      if (res.code * 1 === 200 && res.data !== null) {
        let tHeader = [
          "渠道ID",
          "渠道名称",
          "总用户数",
          "当日新增用户",
          "当日活跃游客用户",
          "当日活跃注册用户",
          "当前在线用户",
          "首次启动次数",
          "总启动次数",
          "付费用户数",
          "付费总金额（元）",
        ];
        let filterVal = [
          "channelId",
          "channelName",
          "sumUser",
          "todayNewUser",
          "activeVisitor",
          "activeCount",
          "onlineCount",
          "first",
          "startCount",
          "payCount",
          "payAmount",
        ];
        let filename = "渠道统计表";
        this.downloadLoging = true;
        exportExcel(res.data, tHeader, filterVal, filename);
        this.timer = setTimeout(() => {
          this.downloadLoging = false;
        }, 2000);
      } else {
        this.$message.error("导出失败");
      }
    },
    //查询
    handleSearch() {
      this.fetchChannelList();
    },
    //重置
    handleRest() {
      this.form = {
        id: "",
        channelId: "0",
        startDate: "",
        endDate: "",
      };
      this.playDateTime = [];
      this.fetchChannelList();
    },
    // 清除时间
    handleDateChange(val) {
      if (val === null) {
        this.playDateTime = [];
        this.fetchChannelList();
      }
    },
    // 切换btns
    handleBtns(it) {
      this.idx = it.value;
    },
    // 切换pageSize
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchChannelList();
    },
    // 切换pageNum
    handleCurrentChange(val) {
      this.pageNum = val;
      this.fetchChannelList();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>
