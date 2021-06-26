<template>
  <div class="container">
    <main class="main">
      <div class="film_search">
        <h3>帖子筛选</h3>
        <div>
          <el-form
            :inline="true"
            :model="userForm"
            class="demo-form-inline searchForm"
            size="small"
          >
            <el-form-item label="用户ID">
              <el-input
                v-model="userForm.authorId"
                placeholder="请输入用户ID"
                clearable
              />
            </el-form-item>
            <el-form-item label="用户名">
              <el-input
                v-model="userForm.account"
                type="text"
                placeholder="请输入用户名"
                clearable
              />
            </el-form-item>
            <el-form-item label="用户昵称">
              <el-input
                v-model="userForm.nickname"
                type="text"
                placeholder="请输入用户昵称"
                clearable
              />
            </el-form-item>
            <el-form-item label="帖子类型">
              <el-select v-model="userForm.postType" clearable>
                <el-option
                  v-for="item in postTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="帖子状态">
              <el-select v-model="userForm.status" clearable>
                <el-option
                  v-for="item in postStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="发布日期">
              <el-date-picker
                v-model="memberDate"
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
          <h3>审核列表</h3>
          <el-button type="danger" size="small" plain @click="handleDelete"
            >批量删除</el-button
          >
        </div>
        <!-- 列表 -->
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="dataList"
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
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="60"
          />
          <el-table-column label="用户ID" prop="authorId" align="center" />
          <el-table-column align="center" label="用户名" prop="account" />
          <el-table-column label="用户昵称" align="center" prop="nickname" />
          <el-table-column label="帖子内容" align="center" min-width="180">
            <template slot-scope="scope">
              <div class="post_content">
                {{ scope.row.content }}
              </div>
              <div v-if="scope.row.videos" class="post_video">
                <el-image
                  class="tb_image"
                  :src="scope.row.coverVideo"
                  fit="cover"
                  @click="checkplayFilm(scope.row.videos)"
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
                <div class="play_icon" @click="checkplayFilm(scope.row.videos)">
                  <i class="el-icon-video-play" style="font-size: 30px"></i>
                </div>
              </div>
              <div v-else-if="scope.row.pictures" class="img_list">
                <div
                  v-for="(it, idx) in scope.row.pictures.split(',')"
                  :key="idx"
                >
                  <el-image
                    class="tb_image"
                    :src="it"
                    fit="cover"
                    :preview-src-list="[it]"
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
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="上传日期"
            align="center"
            min-width="100"
            :formatter="formatterTime"
          />
          <el-table-column
            label="审核状态"
            align="center"
            min-width="100"
            :formatter="filterReviewStatus"
          />
          <el-table-column
            align="center"
            min-width="100"
            fixed="right"
            prop="created_at"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                @click="handleReview(scope.row)"
                >审核</el-button
              >
              <el-button
                size="mini"
                type="primary"
                @click="handleView(scope.row)"
                >详情</el-button
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
    <!-- 详情 -->
    <post-view :show="isView" ref="postInfo" />
    <!-- 审核 -->
    <post-review :show="isReview" ref="review" />
    <!-- 查看视频 -->
    <play-film :show="isPlay" :url="filmUrl"></play-film>
  </div>
</template>

<script>
import { checkList, remove, postCheck } from "@/api/post_api";
import pagination from "@/components/paginations";
import postView from "./modal/postView";
import postReview from "./modal/postReview";
import playFilm from "./modal/playFilm";
import { parseTime } from "@/utils/index.js";
export default {
  name: "PostReview",
  components: { pagination, postView, postReview, playFilm },
  data() {
    return {
      loading: false,
      userForm: {
        authorId: "",
        account: "",
        nickname: "",
        postType: "-1",
        startDate: "",
        endDate: "",
        status: "-1"
      },
      dataList: [],
      postStatusList: [
        {
          value: "-1",
          label: "全部"
        },
        {
          value: "1",
          label: "未审核"
        },
        {
          value: "0",
          label: "未通过"
        }
      ],
      postTypeList: [
        {
          value: "-1",
          label: "全部"
        },
        {
          value: "0",
          label: "纯文字"
        },
        {
          value: "1",
          label: "纯图片"
        },
        {
          value: "2",
          label: "纯视频"
        },
        {
          value: "3",
          label: "图文结合"
        },
        {
          value: "4",
          label: "文字视频结合"
        }
      ],
      memberDate: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      reviewStatus: {
        2: "未审核",
        0: "未通过"
      },
      filmUrl: "",
      isPlay: false,
      isView: false,
      isReview: false,
      multipleSelection: [],
      ids: ""
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    formatterTime(row) {
      return parseTime(row.publishTime, "{y}-{m}-{d} {h}:{i}:{s}");
    },
    // 列表
    fetchData() {
      let params = {
        ...this.userForm,
        startDate: this.memberDate[0],
        endDate: this.memberDate[1],
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      };
      checkList({ ...params })
        .then(res => {
          if (res.code * 1 === 200) {
            let { total, pageNum, pageSize, list } = res.data;
            this.pages = {
              pageNum,
              pageSize,
              total: total * 1
            };
            this.dataList = list;
          }
        })
        .catch(e => console.error(e));
    },
    // 审核状态
    filterReviewStatus(row) {
      return this.reviewStatus[row.status];
    },
    // 详情接口
    getPostInfo(item) {
      postInfo({ pid: item.pid })
        .then(res => {
          if (res.code * 1 === 200) {
            this.$refs["postInfo"].data = res.data;
            this.isView = true;
          }
        })
        .catch(e => console.error(e));
    },
    //   详情
    handleView(item) {
      // this.getPostInfo(item)
      this.$refs["postInfo"].data = item;
      this.isView = true;
    },
    // 审核
    handleReview(item) {
      this.isReview = true;
      this.$refs["review"].data = item;
    },

    // 查看视频
    checkplayFilm(item) {
      this.isPlay = true;
      this.filmUrl = item;
    },
    // 查询
    handleSearch() {
      this.fetchData();
    },
    //重置
    handleReset() {
      this.memberDate = [];
      this.userForm = {
        authorId: "",
        account: "",
        nickname: "",
        postType: "-1",
        startDate: "",
        endDate: "",
        status: "-1"
      };
      this.pages = {
        pageNum: 1,
        pageSize: 10,
        total: 0
      };
      this.fetchData();
    },
    //批量
    handleSelectionChange(val) {
      if (val.length > 10) {
        // 截取前10位
        this.multipleSelection = val.slice(0, 10);
        // 截取10位之后的数组  禁止选中
        let tempArr = val.slice(10);
        if (tempArr.length !== 0) {
          tempArr.forEach(ele => {
            this.$refs.multipleTable.toggleRowSelection(ele, false);
          });
        }
      } else {
        //批量勾选
        this.multipleSelection = val;
      }
      let arr = [];
      this.multipleSelection.map(item => {
        return arr.push(item.pid);
      });
      this.ids = arr.join(",");
    },
    //删除与批量删除
    handleDelete() {
      let context = "确认删除该帖子吗？";
      if (this.multipleSelection.length < 1) {
        this.$message(`请勾选多选框进行批量操作`);
      } else {
        this.$confirm(context, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true
        }).then(() => {
          this.delete();
        });
      }
    },
    //删除接口
    delete(item) {
      remove({ pid: this.ids })
        .then(res => {
          if (res.code * 1 === 200) this.fetchData();
        })
        .finally(() => {
          this.$refs.multipleTable.clearSelection();
        });
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
