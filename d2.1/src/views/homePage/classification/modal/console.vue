<template>
  <div class="d_dialog">
    <el-dialog
      custom-class="custom-dialog my-dialog"
      title="日志"
      center
      :visible.sync="show"
      width="60%"
      top="10vh"
      :before-close="handleCancel"
    >
      <el-tabs v-model="tab" @tab-click="handleClickTab">
        <el-tab-pane
          v-for="item in tabs"
          :key="item.value"
          :label="item.label"
          :name="item.value"
        >
          <div>
            <div class="top">
              <el-row>
                <el-col :md="10">
                  <div class="date">
                    <span>{{ typeDate }}</span
                    >&nbsp;&nbsp;&nbsp;
                    <el-date-picker
                      v-model="dateTime"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      :picker-options="pickerOptions"
                      @change="handleDateChange"
                    />
                  </div>
                </el-col>
                <el-col :md="6">
                  <div class="date">
                    <span>影片ID</span>&nbsp;&nbsp;&nbsp;
                    <el-input
                      v-model.trim="movieId"
                      show-word-limit
                      placeholder="影片ID"
                      clearable
                      style="width: 200px"
                    />
                  </div>
                </el-col>
                <el-col :md="4">
                  <div class="btns">
                    <el-button type="primary" @click="handleSearch"
                      >查询</el-button
                    >
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="content">
              <el-table
                ref="multipleTable"
                v-loading="loading"
                :data="list"
                row-key="mid"
                :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
                show-overflow-tooltip
                element-loading-text="Loading"
                border
                max-height="450"
                tooltip-effect="dark"
                fit
                stripe
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                highlight-current-row
                class="custom_table"
              >
                <el-table-column label="影片ID" align="center" prop="movieId" />
                <el-table-column
                  label="影片名称"
                  prop="movieName"
                  align="center"
                />
                <el-table-column
                  :label="typeDate"
                  align="center"
                  :formatter="formatterTime"
                />
                <el-table-column
                  label="操作账号"
                  align="center"
                  prop="opUser"
                />
              </el-table>
            </div>
            <div class="dialog-footer">
              <!--分页组件-->
              <!-- <pagination :pages="pages" :handleScroll="handleScroll" /> -->
              <div class="block">
                <el-pagination
                  :page-sizes="[10, 20, 30, 40]"
                  layout="total, sizes, prev, pager, next, jumper"
                  :page-size="pages.pageSize"
                  :current-page.sync="pages.pageNum"
                  background
                  :total="pages.total"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import { selectRelationList } from "@/api/home_api";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  data() {
    return {
      loading: false,
      tabs: [
        { label: "关联日志", value: "related" },
        { label: "联关日志", value: "cancleRelated" },
      ],
      tab: "related",
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      list: [],
      movieId: "",
      dateTime: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  computed: {
    typeDate() {
      return this.tab === "related" ? "关联日期" : "取关日期";
    },
  },
  methods: {
    handleClickTab(tab, event) {
      this.tab = tab.name;
      this.getRelatedConsole();
    },
    formatterTime(row) {
      return this.tab === "related" ? row.createTime : row.createTime;
    },
    getRelatedConsole() {
      let { pageNum, pageSize } = this.pages;
      let params = {
        startTime: this.dateTime?.length > 0 ? this.dateTime[0] : "",
        endTime: this.dateTime?.length > 0 ? this.dateTime[1] : "",
        movieId: this.movieId,
        page: pageNum,
        pageSize: pageSize,
        reqStatus: this.tab === "related" ? "1" : "2",
      };
      selectRelationList(params)
        .then((res) => {
          if (res.code * 1 === 200) {
            let { total, pageNum, pageSize, list } = res.data;
            this.pages = {
              pageNum,
              pageSize,
              total: total * 1,
            };
            this.list = list;
          }
        })
        .catch((err) => {});
    },

    //时间选择
    handleDateChange(val) {
      if (val === null) {
        this.dateTime = [];
        this.handleSearch();
      }
    },

    // 查询
    handleSearch() {
      this.getRelatedConsole();
    },

    handleSizeChange(val) {
      this.pages.pageSize = val;
      this.getRelatedConsole();
    },
    handleCurrentChange(val) {
      this.pages.pageNum = val;
      this.getRelatedConsole();
    },
    //取消弹窗
    handleCancel() {
      this.tab = "related";
      this.$parent.isConsole = false;
    },
    handleScroll() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";
.dis_flex {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.content {
  margin-top: 20px;
}
.dialog-footer {
  margin-top: 20px;
  text-align: right;
  .block {
    margin-top: 0;
  }
}
.btns {
  @extend .dis_flex;
  flex-direction: row;
}
.top {
  .date {
    display: flex;
    align-items: center;
  }
}
</style>