<template>
  <div class="d_dialog">
    <el-dialog
      custom-class="custom-dialog my-dialog"
      :title="type === 'related' ? '影片关联' : '取消关联'"
      center
      :visible.sync="show"
      width="60%"
      :before-close="handleCancel"
    >
      <div class="top">
        <el-row class="row-bg">
          <el-col :md="24" :lg="11">
            <div class="date">
              <span>上传日期</span>&nbsp;&nbsp;&nbsp;
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
          <el-col :md="10" :lg="6" :offset="0">
            <el-input
              v-model="title"
              show-word-limit
              placeholder="影片名称"
              clearable
              style="width: 200px"
            />
          </el-col>
          <el-col :md="10" :lg="4">
            <div class="btns">
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button type="primary" @click="handleSelectionAll"
                >批量选择</el-button
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            :reserve-selection="true"
            align="center"
            width="60"
          />
          <el-table-column label="影片" prop="" align="center">
            <template slot-scope="scope">
              <div class="post_video">
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
                <div
                  class="play_icon"
                  @click="checkplayFilm(scope.row.movPath)"
                >
                  <i class="el-icon-video-play" style="font-size: 30px"></i>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="影片名称" prop="title" align="center">
          </el-table-column>
          <el-table-column label="上传日期" align="center" prop="createTime">
          </el-table-column>
        </el-table>
      </div>
      <div class="dialog-footer">
        <span slot="footer">
          <el-button type="primary" @click="handleClickRelated">{{
            type === "related" ? "确认关联" : "取消关联"
          }}</el-button>
        </span>
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
    </el-dialog>
    <!-- 查看视频 -->
    <play-film :show="isPlay" ref="film"></play-film>
  </div>
</template>
<script>
import { updateMoveRelated, RelatedList } from "@/api/home_api";
import pagination from "@/components/paginations";
import PlayFilm from "@/components/playFilm2";
import { getTableData } from "@/utils/index";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    type: String,
  },
  components: {
    pagination,
    PlayFilm,
  },
  data() {
    return {
      loading: false,
      dateTime: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      rowData: {},
      title: "",
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      isPlay: false,
      filmUrl: "",
      list: [],
      multipleSelection: [],
      mid: "",
      // 列表全选与否
      allSelect: false,
      array: [],
      pageValue: 0,
      movieRelationChildVo: [], // 关联和取关影片的详情
      tempArr: [],
      allArr: [],
    };
  },
  methods: {
    // 查看视频
    checkplayFilm(item) {
      this.isPlay = true;
      this.filmUrl = item;
      this.$nextTick(() => {
        this.$refs.film.playVideo(this.filmUrl);
      });
    },
    //   勾选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.type === "related") {
        this.movieRelationChildVo = this.multipleSelection.map((item) => {
          return {
            movieId: item.mid,
            movieName: item.title,
          };
        });
      } else {
        if (!this.allSelect) {
          this.allArr = this.list.map((item) => {
            return {
              movieId: item.mid,
              movieName: item.title,
            };
          });
        } else {
          this.tempArr = this.filterArrayObj(val, this.list).map((item) => {
            return {
              movieId: item.mid,
              movieName: item.title,
            };
          });
        }
      }
    },

    // 过滤两个数组对象中不同的值
    filterArrayObj(array1, array2) {
      var result = [];
      for (var i = 0; i < array2.length; i++) {
        var obj = array2[i];
        var num = obj.mid;
        var isExist = false;
        for (var j = 0; j < array1.length; j++) {
          var aj = array1[j];
          var n = aj.mid;
          if (n == num) {
            isExist = true;
            break;
          }
        }
        if (!isExist) {
          result.push(obj);
        }
      }
      return result;
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
      let params = {
        categoryId: this.rowData.sid,
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        startTime: this.dateTime?.length > 0 ? this.dateTime[0] : "",
        endTime: this.dateTime?.length > 0 ? this.dateTime[1] : "",
        title: this.title,
      };
      RelatedList({ ...params })
        .then((res) => {
          if (res.code * 1 === 200) {
            let { no, yes } = res.data;
            if (this.type === "related") {
              this.$parent.handleSlicePage(
                this.pages.pageNum,
                this.pages.pageSize,
                no
              );
              // this.array = no;
            } else {
              this.$parent.handleSlicePage(
                this.pages.pageNum,
                this.pages.pageSize,
                yes
              );
              // this.array = yes;
            }
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },

    // 批量全选
    handleSelectionAll() {
      this.allSelect = !this.allSelect;
      if (this.allSelect) {
        this.list.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row, this.allSelect);
        });
      } else {
        this.list.forEach((row) => {
          this.$refs.multipleTable.clearSelection();
        });
      }
    },
    // 确认关联
    handleClickRelated() {
      let params = {};
      if (this.type === "related") {
        params = {
          categoryId: this.rowData.sid,
          movieRelationChildVo: this.movieRelationChildVo,
          reqStatus: "1",
        };
      } else {
        !this.allSelect
          ? (this.movieRelationChildVo = this.allArr)
          : (this.movieRelationChildVo = this.tempArr);
        params = {
          categoryId: this.rowData.sid,
          movieRelationChildVo: this.movieRelationChildVo,
          reqStatus: "2",
        };
      }
      updateMoveRelated(params)
        .then((res) => {
          if (Number(res.code) === 200) {
            this.$message.success(
              this.type === "related" ? "关联成功" : "取关成功"
            );
            this.$parent.fetchData();
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          this.$parent.isAss = false;
          this.handleCancel();
        });
    },

    handleSizeChange(val) {
      this.pages.pageSize = val;
      let { pageNum, pageSize, data, length } = getTableData(
        this.pages.pageNum,
        this.pages.pageSize,
        this.$parent.array
      );
      this.pages = {
        pageNum,
        pageSize,
        total: length,
      };
      this.list = data;
      //多选回显
      this.$nextTick(() => {
        if (this.multipleSelection.length > 0) {
          this.multipleSelection.forEach((ele) => {
            // this.allSelect = ele.isRelated
            if (ele.isRelated) {
              this.$refs.multipleTable.toggleRowSelection(ele, true);
            }
          });
        } else {
          this.list.length > 0 &&
            this.list.forEach((row) => {
              // this.allSelect = row.isRelated
              if (row.isRelated) {
                this.$refs.multipleTable.toggleRowSelection(row, true);
              }
            });
        }
      });
    },
    handleCurrentChange(val) {
      this.pages.pageNum = val;
      this.pageValue = val;
      let { page, pageSize, data, length } = getTableData(
        this.pages.pageNum,
        this.pages.pageSize,
        this.$parent.array
      );
      this.pages = {
        pageNum: page,
        pageSize,
        total: length,
      };
      this.list = data;
      //多选回显
      this.$nextTick(() => {
        if (this.multipleSelection.length > 0) {
          this.multipleSelection.forEach((ele) => {
            // this.allSelect = ele.isRelated
            if (ele.isRelated) {
              this.$refs.multipleTable.toggleRowSelection(ele, true);
            }
          });
        } else {
          this.list.length > 0 &&
            this.list.forEach((row) => {
              // this.allSelect = row.isRelated
              if (row.isRelated) {
                this.$refs.multipleTable.toggleRowSelection(row, true);
              }
            });
        }
      });
    },
    //取消弹窗
    handleCancel() {
      this.$parent.isAss = false;
      this.allSelect = false;
      this.title = "";
      this.dateTime = [];
      this.$refs.multipleTable.clearSelection();
      this.pages = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      };
      this.movieRelationChildVo = [];
      this.tempArr = [];
      this.allArr = [];
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
.date,
.dialog-footer {
  @extend .dis_flex;
  flex-direction: row;
}
.content {
  margin-top: 20px;
}
.dialog-footer {
  margin-top: 20px;
  justify-content: space-between;
  .block {
    margin-top: 0;
  }
}
.btns {
  @extend .dis_flex;
  flex-direction: row;
}
</style>
