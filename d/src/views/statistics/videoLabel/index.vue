<template>
  <div class="container">
    <main class="main">
      <div class="film_content">
        <div class="btns">
          <el-button
            round
            :type="active ? 'primary' : ''"
            @click="handleClickBtns('film')"
            >影片搜索词统计</el-button
          >
          <el-button
            :type="!active ? 'primary' : ''"
            round
            @click="handleClickBtns('video')"
            >短视频搜索词统计</el-button
          >
        </div>
        <div class="btn1 btns">
          <h4>{{ title1 }}—TOP20</h4>
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="12">
              <el-table
                ref="multipleTable"
                max-height="550"
                :data="type === 'film' ? filmTopbeforeList : videoTopbeforeList"
                style="width: 97%; margin: 0 1.5%"
                :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
                border
                fit
                size="small"
              >
                <el-table-column align="center" label="排名" prop="rank" />
                <el-table-column
                  align="center"
                  label="搜索词"
                  prop="searchText"
                />
                <el-table-column align="center" label="次数" prop="searchNum" />
              </el-table>
            </el-col>
            <el-col :span="12">
              <el-table
                ref="multipleTable"
                max-height="550"
                :data="type === 'film' ? filmTopAfterList : videoTopAfterList"
                style="width: 97%; margin: 0 1.5%"
                :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
                border
                fit
                size="small"
              >
                <el-table-column align="center" label="排名" prop="rank" />
                <el-table-column
                  align="center"
                  label="搜索词"
                  prop="searchText"
                />
                <el-table-column align="center" label="次数" prop="searchNum" />
              </el-table>
            </el-col>
          </el-row>
        </div>
        <div style="height: 30px"></div>
        <div class="btn2">
          <h4>{{ title2 }}</h4>
          <el-table
            ref="multipleTable"
            :data="type === 'film' ? filmHistoryList : videoHistoryList"
            max-height="550"
            :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
            border
            fit
            size="small"
          >
            <el-table-column align="center" label="搜索词" prop="searchText" />
            <el-table-column align="center" label="次数" prop="searchNum" />
            <el-table-column align="center" label="占比" prop="rate" />
          </el-table>
          <pagination
            :pages="pages"
            :fetchData="propFetchData"
            :handleScroll="handleScroll"
          />
        </div>
      </div>
    </main>
    <div />
  </div>
</template>

<script>
import { videoSearchCount } from "@/api/videoLabel_api";
import pagination from "@/components/paginations";
export default {
  name: "LabelList",
  components: { pagination },
  data() {
    return {
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      active: true,
      title1: "影片搜索词",
      title2: "影片历史搜索词",
      filmTopbeforeList: [],
      filmTopAfterList: [],
      filmHistoryList: [],
      videoTopbeforeList: [],
      videoTopAfterList: [],
      videoHistoryList: [],
      type: "film"
    };
  },
  mounted() {
    this.fetchFilmData();
  },
  methods: {
    //   切换btns
    handleClickBtns(type) {
      this.type = type;
      if (type === "film") {
        this.active = true;
        this.title1 = "影片搜索词";
        this.title2 = "影片历史搜索词";
        this.pages = {
          pageNum: 1,
          pageSize: 10,
          total: 0
        };
        this.fetchFilmData();
      } else {
        this.active = false;
        this.title1 = "短视频搜索词";
        this.title2 = "短视频历史搜索词";
        this.pages = {
          pageNum: 1,
          pageSize: 10,
          total: 0
        };
        this.fetchVideoSearchCount();
      }
    },
    //chage pages
    propFetchData() {
      this.type === "film"
        ? this.fetchFilmData()
        : this.fetchVideoSearchCount();
    },
    // 影片部分
    fetchFilmData() {
      let params = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        type: 0
      };
      videoSearchCount({ ...params })
        .then(res => {
          if (Number(res.code) === 200) {
            let arr = res.data.moiveSearchRankList;
            arr.forEach((item, index) => {
              item.rank = `TOP${index + 1}`;
            });
            if (arr.length >= 10) {
              this.filmTopbeforeList = arr.slice(0, 10);
              this.filmTopAfterList = arr.slice(10, arr.length);
            } else {
              this.filmTopbeforeList = arr;
            }
            let { pageSize, pageNum, total, list } = res.data.moiveSearchLists;
            this.pages = {
              pageNum,
              pageSize,
              total: total * 1
            };
            this.filmHistoryList = list;
            this.filmHistoryList.forEach(it => {
              it.rate = (parseFloat(it.rate) * 100).toFixed(2) + "%";
            });
          }
        })
        .catch(() => {});
    },

    // 视频标签统计
    fetchVideoSearchCount() {
      let params = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        type: 1
      };
      videoSearchCount({ ...params })
        .then(res => {
          if (Number(res.code) === 200) {
            let arr = res.data.videoSearchRankList;
            arr.forEach((item, index) => {
              item.rank = `TOP${index + 1}`;
            });
            if (arr.length >= 10) {
              this.videoTopbeforeList = arr.slice(0, 10);
              this.videoTopAfterList = arr.slice(10, arr.length);
            } else {
              this.videoTopbeforeList = arr;
            }
            let { total, list } = res.data.videoSearchLists;
            this.pages.total = Number(total);
            this.videoHistoryList = list;
            this.videoHistoryList.forEach(it => {
              it.rate = (parseFloat(it.rate) * 100).toFixed(2) + "%";
            });
          }
        })
        .catch(() => {});
    },
    handleScroll() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";
.container {
  margin-top: -10px;
}
.btns {
  margin-top: 30px;
}
</style>
