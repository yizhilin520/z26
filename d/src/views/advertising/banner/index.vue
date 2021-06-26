<template>
  <div class="container">
    <main class="main">
      <div class="film_content">
        <div class="">
          <h3>banner轮播时长设置</h3>
          <div class="times">
            <span>每</span>
            <el-input
              placeholder=""
              v-model.number="times"
              clearable
              class="times_input"
            />
            <span>秒轮播一次</span>
            <el-button
              type="primary"
              style="margin-left: 20px"
              size="mini"
              @click="handleTimes"
              >确定</el-button
            >
          </div>
        </div>
        <div style="height: 20px"></div>
        <div class="film_top">
          <h3>首页广告列表</h3>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="handleAddOrEdit(false)"
            >添加banner</el-button
          >
        </div>
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="list"
          :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
          show-overflow-tooltip
          element-loading-text="Loading"
          border
          max-height="630"
          tooltip-effect="dark"
          fit
          stripe
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          highlight-current-row
        >
          <el-table-column
            label="序号"
            align="center"
            width="60"
            type="index"
          />
          <el-table-column label="banner名称" prop="title" align="center" />
          <el-table-column
            label="banner图片（iOS）"
            align="center"
            min-width="120"
          >
            <template slot-scope="scope">
              <div class="img_list">
                <el-image
                  v-for="(it, idx) in scope.row.iosPicture.split(',')"
                  :key="idx"
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
            </template>
          </el-table-column>
          <el-table-column
            label="banner图片（安卓）"
            align="center"
            min-width="120"
          >
            <template slot-scope="scope">
              <div class="img_list">
                <el-image
                  v-for="(it, idx) in scope.row.azPicture.split(',')"
                  :key="idx"
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
            </template>
          </el-table-column>
          <el-table-column label="链接地址" align="center" :formatter="formatterAddress" />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.status ? "上架" : "下架" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="上架时间" align="center" prop="updateTime" />
          <el-table-column
            align="center"
            min-width="110"
            label="操作"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                class="btn_change_handle"
                size="mini"
                @click="handleUpOrDown(scope.row)"
                >{{ !scope.row.status ? "上架" : "下架" }}</el-button
              >
              <el-button
                class="btn_change_handle"
                size="mini"
                type="primary"
                @click="handleAddOrEdit(true, scope.row)"
                >编辑</el-button
              >
              <el-button
                class="btn_change_handle"
                size="mini"
                type="danger"
                @click="handleDeleteAd(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </main>
    <!-- 添加广告 -->
    <add-banner :show="isShow" ref="homeBanner" />
  </div>
</template>
<script>
import {
  bannerList,
  deleteItem,
  updateStatus,
  updateTimes,
} from "@/api/banner_api";
import addBanner from "../components/addBanner";
import helper from "@/utils/helper.js";

export default {
  name: "ShortVideo",
  components: {
    addBanner,
  },
  data() {
    return {
      loading: false,
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 20,
      },
      list: [],
      ids: "",
      times: null,
      isShow: false,
      jumpTypeList: {
        1: "开通VIP界面",
        2: "充值界面",
        3: "上传短视频界面",
        4: "上传帖子界面",
      },
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    formatterAddress(row) {
     let { linkAddress, jumpType, linkType } = row;
      return linkType === 1 ? linkAddress : this.jumpTypeList[jumpType] || "";
    },
    fetchData() {
      bannerList({ bannerType: 0 })
        .then((res) => {
          if (res.code * 1 === 200) {
            this.list = res.data;
            this.ids = res.data.map((it) => it.bid).join(",");
          }
        })
        .catch((e) => console.error(e));
    },
    //编辑与添加
    handleAddOrEdit(bool, row) {
      this.$refs["homeBanner"].isEdit = bool;
      if (bool) {
        // 编辑
        let {
          bid,
          title,
          iosPicture,
          azLink,
          azPicture,
          times,
          bannerType,
          linkAddress,
          jumpType,
          linkType
        } = row;
        this.$refs["homeBanner"].form = {
          bid,
          title,
          iosPicture,
          azLink,
          azPicture,
          times,
          bannerType,
          linkAddress,
          linkType,
          jumpType,
        };
        this.isShow = true;
      } else {
        //添加
        if (this.list.length >= 9) {
          this.$message.warning("首页banner最多只能添加9个");
        } else {
          this.isShow = true;
        }
      }
    },
    // 检查是否为整数
    checkIntegerFn(val) {
      if (!helper.checkInteger(val)) {
        this.$message.warning("请输入整数");
        return true;
      }
      return false;
    },
    // 设置时长
    handleTimes() {
      if (this.checkIntegerFn(this.times)) return;
      updateTimes({ bid: this.ids, times: this.times })
        .then((res) => {
          if (res.code * 1 === 200) {
            this.times = null;
            this.fetchData();
          }
        })
        .catch((e) => console.error(e));
    },
    //上下架
    handleUpOrDown(row) {
      if (row.status) {
        this.$confirm("确认下架此bannerr吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          center: true,
        })
          .then(() => {
            this.handleUpdateStatue(row);
          })
          .catch(() => {});
      } else {
        this.$confirm("确认上架此banner吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          center: true,
        })
          .then(() => {
            this.handleUpdateStatue(row);
          })
          .catch(() => {});
      }
    },
    handleUpdateStatue(row) {
      updateStatus({ bid: row.bid, status: !row.status })
        .then((res) => {
          if (res.code * 1 === 200) {
            this.fetchData();
          }
        })
        .catch((e) => console.error(e));
    },
    // 删除
    handleDeleteAd(row) {
      this.$confirm("确认要删除该banner吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        center: true,
      })
        .then(() => {
          deleteItem({ bid: row.bid })
            .then((res) => {
              if (res.code * 1 === 200) {
                this.fetchData();
              }
            })
            .catch((e) => console.error(e));
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/style.scss";
.main {
  width: 100%;
  padding: 0px 20px 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.custom_table {
  //   box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  margin: 5px 0 20px 0;
}
.list_img {
  width: 80px;
  height: 80px;
}
.times_input {
  width: 100px;
}
</style>
