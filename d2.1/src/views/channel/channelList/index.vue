<template>
  <div class="container">
    <main class="main">
      <div class="film_search">
        <h3>渠道筛选</h3>
        <div>
          <el-form
            ref="ruleForm"
            class="searchForm"
            style="padding-top: 20px"
            :model="ruleForm"
            :inline="true"
            status-icon
            label-width="100px"
            size="small"
          >
            <el-form-item label="渠道ID">
              <el-input
                v-model="ruleForm.id"
                show-word-limit
                placeholder="请输入渠道ID"
                clearable
              />
            </el-form-item>
            <el-form-item label="渠道名称">
              <el-input
                v-model="ruleForm.channelName"
                show-word-limit
                placeholder="请输入渠道名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="日期选择">
              <el-date-picker
                v-model="startTimeEndTime"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item :style="{ marginLeft: '20px' }">
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="onSubmit"
                >查询</el-button
              >
            </el-form-item>
            <el-form-item :style="{ marginLeft: '20px' }">
              <el-button
                type="success"
                icon="el-icon-delete-solid"
                size="small"
                @click="onNewType"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="film_content">
        <div class="film_top">
          <h3>渠道列表</h3>
          <div class="bar_right" style="top: 0px">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              plain
              @click="releaseAnnouncementOK(false, {})"
              >添加渠道</el-button
            >
          </div>
        </div>
        <!-- 列表 -->
        <el-table
          ref="multipleTable"
          :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
          :data="lists"
          size="small"
          max-height="540"
          show-overflow-tooltip
          element-loading-text="Loading"
          border
          tooltip-effect="dark"
          fit
          stripe
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          highlight-current-row
        >
          <el-table-column
            label="渠道ID"
            prop="id"
            align="center"
            width="120"
          />
          <el-table-column
            label="渠道名称"
            show-overflow-tooltip
            prop="channelName"
            align="center"
          />
          <el-table-column
            align="center"
            label="渠道URL"
            prop="channelUrl"
            min-width="100"
          />
          <el-table-column
            align="center"
            label="渠道落地页域名"
            prop="friendUrl"
            min-width="100"
          />
          <!-- <el-table-column
            align="center"
            label="iOS渠道下载地址"
            prop="iosUrl"
          />
          <el-table-column
            align="center"
            label="安卓渠道下载地址"
            prop="azUrl"
          /> -->
          <el-table-column align="center" label="角色" prop="roleName" />
          <el-table-column align="center" label="渠道人账号" prop="account" />
          <el-table-column align="center" label="环球体育icode" prop="icode" />
          <el-table-column label="添加时间" prop="createTime" align="center" />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.status == false ? "禁用" : "启用" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            min-width="100"
            label="操作"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                class="btn_change_handle"
                size="mini"
                :type="scope.row.status == false ? 'primary' : 'info'"
                @click="releaseAnnouncementOK(true, scope.row)"
                >编辑</el-button
              >
              <el-button
                class="btn_change_handle"
                size="mini"
                :type="scope.row.status == false ? 'success' : ''"
                @click="handleDisabled(scope.row)"
                >{{ scope.row.status == false ? "启用" : "禁用" }}</el-button
              >
              <el-button
                class="btn_change_handle"
                size="mini"
                :type="scope.row.status == false ? 'danger' : 'info'"
                @click="validedUpDown(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination
          :pages="pages"
          :fetchData="() => fetchData()"
          :handleScroll="handleScroll"
        />
      </div>
    </main>
    <div />
    <!-- 添加/编辑 -->
    <add-channels
      :show="showDialog"
      :boolean="boolean"
      ref="addchannel"
    ></add-channels>
  </div>
</template>
<script>
import { deleteChannel, channelList, updateStatus } from "@/api/channel_api";
import pagination from "@/components/paginations";
import addChannels from "./modal/addChannels";
export default {
  name: "ChannelList",
  components: {
    pagination,
    addChannels,
  },
  data() {
    return {
      showDialog: false,
      startTimeEndTime: [],
      lists: [],
      ruleForm: {
        id: "",
        channelName: "",
        startDate: "",
        endDate: "",
      },
      boolean: false,
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    //初始化视频管理列表
    fetchData(c) {
      const data = {
        pageSize: this.pages.pageSize,
        pageNum: this.pages.pageNum,
        id: this.ruleForm.id,
        channelName: this.ruleForm.channelName,
        startDate: this.startTimeEndTime[0],
        endDate: this.startTimeEndTime[1],
      };
      channelList(data)
        .then((res) => {
          if (res.code === 200) {
            this.lists = res.data.list;
            this.pages.total = Number(res.data.total);
          }
        })
        .finally(() => {});
    },
    validedUpDown(row) {
      if (row.status == true) return;
      const data = { id: row.id };
      this.$confirm("确认删除该渠道吗？删除后将不再统计该渠道的数据", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          deleteChannel(data)
            .then((res) => {
              if (res.code === 200) {
                if (this.lists.length === 1 && this.pages.pageNum > 1)
                  this.pages.pageNum -= 1;
                this.fetchData();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {});
    },
    onSubmit() {
      this.fetchData();
    },
    releaseAnnouncementOK(bool, row) {
      this.boolean = bool;
      if (bool) {
        if (row.status == true) return;
        const { channelName, channelUrl, account, id, icode, friendUrl } = row;
        this.$refs.addchannel.form = {
          channelName,
          channelUrl,
          account,
          id,
          icode,
          friendUrl,
        };
      } else {
        this.$refs.addchannel.form = {
          channelName: "",
          channelUrl: "",
          account: "",
          id: "",
          icode: "",
          friendUrl: "",
        };
      }
      this.showDialog = true;
    },

    // 是否禁用
    handleDisabled(item) {
      let params = {
        id: item.id,
        status: !item.status,
      };
      if (item.status == false) {
        this.$confirm("确认启用该渠道吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true,
        })
          .then(() => {
            this.editStatus(params);
          })
          .catch(() => {});
      } else {
        this.$confirm("确认禁用该渠道吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true,
        })
          .then(() => {
            this.editStatus(params);
          })
          .catch(() => {});
      }
    },
    // 启用、禁用
    editStatus(params) {
      updateStatus({ ...params })
        .then((res) => {
          if (res.code === 200) this.fetchData();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleScroll() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
    },
    //重置
    onNewType() {
      this.ruleForm = {};
      this.startTimeEndTime = [];
      this.fetchData();
    },
    // 刷新
    handleRefresh() {
      this.onNewType();
    },
    // 切换页码
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    onSubmit() {
      this.fetchData();
    },
    handleCurrentChange(val) {
      //翻页
      this.fetchData(val);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";
</style>
