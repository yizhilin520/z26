<template>
  <div class="container">
    <main class="main">
      <div class="film_search">
        <h3>视频筛选</h3>
        <div>
          <el-form
            :inline="true"
            :model="form"
            class="demo-form-inline searchForm"
          >
            <el-form-item label="视频ID">
              <el-input
                v-model="form.videoId"
                clearable
                placeholder="请输入视频ID"
              />
            </el-form-item>
            <el-form-item label="用户ID">
              <el-input
                v-model="form.authorId"
                type="text"
                clearable
                placeholder="请输入用户ID"
              />
            </el-form-item>
            <el-form-item label="用户昵称">
              <el-input
                v-model="form.authorName"
                type="text"
                clearable
                placeholder="请输入用户昵称"
              />
            </el-form-item>
            <el-form-item label="视频类型">
              <el-select
                v-model="form.videoTimeType"
                style="width: 92%"
                placeholder="请选择视频类型"
              >
                <el-option
                  v-for="item in videoOptions"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="上传日期">
              <el-date-picker
                v-model="uploadDate"
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
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="handleSearch"
                >查询</el-button
              >
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
      </div>

      <div class="film_content">
        <div class="film_top">
          <h3>视频列表</h3>
          <div class="bar_right">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="handleDelete(false)"
              plain
              >批量删除</el-button
            >
          </div>
        </div>
        <!-- 列表 -->
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="dataList"
          :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
          size="small"
          max-height="515"
          show-overflow-tooltip
          element-loading-text="Loading"
          border
          tooltip-effect="dark"
          fit
          stripe
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          highlight-current-row
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" width="60" />
          <el-table-column label="用户ID" prop="authorId" align="center" />
          <el-table-column
            label="用户昵称"
            show-overflow-tooltip
            prop="author"
            align="center"
          />
          <el-table-column align="center" min-width="110" label="视频">
            <template slot-scope="scope">
              <el-image
                style="width: 80px; height: 80px; text-align: center"
                :src="scope.row.videoImg"
                fit="cover"
                @click="checkplayFilm(scope.row.videoIdcUrl)"
              >
                <div
                  slot="placeholder"
                  style="
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  加载中<span class="dot">...</span>
                </div>
                <div
                  slot="error"
                  style="
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <img
                    style="width: 100%; height: 100%"
                    src="@/assets/images/d_avatar@2x.png"
                    alt="图片加载失败"
                  />
                </div>
              </el-image>
              <div
                class="play_icon"
                @click="checkplayFilm(scope.row.videoIdcUrl)"
              >
                <i class="el-icon-video-play" style="font-size: 30px"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="视频名称"
            show-overflow-tooltip
            align="center"
            min-width="100"
          >
            <template slot-scope="scope">
              <el-button
                style="text-decoration: underline"
                class="btn_change_handle"
                size="mini"
                type="text"
                @click="checkFilmsView(scope.row)"
                >{{ scope.row.videoTitle }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            label="视频标签"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="scope">
              <div class="v_label">{{ scope.row.labelNames }}</div>
            </template>
          </el-table-column>
          <el-table-column label="视频ID" prop="videoId" align="center" />
          <el-table-column label="时长" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              {{ scope.row.videoTime }}
            </template>
          </el-table-column>
          <el-table-column label="大小" align="center">
            <template slot-scope="scope">
              {{ scope.row.videoSize }}
            </template>
          </el-table-column>
          <el-table-column
            label="上传时间"
            min-width="150"
            show-overflow-tooltip
            prop="createTime"
            align="center"
          />
          <el-table-column align="center" min-width="120" label="审核状态">
            <template slot-scope="scope">
              <div
                :style="{
                  cursor: 'text',
                  color:
                    scope.row.videoStatus === 0
                      ? '#409EFF'
                      : scope.row.videoStatus === 1
                      ? '#13ce66'
                      : '#ff4949',
                }"
              >
                {{
                  scope.row.videoStatus === 0
                    ? "未审核"
                    : scope.row.videoStatus === 1
                    ? "审核通过"
                    : "审核未通过"
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            min-width="80"
            label="操作"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                class="btn_change_handle"
                size="mini"
                :type="scope.row.videoStatus !== 0 ? 'info' : 'primary'"
                :disabled="scope.row.videoStatus !== 0"
                @click="handleReview(scope.row)"
                >审核</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination
          :pages="pages"
          :fetchData="() => fetchFilmData()"
          :handleScroll="handleScroll"
        />
      </div>
    </main>
    <!-- 审核 -->
    <review :show="isReview" :data="reviewData"></review>
    <!-- 查看视频 -->
    <play-video :show="isPlay" :url="videoUrl"></play-video>
    <!-- 视频详情 -->
    <video-view :show="isView" :videoInfoData="videoInfoData"></video-view>
  </div>
</template>
<script>
import pagination from "@/components/paginations";
import playVideo from "./modal/playVideo";
import videoView from "./modal/videoView";
import review from "./modal/review";
import {
  delVideo,
  getTimeValue,
  getVideoMetaInfo,
  uploadVideoList,
} from "@/api/video_api";
export default {
  name: "VideoReview",
  components: {
    pagination,
    playVideo,
    videoView,
    review,
  },
  data() {
    return {
      loading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now(); //如果当天可选，就不用减8.64e7
        },
      },
      multipleSelection: [],
      delIds: "",
      uploadDate: [],
      videoOptions: [{ key: "0", value: "全部" }],
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      form: {
        videoId: "",
        videoTimeType: "0",
        authorId: "",
        authorName: "",
        beginDate: "",
        endDate: "",
        videoType: 1,
      },
      dataList: [],
      videoUrl: "",
      isPlay: false,
      isView: false,
      isReview: false,
      videoInfoData: null,
      reviewData: null,
    };
  },
  watch: {},
  created() {
    Promise.all[(this.fetchGetTimeValue(), this.fetchFilmData())];
  },
  methods: {
    //获取视频数据
    fetchFilmData() {
      this.form.beginDate = this.uploadDate[0] || "";
      this.form.endDate = this.uploadDate[1] || "";
      delete this.pages.total;
      uploadVideoList({ ...this.form, ...this.pages })
        .then((res) => {
          if (Number(res.code) === 200) {
            let { pageNum, pageSize, total, list } = res.data;
            this.pages = {
              pageNum: pageNum,
              pageSize: pageSize,
              total: Number(total),
            };
            this.dataList = list;
          }
        })
        .catch((err) => console.log(err));
    },
    //获取视频类型
    fetchGetTimeValue() {
      getTimeValue()
        .then((res) => {
          if (Number(res.code) === 200) {
            // this.options = [];
            this.videoOptions = res.data;
          } else {
            this.$message.success(res.msg);
          }
        })
        .catch(() => {});
    },
    // 获取视频详情
    getVideoDataInfo(row) {
      this.videoInfoData = null;
      getVideoMetaInfo({ videoId: row.videoId })
        .then((res) => {
          if (res.code === 200 && res.data !== null) {
            //组装数据
            const { data } = res;
            this.videoInfoData = data;
          } else {
            this.videoInfoData = null;
          }
        })
        .catch((err) => {
          this.videoInfoData = null;
          console.log(err);
        });
    },
    //审核
    handleReview(item) {
      this.isReview = true;
      this.reviewData = item;
    },
    //查看视频详情
    checkFilmsView(item) {
      this.isView = true;
      this.getVideoDataInfo(item);
    },
    // 查看视频
    checkplayFilm(item) {
      this.isPlay = true;
      this.videoUrl = item;
    },
    // 查询
    handleSearch() {
      this.fetchFilmData();
    },
    // 重置
    handleReset() {
      this.uploadDate = [];
      this.form = {
        videoId: "",
        videoTimeType: "0",
        authorId: "",
        authorName: "",
        beginDate: "",
        endDate: "",
        videoType: 1,
      };
      this.pages = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      };
      this.fetchFilmData();
    },
    //批量
    handleSelectionChange(val) {
      if (val.length > 10) {
        this.isTip = true;
        // 截取前10位
        this.multipleSelection = val.slice(0, 10);
        // 截取10位之后的数组  禁止选中
        let tempArr = val.slice(10);
        if (tempArr.length !== 0) {
          tempArr.forEach((ele) => {
            this.$refs.multipleTable.toggleRowSelection(ele, false);
          });
        }
      } else {
        //批量勾选
        this.multipleSelection = val;
      }
      let arr = [];
      this.multipleSelection.map((item) => {
        return arr.push(item.videoId);
      });
      this.delIds = arr.join(",");
    },
    //删除与批量删除
    handleDelete(bol, row) {
      if (this.multipleSelection.length < 1) {
        this.$message(`请勾选多选框进行批量操作`);
      } else {
        this.$confirm("是否确定删除视频？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true,
        })
          .then(() => {
            this.doDelete();
          })
          .catch(() => {});
      }
    },
    //删除接口
    doDelete() {
      this.loading = true;
      let ids = this.delIds;
      delVideo({ ids })
        .then((res) => {
          if (Number(res.code) === 200) {
            this.loading = false;
            this.$message({
              type: "success",
              message: "操作成功",
            });
            this.fetchFilmData();
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleScroll() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/style.scss";
.v_label {
  white-space: pre-wrap;
}
</style>
