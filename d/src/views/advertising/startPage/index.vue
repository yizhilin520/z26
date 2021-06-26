<template>
  <div class="container">
    <main class="main">
      <div class="film_content">
        <div class="film_top">
          <h3>广告列表</h3>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="handleAddOrEdit(false)"
            >添加广告</el-button
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
          <el-table-column label="广告名称" prop="adName" align="center" />
          <el-table-column label="广告图片（iOS）" align="center">
            <template slot-scope="scope">
              <el-image
                fit="cover"
                class="list_img"
                :src="scope.row.iosImg"
                :preview-src-list="[scope.row.iosImg]"
              />
            </template>
          </el-table-column>
          <el-table-column label="广告图（安卓）" align="center">
            <template slot-scope="scope">
              <el-image
                fit="cover"
                class="list_img"
                :src="scope.row.azImg"
                :preview-src-list="[scope.row.azImg]"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="链接地址"
            align="center"
            :formatter="formatterAddress"
          />
          <el-table-column
            label="展示时长（秒）"
            align="center"
            prop="duration"
          />
          <el-table-column
            label="状态"
            align="center"
            prop="status"
            :formatter="formatterStatus"
          >
          </el-table-column>
          <el-table-column label="上架时间" align="center" prop="createTime" />
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
                @click="handleUpOrDown(scope.row)"
                >{{ scope.row.status === 0 ? "上架" : "下架" }}</el-button
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
    <add-start-ad :show="isShow" ref="startAd" />
  </div>
</template>
<script>
import { adList, deleteAd, updateAdStatus } from "@/api/banner_api";
import addStartAd from "../components/addStartAd";
export default {
  name: "StartPage",
  components: {
    addStartAd,
  },
  data() {
    return {
      loading: false,
      list: [],
      isShow: false,
      upStatus: {
        0: "下架",
        1: "上架",
      },
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
    formatterStatus(row) {
      return this.upStatus[row.status];
    },
    fetchData() {
      adList({ adType: 0 })
        .then((res) => {
          if (res.code * 1 === 200) {
            this.list = res.data;
          }
        })
        .catch((e) => console.error(e));
    },
    //编辑与添加
    handleAddOrEdit(bool, row) {
      this.$refs["startAd"].isEdit = bool;
      if (bool) {
        // 编辑
        let {
          id,
          adName,
          iosImg,
          azImg,
          times,
          duration,
          adType,
          linkAddress,
          jumpType,
          linkType,
        } = row;
        this.$refs["startAd"].form = {
          id,
          adName,
          iosImg,
          azImg,
          times,
          duration,
          adType,
          linkAddress,
          jumpType,
          linkType,
        };
        this.isShow = true;
      } else {
        //添加
        // this.isShow = true;
        if (this.list.length >= 1) {
          this.$message.warning("请删除原有的启动页广告");
        } else {
          this.isShow = true;
        }
      }
    },
    //上下架
    handleUpOrDown(row) {
      if (row.status === 1) {
        this.$confirm("确认下架此启动页广告吗？", "提示", {
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
        this.$confirm("确认上架此启动页广告吗？", "提示", {
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
      updateAdStatus({ id: row.id, status: row.status === 1 ? 0 : 1 })
        .then((res) => {
          if (res.code * 1 === 200) {
            this.fetchData();
          }
        })
        .catch((e) => console.error(e));
    },
    // 删除
    handleDeleteAd(row) {
      this.$confirm("确认要删除该启动页广告吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        center: true,
      })
        .then(() => {
          deleteAd({ ids: row.id })
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
</style>
