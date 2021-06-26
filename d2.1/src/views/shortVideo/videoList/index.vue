<template>
  <div class="container">
    <main class="main">
      <el-alert
        v-if="succTimes != 0 || errArr.length > 0"
        :title="`请耐心等待，上传结束前勿切换刷新页面。上传成功视频： ${succTimes} / ${length}； 上传失败视频： ${errArr.length} / ${length}。`"
        type="success"
        effect="dark"
      >
      </el-alert>
      <div class="film_search">
        <h3>视频筛选</h3>
        <div>
          <el-form
            :inline="true"
            :model="filmForm"
            class="demo-form-inline searchForm"
          >
            <el-row type="flex" justify="flex-start">
              <el-col>
                <el-form-item label="视频ID">
                  <el-input
                    v-model="filmForm.videoId"
                    clearable
                    placeholder="请输入视频ID"
                  />
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="视频名称">
                  <el-input
                    v-model="filmForm.videoTitle"
                    type="text"
                    clearable
                    placeholder="请输入视频名称"
                  />
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="视频分类">
                  <el-select v-model="filmForm.videoTimeType">
                    <el-option
                      v-for="item in videoTypeList"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="转码">
                  <el-select
                    v-model="filmForm.standard"
                    placeholder="请选择是否转码"
                  >
                    <el-option
                      v-for="item in filmOptions"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="flex-start">
              <el-col>
                <el-form-item label="视频标签">
                  <el-select
                    v-model="labelName"
                    multiple
                    :multiple-limit="3"
                    class="mine_select"
                    placeholder="请选择视频标签"
                  >
                    <el-option
                      v-for="item in labelNameList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col>
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
              </el-col>
              <el-col>
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
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>

      <div class="film_content">
        <div class="film_top">
          <h3>视频列表</h3>
          <div class="bar_right">
            <span class="transcode">正在转码中 {{ codeNum }} / 50</span>
            <el-button
              type="primary"
              icon="el-icon-camera-solid"
              size="small"
              @click="handleClickTrans"
              plain
              >转码</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-upload"
              size="small"
              @click="handleUpload(false)"
              plain
              >上传</el-button
            >
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
          :data="filmList"
          :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
          size="small"
          show-overflow-tooltip
          element-loading-text="Loading"
          border
          max-height="570"
          tooltip-effect="dark"
          fit
          stripe
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          highlight-current-row
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" width="60" />
          <el-table-column label="视频ID" prop="videoId" align="center" />
          <el-table-column min-width="110" align="center" label="视频">
            <template slot-scope="scope">
              <el-image
                class="tb_image"
                :src="scope.row.videoImg"
                fit="cover"
                @click="checkplayFilm(scope.row.videoIdcUrl)"
              >
                <div slot="placeholder" class="tb_image_pl">
                  加载中<span class="dot">...</span>
                </div>
                <div slot="error" class="tb_image_pl">
                  <img
                    class="tb_img"
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
          >
            <template slot-scope="scope">
              <a
                class="v_name"
                size="mini"
                type="text"
                @click="checkFilmsView(scope.row)"
                >{{ scope.row.videoTitle }}</a
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
            label="用户昵称"
            show-overflow-tooltip
            prop="author"
            align="center"
          />
          <el-table-column
            label="平均播放时长"
            prop="averagePlay"
            align="center"
            :formatter="formatterTime"
          />
          <el-table-column
            label="发布日期"
            min-width="120"
            show-overflow-tooltip
            prop="publishTime"
            align="center"
          />
          <el-table-column label="收藏数" prop="praiseNum" align="center" />
          <el-table-column label="评论数" prop="commentNum" align="center" />
          <el-table-column label="播放数" prop="playNum" align="center" />
          <el-table-column label="是否转码" align="center">
            <template slot-scope="scope">
              <div>
                {{
                  scope.row.standard == 0
                    ? "否"
                    : scope.row.standard == 1
                    ? "是"
                    : ""
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            min-width="130"
            label="操作"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                class="btn_change_handle"
                size="mini"
                type="primary"
                @click="handleUpload(true, scope.row)"
                >编辑</el-button
              >
              <el-button
                class="btn_change_handle"
                size="mini"
                type="danger"
                @click="handleDelete(true, scope.row)"
                >删除</el-button
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
    <div />
    <!-- 查看视频 -->
    <play-film :show="isPlay" :url="filmUrl"></play-film>
    <!-- 转码 -->
    <transcode :show="isTrans" :ids="transCodeArr"></transcode>
    <!-- 上传 -->
    <upload
      :show="isUpload"
      :nickIdOptions="nickIdOptions"
      ref="upload"
      :labelNameList="labelNameList"
      @getUploadValue="getUploadValue"
    ></upload>
    <!-- 视频详情 -->
    <video-view :show="isView" :videoInfoData="videoInfoData"></video-view>
  </div>
</template>

<script>
import {
  videoList,
  delVideo,
  getVideoMetaInfo,
  getTimeValue,
  optionList,
  getTransCodeNum,
} from "@/api/video_api";
import { videoLabelList } from "@/api/label_api";
import pagination from "@/components/paginations";
import playFilm from "./modal/playFilm";
import transcode from "./modal/transcode";
import upload from "./modal/upload";
import videoView from "./modal/videoView";
import { formatSecond } from "@/utils/index";
export default {
  name: "VideoList",
  components: { pagination, playFilm, transcode, upload, videoView },
  data() {
    return {
      loading: false,
      filmForm: {
        videoId: "",
        videoTitle: "",
        videoTimeType: "0",
        beginDate: "",
        endDate: "",
        standard: "-1",
        labelIds: "",
        videoType: 0,
      },
      videoTypeList: [{ key: "0", value: "全部" }],
      filmOptions: [
        { key: "-1", value: "全部" },
        { key: "1", value: "是" },
        { key: "0", value: "否" },
      ],
      uploadDate: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      filmList: [],
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      isPlay: false,
      filmUrl: "",
      multipleSelection: [],
      delIds: "",
      isTrans: false,
      isUpload: false,
      isView: false,
      videoInfoData: null,
      nickIdOptions: [],
      codeNum: "0",
      transCodeArr: [],
      labelName: [],
      labelNameList: [],
      errTimes: 0,
      succTimes: 0,
      length: 0,
      errArr: [],
    };
  },
  mounted() {
    this.fetchFilmData();
    this.fetchGetTimeValue();
    this.getOptionList();
    this.getVideoTransNums();
    this.getVideoLabelList();
  },
  methods: {
    getUploadValue(data) {
      switch (data.type) {
        case "succTimes":
          this.succTimes = data.value;
          break;
        case "errTimes":
          this.errTimes = data.value;
          break;
        case "length":
          this.length = data.value;
          break;
        case "errArr":
          this.errArr = data.value;
          break;

        default:
          break;
      }
    },
    //获取视频数据
    fetchFilmData() {
      this.filmForm.labelIds = this.labelName.join(",") || "";
      this.filmForm.beginDate = this.uploadDate[0] || "";
      this.filmForm.endDate = this.uploadDate[1] || "";
      delete this.pages.total;
      videoList({ ...this.filmForm, ...this.pages })
        .then((res) => {
          if (Number(res.code) === 200) {
            let { pageNum, pageSize, total, list } = res.data;
            this.pages = {
              pageNum: pageNum,
              pageSize: pageSize,
              total: Number(total),
            };
            this.filmList = list;
          }
        })
        .catch((err) => console.log(err));
    },
    //平均时长转换
    formatterTime(row) {
      return row.averagePlay ? formatSecond(row.averagePlay, "1") : "0分0秒";
    },
    // 获取正在转码数量
    getVideoTransNums() {
      getTransCodeNum()
        .then((res) => {
          if (res.code === 200) {
            this.codeNum = res.data.codecNum;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取官方账号
    getOptionList() {
      optionList()
        .then((res) => {
          this.nickIdOptions = [];
          this.nickIdOptions = res.data;
        })
        .catch(() => {});
    },
    //获取视频类型
    fetchGetTimeValue() {
      getTimeValue()
        .then((res) => {
          if (Number(res.code) === 200) {
            // this.options = [];
            this.videoTypeList = res.data;
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
            this.$refs["upload"].linkData = data;
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
    //查看视频详情
    checkFilmsView(item) {
      this.isView = true;
      this.getVideoDataInfo(item);
    },
    // 查看视频
    checkplayFilm(item) {
      this.isPlay = true;
      this.filmUrl = item;
    },
    //转码
    handleClickTrans() {
      if (this.multipleSelection.length < 1) {
        this.$message(`请勾选多选框进行批量操作`);
        return false;
      }
      if (Number(this.codeNum) > 50) return false;
      this.isTrans = true;
    },
    // 上传
    handleUpload(bool, row) {
      this.isUpload = true;
      this.getVideoLabelList();
      if (bool) {
        //编辑
        this.$refs["upload"].upruleForm = {
          videoTitle: row.videoTitle,
          authorId: row.authorId,
        };
        this.$refs["upload"].labelTagList = row.labelIds
          .split(",")
          .filter(Boolean);
        this.$refs["upload"].isShowUpload = false;
        this.$refs["upload"].row = row;
        let arr = [];
        arr = this.nickIdOptions.map((item) => {
          return item.key;
        });
        if (arr.indexOf(row.authorId) > -1) {
          this.$refs["upload"].isAuthor = true;
        } else {
          this.$refs["upload"].isAuthor = false;
        }
      } else {
        //上传
        this.$refs["upload"].labelTagList = [];
        this.$refs["upload"].isShowUpload = true;
        this.$refs["upload"].isAuthor = true;
        this.$refs["upload"].upruleForm = {
          videoTitle: "",
          authorId: "",
        };
        this.$refs["upload"].succTimes = 0;
        this.$refs["upload"].errTimes = 0;
        this.$refs["upload"].errArr = [];
        this.succTimes = 0;
        this.errTimes = 0;
        this.length = 0;
        this.errArr = [];
      }
    },
    // 视频标签
    getVideoLabelList() {
      videoLabelList()
        .then((res) => {
          if (Number(res.code) === 200) {
            let { list } = res.data;
            list = list.filter((it) => it.is_enable);
            this.labelNameList = list.map((item) => {
              return {
                id: item.id,
                name: item.name.trim(),
              };
            });
          }
        })
        .catch(() => {});
    },
    //批量
    handleSelectionChange(val) {
      if (val.length > 10) {
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
      this.multipleSelection.forEach((item) => {
        return arr.push(item.videoId);
      });
      this.transCodeArr = arr;
      this.delIds = arr.join(",");
    },
    //删除与批量删除
    handleDelete(bol, row) {
      if (bol) {
        this.delIds = row.videoId;
        this.$confirm("是否删除该视频？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true,
        })
          .then(() => {
            this.doDelete();
          })
          .catch(() => {});
      } else {
        if (this.multipleSelection.length < 1) {
          this.$message(`请勾选多选框进行批量操作`);
        } else {
          this.$confirm("是否确定批量删除视频？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            center: true,
          })
            .then(() => {
              this.doDelete();
            })
            .catch(() => {});
        }
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
            if (this.filmList.length === 1 && this.pages.pageNum > 1)
              this.pages.pageNum -= 1;
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
    // 查询
    handleSearch() {
      this.fetchFilmData();
    },
    // 重置
    handleReset() {
      this.uploadDate = [];
      this.filmForm = {
        videoId: "",
        videoTitle: "",
        videoTimeType: "0",
        beginDate: "",
        endDate: "",
        standard: "-1",
        videoType: 0,
      };
      this.pages = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      };
      this.labelName = [];
      this.fetchFilmData();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";
.mine_select {
  width: 330px;
}
</style>
