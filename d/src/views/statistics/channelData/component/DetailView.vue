<template>
  <div class="d_dialog">
    <el-dialog
      custom-class="custom-dialog"
      center
      title
      top="10vh"
      :visible.sync="show"
      width="70%"
      :before-close="handleCancel"
      :close-on-click-modal="false"
    >
      <!-- 基础数据统计 -->
      <div class="setp1">
        <h3 class="title">{{ titleList[0] }}</h3>
        <el-table
          :data="tableList"
          max-height="650"
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
    </el-dialog>
  </div>
</template>
<script>
import { getNewChannelDetails } from "@/api/statistics_api";
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
      pageSize: 10,
      pageNum: 1,
      total: 0,
      childId: "",
      baseList: [],
      loading: false,
    };
  },
  computed: {},
  methods: {
    // 基础数据详情
    fetchGetDetail() {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        channelId: this.childId,
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
    //取消弹窗
    handleCancel() {
      this.$parent.isDetail = false;
      Object.assign(this.$data, this.$options.data());
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
