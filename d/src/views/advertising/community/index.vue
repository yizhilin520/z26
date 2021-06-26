<template>
  <div class="container">
    <main class="main">
      <div class="film_content">
        <div class="film_top">
          <h3>社区广告列表</h3>
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
          max-height="570"
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
          <el-table-column label="广告名称" prop="title" align="center" />
          <el-table-column label="广告图片（iOS）" align="center">
            <template slot-scope="scope">
              <el-image
                fit="cover"
                class="list_img"
                :src="scope.row.iosPicture"
                :preview-src-list="[scope.row.iosPicture]"
              />
            </template>
          </el-table-column>
          <el-table-column label="广告图（安卓）" align="center">
            <template slot-scope="scope">
              <el-image
                fit="cover"
                class="list_img"
                :src="scope.row.azPicture"
                :preview-src-list="[scope.row.azPicture]"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="链接地址"
            align="center"
            :formatter="formatterAddress"
          />
          <el-table-column
            label="每多少个帖子出现一次"
            align="center"
            prop="times"
          />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.status ? "上架" : "下架" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="上架时间" align="center" prop="updateTime" />
          <el-table-column
            align="center"
            min-width="120"
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
    <add-commnuity :show="isShow" ref="community" />
  </div>
</template>
<script>
import { bannerList, deleteItem, updateStatus } from "@/api/banner_api";
import AddCommnuity from "../components/addCommnuity.vue";
export default {
  name: "Community",
  components: {
    AddCommnuity,
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
      bannerList({ bannerType: 1 })
        .then((res) => {
          if (res.code * 1 === 200) {
            this.list = res.data;
          }
        })
        .catch((e) => console.error(e));
    },
    //编辑与添加
    handleAddOrEdit(bool, row) {
      this.$refs["community"].isEdit = bool;
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
          linkType,
        } = row;
        this.$refs["community"].form = {
          bid,
          title,
          iosPicture,
          azPicture,
          azLink,
          times,
          bannerType,
          linkAddress,
          linkType,
          jumpType,
        };
        this.isShow = true;
      } else {
        //添加
        if (this.list.length >= 1) {
          this.$message.warning("请删除原有的社区banner");
        } else {
          this.isShow = true;
        }
      }
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
  padding: 20px 20px;
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
