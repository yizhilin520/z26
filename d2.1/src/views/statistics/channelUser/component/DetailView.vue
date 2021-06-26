<template>
  <div class="d_dialog">
    <el-dialog
      custom-class="custom-dialog"
      center
      title
      :visible.sync="show"
      width="70%"
      top="10vh"
      :before-close="handleCancel"
      :close-on-click-modal="false"
    >
      <!-- 基础数据统计 -->
      <div class="setp1">
        <h3 class="title">{{ titleList[0] }}</h3>
        <el-table
          :data="tableList"
          max-height="500"
          style="width: 97%; margin: 0 1.5%"
          :header-cell-style="{ background: '#49d5ff' }"
          border
          fit
          size="small"
        >
          <el-table-column label="日期" align="center" prop="createTime" />
          <el-table-column
            label="当日新增游客用户"
            align="center"
            prop="todayNewUser"
          />
          <el-table-column
            label="当日新增注册用户"
            align="center"
            prop="todayNewRegister"
          />
          <el-table-column
            label="当日活跃游客用户"
            align="center"
            prop="activeVisitor"
          />
          <el-table-column
            label="当日活跃注册用户"
            align="center"
            prop="activeCount"
          />
          <el-table-column label="首次启动次数" align="center" prop="first" />
          <el-table-column
            label="总启动次数"
            align="center"
            prop="startCount"
          />
          <el-table-column label="付费用户数" align="center" prop="payCount" />
          <el-table-column label="付费总金额" align="center" prop="payAmount" />
        </el-table>
        <div
          class="block"
          style="text-align: right; margin-top: 10px; margin-bottom: 10px"
        >
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

      <!-- 留存统计详情 -->
      <div class="setp2">
        <h3 class="title">{{ titleList[1] }}</h3>
        <el-table
          ref="multipleTable"
          :data="RemainTableList"
          max-height="500"
          style="width: 97%; margin: 0 1.5%"
          :header-cell-style="{ background: '#49d5ff' }"
          border
          fit
          size="small"
        >
          <el-table-column align="center" label="日期" prop="countDate" />
          <el-table-column align="center" label="新增用户">
            <el-table-column align="center" label="全部" prop="newUser" />
            <el-table-column align="center" label="苹果" prop="newUserIOS" />
            <el-table-column align="center" label="安卓" prop="newUserAZ" />
          </el-table-column>
          <el-table-column align="center" label="次日留存率">
            <el-table-column align="center" label="全部" prop="nextDay" />
            <el-table-column align="center" label="苹果" prop="nextDayIOS" />
            <el-table-column align="center" label="安卓" prop="nextDayAZ" />
          </el-table-column>
          <el-table-column align="center" label="7日留存率">
            <el-table-column align="center" label="全部" prop="sevenCount" />
            <el-table-column align="center" label="苹果" prop="sevenCountIOS" />
            <el-table-column align="center" label="安卓" prop="sevenCountAZ" />
          </el-table-column>
          <el-table-column align="center" label="30日留存率">
            <el-table-column align="center" label="全部" prop="thirtyCount" />
            <el-table-column
              align="center"
              label="苹果"
              prop="thirtyCountIOS"
            />
            <el-table-column align="center" label="安卓" prop="thirtyCountAZ" />
          </el-table-column>
        </el-table>
        <div
          class="block"
          style="text-align: right; margin-top: 10px; margin-bottom: 10px"
        >
          <el-pagination
            :page-sizes="[10, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper"
            :page-size="pageSize1"
            :current-page.sync="pageNum1"
            background
            :total="total1"
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getNewChannelDetails, remainDetailList } from "@/api/statistics_api";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    titleList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      tableList: [],
      RemainTableList: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      pageSize1: 10,
      pageNum1: 1,
      total1: 0,
      channelId: "",
      baseList: [],
      loading: false,
    };
  },
  methods: {
    // 基础数据详情
    fetchGetDetail() {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        channelId: this.channelId,
        startDate: this.$parent.form.startDate,
        endDate: this.$parent.form.endDate,
      };
      this.loading = true;
      getNewChannelDetails(params).then((res) => {
        if (Number(res.code) === 200) {
          this.loading = false;
          let { pageSize, pageNum, total, list } = res.data;
          this.pageSize = pageSize;
          this.pageNum = pageNum;
          this.total = total * 1;
          this.tableList = list.filter(Boolean);
        }
      });
    },
    // 留存统计详情
    getRemainDetailList() {
      let params = {
        pageNum: this.pageNum1,
        pageSize: this.pageSize1,
        channelId: this.channelId,
        startDate: this.$parent.form.startDate,
        endDate: this.$parent.form.endDate,
      };
      remainDetailList(params)
        .then((res) => {
          if (Number(res.code) === 200) {
            let { pageSize, pageNum, total, list } = res.data;
            this.pageSize1 = pageSize;
            this.pageNum1 = pageNum;
            this.total1 = total * 1;
            this.RemainTableList = list.filter(Boolean);
            this.RemainTableList.map((e) => {
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
        .catch((err) => {
          console.error(err);
        });
    },
    // 转百分比
    turnPercent(item) {
      return item >= 1 ? "100%" : (parseFloat(item) * 100).toFixed(2) + "%";
    },
    // 切换pageSize
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchGetDetail();
    },
    // 切换pageNum
    handleCurrentChange(val) {
      this.pageNum = val;
      this.fetchGetDetail();
    },
    // 切换pageSize
    handleSizeChange1(val) {
      this.pageSize1 = val;
      this.getRemainDetailList();
    },
    // 切换pageNum
    handleCurrentChange1(val) {
      this.pageNum1 = val;
      this.getRemainDetailList();
    },
    //取消弹窗
    handleCancel() {
      this.$parent.showDialog = false;
      Object.assign(this.$data, this.$options.data());
    },
  },
};
</script>
<style lang="scss" scoped>
.title {
  width: 100%;
  text-align: center;
}
.setp2 {
  margin-top: 80px;
}
</style>
