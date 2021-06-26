<template>
  <div class="container">
    <main class="main">
      <div class="film_content">
        <div class="film_top">
          <h3></h3>
          <div class="bar_right">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              plain
              @click="handleClickBtn(false)"
              >添加水印</el-button
            >
          </div>
        </div>
        <!-- 列表 -->
        <el-table
          ref="multipleTable"
          :data="accountList"
          :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
          size="small"
          max-height="700"
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
            align="center"
            type="index"
            label="序号"
            width="100px"
          />
          <el-table-column align="center" label="渠道名称" prop="channelName" />
          <el-table-column align="center" label="水印图片">
            <template slot-scope="scope">
              <el-image
                v-if="scope.row.watermarkImage"
                class="mask_image"
                :src="scope.row.watermarkImage"
                fit="fill"
                :preview-src-list="[scope.row.watermarkImage]"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="状态"
            :formatter="formatterStatus"
          >
          </el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            prop="created_at"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleClickBtn(true, scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                :type="scope.row.status === 1 ? '' : 'waring'"
                @click="handleChangeStatus(scope.row)"
                >{{ scope.row.status === 1 ? "关闭" : "显示" }}</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :pages="pages"
          :fetchData="getFetchData"
          :handleScroll="handleScroll"
        />
      </div>
    </main>
    <div />
    <!-- 添加与编辑水印 -->
    <add-water-mask :show="isEdit" ref="watermask" />
  </div>
</template>
<script>
import {
  getWatermaskList,
  deleteWaterMark,
  updateMaskStatus,
} from "@/api/otherSetting_api";
import { channelDownList } from "@/api/statistics_api";
import pagination from "@/components/paginations";
import AddWaterMask from "./components/AddWaterMask";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Watermask",
  components: { pagination, AddWaterMask },
  data() {
    return {
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      loading: false,
      accountList: [],
      isEdit: false,
      maskStatus: {
        0: "隐藏",
        1: "启用",
      },
    };
  },
  computed: {
    ...mapGetters(["channelList"]),
  },
  mounted() {
    this.getFetchData();
  },
  methods: {
    ...mapActions("other", ["setChanelList"]),
    formatterStatus(row) {
      return this.maskStatus[row.status];
    },
    //获取列表
    getFetchData() {
      let { pageNum, pageSize } = this.pages;
      getWatermaskList({ pageNum, pageSize })
        .then((res) => {
          if (Number(res.code) === 200) {
            let { total, pageNum, pageSize, list } = res.data;
            this.pages = {
              pageNum,
              pageSize,
              total: total * 1,
            };
            this.accountList = list;
            this.isEdit = total * 1 >= 30 ? true : false;
          }
        })
        .catch(() => {});
    },
    // 渠道下拉列表
    fetchDownList() {
      channelDownList()
        .then((res) => {
          if (Number(res.code) === 200) {
            this.setChanelList(res.data);
            this.$refs["watermask"].channelOptions = [...res.data];
          }
        })
        .catch((err) => console.log(err));
    },
    // 添加与编辑
    handleClickBtn(bool, row) {
      if (this.channelList.length <= 0) this.fetchDownList();
      this.isEdit = true;
      this.$refs["watermask"].isChild = bool;
      if (bool) {
        let { id, channelId, watermarkImage } = row;
        this.$refs["watermask"].form = {
          channelId,
          watermarkImage,
          id,
        };
      } else {
        this.$refs["watermask"].form = {
          channelId: "",
          watermarkImage: "",
          id: "",
        };
      }
    },
    //修改状态
    handleChangeStatus(row) {
      this.$confirm(
        `确定 ${row.status === 1 ? "关闭" : "显示"} 水印吗？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          center: true,
        }
      )
        .then(() => {
          let params = {
            id: row.id,
            status: row.status === 1 ? 0 : 1,
          };
          updateMaskStatus(params)
            .then((res) => {
              if (Number(res.code) === 200) {
                this.getFetchData();
              }
            })
            .catch((err) => console.log(err));
        })
        .catch(() => {});
    },
    // 删除
    handleDelete(id) {
      this.$confirm(
        "确认删除该渠道的水印吗？删除后用户保存视频到本地播放不会显示出水印",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true,
        }
      )
        .then(() => {
          deleteWaterMark({ id })
            .then((res) => {
              if (Number(res.code) === 200) {
                this.getFetchData();
              }
            })
            .catch((err) => console.log(err));
        })
        .catch(() => {});
    },
    handleScroll() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
    },
  },
};
</script>
<style lang="scss" scoped>
.film_content {
  padding: 35px 30px 30px 30px !important;
}
.mask_image {
  width: 70%;
  height: 85px;
  img {
    width: 100%;
    height: 100%;
  }
}
@import "@/assets/styles/style.scss";
</style>
