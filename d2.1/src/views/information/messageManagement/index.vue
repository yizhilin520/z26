<template>
  <div class="container">
    <main class="main">
      <div class="film_search">
        <h3>消息筛选</h3>
        <el-form
          ref="searchForm"
          class="searchForm"
          :model="searchForm"
          :inline="true"
          status-icon
          label-width="100px"
        >
          <el-form-item label="发送平台" prop="originType">
            <el-select v-model="searchForm.originType">
              <el-option
                v-for="item in platformOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                placeholder="请选择发送平台"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input
              v-model="searchForm.userName"
              placeholder="请输入用户名"
              clearable
            />
          </el-form-item>
          <el-form-item label="发布日期">
            <el-date-picker
              v-model="valueTime"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item :style="{ marginLeft: '20px' }">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="getMessageList()"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item :style="{ marginLeft: '20px' }">
            <el-button
              type="success"
              icon="el-icon-delete-solid"
              size="small"
              @click="resetSearch"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <div class="film_content">
        <div class="film_top">
          <h3>消息列表</h3>
          <div class="bar_right">
            <el-button
              icon="el-icon-plus"
              type="primary"
              size="small"
              plain
              @click="handleRelease"
              >发布消息</el-button
            >
          </div>
        </div>
        <!-- 列表 -->
        <el-table
          ref="multipleTable"
          max-height="575"
          v-loading="loading"
          :data="msgList"
          element-loading-text="Loading"
          :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
          border
          fit
          highlight-current-row
          size="small"
        >
          <el-table-column type="index" label="序号" align="center" />
          <el-table-column label="消息类型" prop="messageType" align="center" />
          <el-table-column label="发布时间" align="center" prop="publishTime" />
          <el-table-column label="发布人" prop="pubUserId" align="center" />
          <el-table-column
            label="发送平台"
            :formatter="releaseCheck"
            prop="originType"
            align="center"
          />
          <el-table-column label="用户名" prop="userName" align="center" />
          <el-table-column label="消息标题" prop="title" align="center" />
          <el-table-column label="消息内容" prop="context" align="center" />
          <el-table-column
            align="center"
            min-width="50"
            fixed="right"
            prop="created_at"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination
          :pages="pages"
          :fetchData="() => getMessageList()"
          :handleScroll="handleScroll"
        />
      </div>
    </main>
    <!-- 发布消息 -->
    <release-msg
      :show="isRelease"
      :optionsList="platformOption"
      ref="release"
    ></release-msg>
  </div>
</template>
<script>
import { messageDelete, messageList } from "@/api/message_api";
import pagination from "@/components/paginations";
import releaseMsg from "./modal/releaseMsg";
export default {
  name: "MessageManagement",
  components: {
    pagination,
    releaseMsg
  },
  data() {
    return {
      loading: false,
      valueTime: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      searchForm: {
        originType: "-1",
        userName: ""
      },
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      platformOption: [
        {
          value: "-1",
          label: "全部用户"
        },
        {
          value: "0",
          label: "iOS用户"
        },
        {
          value: "1",
          label: "安卓用户"
        },
        {
          value: "2",
          label: "单个用户"
        }
      ],
      isRelease: false,
      msgList: []
    };
  },
  mounted() {
    Promise.all[this.getMessageList()];
  },
  methods: {
    releaseCheck(row) {
      if (row.originType * 1 === 2) {
        return "单个用户";
      } else if (Number(row.originType) === 0) {
        const videoSort = "iOS用户";
        return videoSort;
      } else if (Number(row.originType) === 1) {
        const videoSort = "安卓用户";
        return videoSort;
      } else {
        const videoSort = "全部用户";
        return videoSort;
      }
    },
    //消息列表
    getMessageList(data) {
      let params = {
        pageNo: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        originType: this.searchForm.originType,
        userName: this.searchForm.userName,
        startDate: this.valueTime ? this.valueTime[0] || "" : "",
        endDate: this.valueTime ? this.valueTime[1] || "" : ""
      };
      this.loading = true;
      messageList({ ...params })
        .then(res => {
          if (Number(res.code) === 200) {
            this.loading = false;
            let { pageNum, pageSize, total, list } = res.data;
            this.pages = {
              pageNum: pageNum,
              pageSize: pageSize,
              total: Number(total)
            };
            this.msgList = list;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 发布
    handleRelease() {
      this.isRelease = true;
    },
    // delete scope.row.id, scope.$index
    handleDelete(item) {
      this.$confirm("是否删除此条消息？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          this.deleteMsg(item);
        })
        .catch(() => {});
    },
    //删除
    deleteMsg(row) {
      messageDelete({ ids: row.id })
        .then(res => {
          if (Number(res.code) === 200) {
            if (this.msgList.length === 1 && this.pages.pageNum > 1)
              this.pages.pageNum -= 1;
            this.getMessageList();
          }
        })
        .catch(() => {});
    },
    handleScroll() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
    },
    // 重置
    resetSearch() {
      this.$refs["searchForm"].resetFields();
      this.valueTime = [];
      this.getMessageList();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";
</style>
