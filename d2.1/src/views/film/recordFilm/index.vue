<template>
  <div class="container">
    <main class="main">
      <div class="film_search">
        <h3>影片筛选</h3>
        <div>
          <el-form
            ref="filmForm"
            :inline="true"
            :model="filmForm"
            class="demo-form-inline searchForm"
          >
            <el-form-item label="影片ID">
              <el-input
                v-model="filmForm.mid"
                clearable
                placeholder="请输入影片ID"
              />
            </el-form-item>
            <el-form-item label="影片名称">
              <el-input
                v-model="filmForm.title"
                type="text"
                clearable
                placeholder="请输入影片名称"
              />
            </el-form-item>
            <el-form-item label="影片分类">
              <el-select v-model="filmForm.styleId" clearable>
                <el-option
                  v-for="item in filmTypeList"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否VIP">
              <el-select v-model="filmForm.videoMode" clearable>
                <el-option
                  v-for="item in filmMode"
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
          <h3>影片列表</h3>
          <div class="bar_right">
            <el-button plain type="primary" size="small" @click="handleFilmUnRecord(null)"
              >批量取消推荐</el-button
            >
          </div>
        </div>
        <!-- 列表 -->
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="filmList"
          row-key="mid"
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
          <el-table-column
            type="selection"
            :reserve-selection="true"
            align="center"
            width="60"
          />
          <el-table-column label="影片ID" prop="mid" align="center" />
          <el-table-column label="封面" min-width="110" align="center">
            <template slot-scope="scope">
              <el-image
                v-if="scope.row.coverPath"
                class="tb_image"
                :src="scope.row.coverPath"
                fit="cover"
                :preview-src-list="[scope.row.coverPath]"
              ></el-image>
              <span v-else> — </span>
            </template>
          </el-table-column>
          <el-table-column min-width="110" align="center" label="影片">
            <template slot-scope="scope">
              <el-image
                class="tb_image"
                :src="scope.row.coverPath"
                fit="cover"
                @click="checkplayFilm(scope.row.movPath)"
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
              <div class="play_icon" @click="checkplayFilm(scope.row.movPath)">
                <i class="el-icon-video-play" style="font-size: 30px"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="片名" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <a
                class="v_name"
                size="mini"
                type="text"
                @click="checkPostInfo(scope.row)"
                >{{ scope.row.title }}</a
              >
            </template>
          </el-table-column>
          <el-table-column label="分类" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name || "无" }}</span>
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
          <el-table-column
            label="时长"
            align="center"
            prop="duration"
            :formatter="formatterTime"
          />
          <el-table-column label="上传日期" align="center" prop="createTime" />
          <el-table-column label="收藏数" prop="collectNum" align="center" />
          <el-table-column label="点赞数" prop="praiseNum" align="center" />
          <el-table-column label="播放数" prop="playNum" align="center" />
          <el-table-column label="格式" prop="format" align="center" />
          <el-table-column label="清晰度" prop="standard" align="center" />
          <el-table-column
            label="影片模式"
            align="center"
            :formatter="formatterFilmType"
          />
          <el-table-column
            align="center"
            min-width="130"
            label="操作"
            fixed="right"
          >
            <template slot-scope="scope">
              <div class="btns_box">
                <el-button
                  size="mini"
                  class="btn"
                  type="primary"
                  @click="handleFilmUnRecord(scope.row)"
                  >取消推荐</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination
          :pages="pages"
          :fetchData="fetchFilmData"
          :handleScroll="handleScroll"
        />
      </div>
    </main>
    <div />
    <!-- 查看视频 -->
    <play-film :show="isPlay" :url="filmUrl" ref="film"></play-film>
    <!-- 影片详情 -->
    <tree-info :show="isTree" ref="treeInfo" />
  </div>
</template>

<script>
import { recommendList, postInfo, updateUnRecommend } from "@/api/film_api";
import { getOptionList } from "@/api/home_api";
import pagination from "@/components/paginations";
import playFilm from "../filmList/modal/playFilm";
import treeInfo from "../filmList/modal/treeInfo";
import { formatSecond } from "@/utils/index";
export default {
  name: "FileList",
  components: {
    pagination,
    playFilm,
    treeInfo,
  },
  data() {
    return {
      loading: false,
      filmForm: {
        mid: "",
        title: "",
        styleId: "",
        startDate: "",
        endDate: "",
        videoMode: "",
      },
      filmTypeList: [{ key: "", value: "全部" }],
      filmOptions: [
        { key: "", value: "全部" },
        { key: "0", value: "未上架" },
        { key: "1", value: "已上架" },
      ],
      status: {
        0: "未上架",
        1: "已上架",
      },
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
      isTree: false,
      filmUrl: "",
      multipleSelection: [],
      delIds: "",
      filmMode: [
        { key: "", value: "全部" },
        { key: 0, value: "免费影片" },
        { key: 1, value: "VIP影片" },
      ],
    };
  },
  mounted() {
    this.fetchFilmData();
    this.getOptions();
  },
  methods: {
    // 影片模式
    formatterFilmType(row) {
      let obj = {};
      this.filmMode.forEach((it) => {
        obj[it.key] = it.value;
      });
      return obj[row.videoMode];
    },
    //平均时长转换
    formatterTime(row) {
      return row.duration ? formatSecond(row.duration * 0.001, "1") : "0分0秒";
    },
    //获取影片数据
    fetchFilmData() {
      this.filmForm.startDate = this.uploadDate[0];
      this.filmForm.endDate = this.uploadDate[1];
      let params = {
        ...this.filmForm,
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
      };
      recommendList({ ...params })
        .then((res) => {
          if (res.code * 1 === 200) {
            let { total, pageNum, pageSize, list } = res.data;
            this.pages = {
              pageNum,
              pageSize,
              total: total * 1,
            };
            this.filmList = list;
          }
        })
        .catch((e) => console.error(e));
    },
    // 影片分类
    getOptions() {
      getOptionList()
        .then((res) => {
          if (res.code * 1 === 200) {
            res.data.forEach((it) => {
              this.filmTypeList.push({
                key: it.sid,
                value: it.name,
              });
            });
          }
        })
        .catch((e) => console.error(e));
    },
    // 影片详情
    checkPostInfo(row) {
      postInfo({ mid: row.mid })
        .then((res) => {
          if (res.code * 1 === 200 && res.data !== null) {
            this.isTree = true;
            let { data } = res;
            this.$refs["treeInfo"].dataInfo.push({
              label: "概览",
              children: [
                { label: `影片ID: ${row.mid}` },
                { label: `宽(px): ${data.width}` },
                { label: `高(px): ${data.height}` },
                {
                  label: `文件大小(M): ${
                    parseFloat(data.fileSize / (1024 * 1024)).toFixed(2) || "无"
                  }`,
                },
                { label: `存储的oss桶名称: ${data.bucketName || "无"}` },
                {
                  label: "音频",
                  children: [
                    { label: `编码器名称: ${data.audioDecoder || "无"}` },
                    { label: `采样率: ${data.audioSamplingRate || "无"}` },
                    { label: `通道数: ${data.audioChannels || "无"}` },
                    { label: `比特率: ${data.audioBitRate / 1000 || "无"}` },
                  ],
                },
                {
                  label: "视频",
                  children: [
                    { label: `编码格式: ${data.format || "无"}` },
                    {
                      label: `时长(s): ${
                        formatSecond(data.duration * 0.001, "1") || "无"
                      }`,
                    },
                    { label: `比特率: ${data.bitRate / 1000 || "无"}` },
                    { label: `流解码器: ${data.decoder || "无"}` },
                    { label: `帧率(FPS): ${data.frameRate || "无"}` },
                    { label: `封面地址: ${data.coverPath || "无"}` },
                    { label: `视频地址: ${data.movPath || "无"}` },
                  ],
                },
              ],
            });
          } else {
            this.$refs["treeInfo"].dataInfo = [];
          }
        })
        .catch((e) => console.error(e));
    },
    // 查看视频
    checkplayFilm(item) {
      this.isPlay = true;
      this.filmUrl = item;
      this.$nextTick(() => {
        this.$refs.film.playVideo(this.filmUrl);
      });
    },
    //批量
    handleSelectionChange(val) {
      //批量勾选
      this.multipleSelection = val;
      let arr = [];
      this.multipleSelection.map((item) => {
        return arr.push(item.mid);
      });
      this.delIds = arr.join(",");
    },
    //批量推荐
    handleFilmUnRecord(row) {
      let params = {
        mid: "",
      };
      if (row !== null) {
        params.mid = row.mid;
      } else {
        if (this.delIds === "") return this.$message.error("请先勾选影片");
        params.mid = this.delIds;
      }
      this.$confirm(
        "确认将选中影片取消推荐吗？取消后该影片不在前端的抖动推荐模块中展示",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true,
        }
      )
        .then(() => {
          updateUnRecommend(params)
            .then((res) => {
              if (res.code * 1 === 200) {
                this.$refs.multipleTable.clearSelection();
                this.fetchFilmData();
              }
            })
            .catch((e) => console.error(e));
        })
        .catch(() => {});
    },
    //查询
    handleSearch() {
      this.fetchFilmData();
    },
    handleReset() {
      this.filmForm = {
        mid: "",
        title: "",
        styleId: "",
        startDate: "",
        endDate: "",
        videoMode: "",
      };
      this.uploadDate = [];
      this.fetchFilmData();
    },
    handleScroll() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";
.btns_box {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  .btn {
    margin: 5px;
  }
}
</style>
