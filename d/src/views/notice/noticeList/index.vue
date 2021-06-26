<template>
  <div class="container">
    <main class="main">
      <div class="film_search">
        <h3>公告筛选</h3>
        <el-form
          ref="ruleForm"
          class="searchForm"
          :model="ruleForm"
          :inline="true"
          status-icon
          label-width="100px"
          size="small"
        >
          <el-form-item label="发布平台">
            <el-select v-model="ruleForm.platform" placeholder="请选择发布平台">
              <el-option
                v-for="item in optiones"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="发布渠道">
            <el-select v-model="ruleForm.channelId">
              <el-option
                v-for="item in channelOpts"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="公告标题">
            <el-input
              v-model="ruleForm.title"
              placeholder="请输入公告标题"
              clearable
            />
          </el-form-item>

          <el-form-item label="发布日期">
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
              @click="handleSearch"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item :style="{ marginLeft: '20px' }">
            <el-button
              type="success"
              icon="el-icon-delete-solid"
              size="small"
              @click="handleReset"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <div class="film_content">
        <div class="film_top">
          <h3>公告列表</h3>
          <div class="bar_right">
            <el-button
              icon="el-icon-plus"
              type="primary"
              size="small"
              @click="handleNotice(false)"
              >发布公告</el-button
            >
          </div>
        </div>
        <!-- 列表 -->
        <el-table
          ref="multipleTable"
          :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
          :data="noticeList"
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
          <el-table-column type="index" label="序号" align="center" />
          <el-table-column label="公告标题" prop="title" align="center" />
          <el-table-column
            label="公告内容"
            show-overflow-tooltip
            prop="content"
            align="center"
          />
          <el-table-column
            align="center"
            label="发布平台"
            :formatter="platformOK"
            prop="platform"
          />
          <el-table-column align="center" label="发布渠道" prop="channelName" />
          <el-table-column label="发布人" prop="publishUser" align="center" />
          <el-table-column
            label="发布时间"
            min-width="100"
            prop="publishTime"
            align="center"
          />
          <el-table-column label="层级" align="center">
            <template slot-scope="scope">
              {{ `${scope.row.level}级` }}
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.valided ? "上架" : "下架" }}
              </div>
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
                type="primary"
                :disabled="scope.row.valided"
                @click="handleNotice(true, scope.row)"
                >编辑</el-button
              >
              <el-button
                class="btn_change_handle"
                size="mini"
                :type="scope.row.valided ? 'warning' : 'success'"
                @click="validedUpDown(scope.row)"
                >{{ scope.row.valided ? "下架" : "上架" }}</el-button
              >
              <el-button
                size="mini"
                :style="{ display: !scope.row.valided ? 'block' : 'none' }"
                type="danger"
                @click="handleDelNotice(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination
          :pages="pages"
          :fetchData="fetchData"
          :handleScroll="handleScroll"
        />
      </div>
    </main>
    <div />

    <!-- 发布消息 -->
    <notice-dialog :show="isNotice" :dialogTitle="dialogTitle" ref="notice" />
  </div>
</template>
<script>
import { queryList, setStatus, deleteNotice } from "@/api/notice_api";
import { channelDownList } from "@/api/channel_api";
import noticeDialog from "./modal/noticeDialog";
import pagination from "@/components/paginations";
export default {
  name: "NoticeList",
  components: {
    noticeDialog,
    pagination
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now(); //如果当天可选，就不用减8.64e7
        }
      },
      startTimeEndTime: [],
      optiones: [
        { key: 0, value: "全部" },
        { key: 1, value: "苹果" },
        { key: 2, value: "安卓" }
      ],
      channelOpts: [{ key: "-1", value: "全部渠道" }],
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      loading: false,
      isNotice: false,
      ruleForm: {
        channelId: "-1",
        platform: 0,
        title: "",
        beginDate: "",
        endDate: ""
      },
      dialogTitle: {
        title: "",
        bol: false
      },
      noticeList: []
    };
  },
  created() {
    Promise.all[(this.fetchData(), this.getChannelOpts())];
  },
  methods: {
    platformOK(row) {
      let obj = {};
      this.optiones.map(it => {
        obj[it.key] = it.value;
      });
      return obj[row.platform];
    },
    // 列表
    fetchData() {
      let params = {
        ...this.ruleForm,
        beginDate: this.startTimeEndTime[0] || "",
        endDate: this.startTimeEndTime[1] || "",
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      };
      queryList({ ...params })
        .then(res => {
          if (Number(res.code) === 200) {
            let { pageNum, pageSize, total, list } = res.data;
            this.pages = {
              pageNum: pageNum,
              pageSize: pageSize,
              total: Number(total)
            };
            this.noticeList = list;
          }
        })
        .catch(() => {});
    },
    // 获取渠道-条件查询
    getChannelOpts() {
      channelDownList().then(res => {
        if (Number(res.code) === 200) {
          res.data.map(it => {
            this.channelOpts.push({
              key: it.id,
              value: it.channelName
            });
          });
        }
      });
    },
    //   发布公告
    handleNotice(bol, item) {
      this.isNotice = true;
      this.$refs.notice.channelList = this.channelOpts;
      this.$refs.notice.platfomOptiones = this.optiones;
      if (bol) {
        this.dialogTitle = {
          title: "编辑公告",
          bol: bol
        };
        let { platform, title, content, level, id, channelId } = item;
        this.$refs.notice.searchForm = {
          platform,
          title,
          context: content,
          level,
          id,
          channelId
        };
      } else {
        this.dialogTitle = {
          title: "发布公告",
          bol: bol
        };
        this.$refs.notice.searchForm = {
          platform: 0,
          title: "",
          content: "",
          level: 1,
          id: "",
          channelId: "-1"
        };
      }
    },
    // 上下架
    validedUpDown(row) {
      const data = { id: row.id, isValid: !row.valided };
      if (row.valided === false) {
        let channelArr = this.noticeList.filter(it => it.valided);
        if (channelArr.length > 0) {
          let noticeArr = channelArr.filter(
            it => it.channelId == row.channelId
          );
          if (noticeArr.length > 2) {
            this.$message(`一个渠道最多只能上架3个公告`);
            return false;
          }
          for (let i = 0; i < channelArr.length; i++) {
            if (
              channelArr[i].level === row.level &&
              channelArr[i].channelId == row.channelId
            ) {
              this.$message(`此层级已有公告上架`);
              return false;
            }
          }

          this.$confirm("确认上架此公告吗？", "提示", {
            distinguishCancelAndClose: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            center: true
          })
            .then(() => {
              this.setStatusOK(data);
            })
            .catch(() => {});
        } else {
          this.$confirm("确认上架此公告吗？", "提示", {
            distinguishCancelAndClose: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            center: true
          })
            .then(() => {
              this.setStatusOK(data);
            })
            .catch(() => {});
        }
      } else {
        this.$confirm("确认下架此公告吗？", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true
        })
          .then(() => {
            this.setStatusOK(data);
          })
          .catch(() => {});
      }
    },
    setStatusOK(data) {
      setStatus(data)
        .then(res => {
          if (res.code * 1 === 200) this.fetchData();
        })
        .catch(() => {});
    },
    // 删除公告
    handleDelNotice(row) {
      this.$confirm("确认要删除该公告吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          deleteNotice({ id: row.id })
            .then(res => {
              if (res.code * 1 === 200) {
                this.isDele = false;
                if (this.noticeList.length === 1 && this.pages.pageNum > 1)
                  this.pages.pageNum -= 1;
                this.fetchData();
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    },
    // 查询
    handleSearch() {
      this.fetchData();
    },
    //重置
    handleReset() {
      Object.assign(this.$data, this.$options.data());
      this.fetchData();
      this.getChannelOpts();
    },
    handleScroll() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";
</style>
