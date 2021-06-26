<template>
  <div class="container">
    <main class="main">
      <div class="film_search">
        <h3>版本筛选</h3>
        <el-form class="version_form" :inline="true">
          <el-form-item label="版本号">
            <el-select v-model="versionCode" clearable @clear="handleClear">
              <el-option
                v-for="item in versionOptions"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              size="small"
              @click="handleSearch"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <div class="film_content">
        <div class="film_top">
          <h3>版本列表</h3>
          <el-button
            icon="el-icon-plus"
            type="primary"
            size="small"
            @click="handleUpdateVersion(false)"
            >更新版本</el-button
          >
        </div>
        <!-- 列表 -->
        <el-table
          ref="multipleTable"
          max-height="550"
          :data="versionList"
          :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
          size="small"
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
          <el-table-column align="center" label="序号" type="index" />
          <el-table-column align="center" label="版本号" prop="versionCode" />
          <el-table-column align="center" label="版本名称" prop="versionName" />
          <el-table-column
            align="center"
            label="更新说明"
            prop="versionExplain"
          />
          <el-table-column
            align="center"
            label="更新公告标题"
            prop="versionTitle"
          />
          <el-table-column
            align="center"
            label="更新公告内容"
            prop="versionContent"
          />
          <el-table-column
            align="center"
            label="更新类型"
            prop="isUpdate"
            :formatter="formaterType"
          />
          <el-table-column
            align="center"
            label="终端类型"
            prop="originType"
            :formatter="formaterOriginType"
          />
          <el-table-column align="center" label="添加时间" prop="createTime" />
          <el-table-column align="center" label="发布时间" prop="publishTime" />
          <el-table-column
            align="center"
            label="状态"
            prop="isPublish"
            :formatter="formatterStatus"
          />
          <el-table-column align="center" label="操作人" prop="account" />
          <el-table-column
            align="center"
            fixed="right"
            label="操作"
            min-width="120"
          >
            <template slot-scope="scope">
              <div class="btns">
                <el-button
                  size="mini"
                  type="success"
                  @click="handleDetail(scope.row)"
                  >详情</el-button
                >
                <el-button
                  size="mini"
                  type="primary"
                  :style="{
                    display: scope.row.isPublish == '0' ? 'block' : 'none'
                  }"
                  @click="handleUpdateVersion(true, scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type=""
                  :style="{
                    display: scope.row.isPublish == '0' ? 'block' : 'none'
                  }"
                  @click="handlePost(scope.row)"
                  >发布</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  :style="{
                    display: scope.row.isPublish == '2' ? 'block' : 'none'
                  }"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="text-align: right; margin-top: 10px">
          <el-pagination
            :page-sizes="[10, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper"
            :page-size="pageSize"
            :current-page.sync="pageNum"
            background
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </main>

    <update-version :show="isUpdate" ref="update" :bool="bool" />
    <version-detail :show="isView" ref="detail" />
  </div>
</template>

<script>
import {
  versionList,
  versionDelete,
  versionInfo,
  updatePublish,
  getVersionList
} from "@/api/version_api";
import updateVersion from "./components/updateVersion";
import versionDetail from "./components/versionDetail";
import pagination from "@/components/paginations";
export default {
  name: "versionList",
  components: {
    updateVersion,
    versionDetail,
    pagination
  },
  data() {
    return {
      versionCode: "",
      versionOptions: [{ key: "", value: "全部" }],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      isUpdate: false,
      isView: false,
      isPost: false,
      updateType: {
        false: "普通更新",
        true: "强制更新"
      },
      status: {
        "1": "已发布",
        "0": "待发布",
        "2": "已下架"
      },
      originType: {
        "1": "安卓",
        "0": "iOS"
      },
      versionList: [],
      bool: false,
      rowData: null,
      allUrl: []
    };
  },
  mounted() {
    Promise.all[(this.fetchDataList(), this.getVersionList())];
  },
  methods: {
    // 获取列表
    fetchDataList() {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        versionCode: this.versionCode
      };
      versionList({ ...params })
        .then(res => {
          if (Number(res.code) === 200) {
            let { total, list } = res.data;
            this.total = Number(total);
            this.versionList = list;
          }
        })
        .catch(() => {});
    },
    formaterType(row) {
      return this.updateType[row.isUpdate];
    },
    formatterStatus(row) {
      return this.status[row.isPublish];
    },
    formaterOriginType(row) {
      return this.originType[row.originType];
    },
    // 版本下拉列表
    getVersionList() {
      getVersionList()
        .then(res => {
          if (Number(res.code) === 200) {
            let arr = [];
            arr = res.data.map(it => {
              return {
                key: it.versionCode,
                value: it.versionCode
              };
            });
            this.versionOptions = this.versionOptions.concat(arr);
          }
        })
        .catch(() => {});
    },
    // 更新/编辑版本
    async handleUpdateVersion(bool, row) {
      this.isUpdate = true;
      this.bool = bool;
      if (bool) {
        //编辑
        await this.getVersionInfo(row);
        let {
          versionCode,
          isUpdate,
          originType,
          versionExplain,
          versionTitle,
          versionContent,
          versionName
        } = row;
        this.$refs["update"].form = {
          versionCode,
          isUpdate,
          originType,
          versionExplain,
          versionTitle,
          versionContent,
          versionName
        };
        this.handleAppUrl(this.rowData);
      } else {
        // 添加
        this.$refs["update"].form = {
          versionCode: null,
          isUpdate: false,
          originType: "1",
          versionExplain: "",
          versionTitle: "",
          versionContent: "",
          versionName: ""
        };
        this.$refs["update"].azChannel = {
          prod: "",
          channelUrl1: "",
          channelUrl2: "",
          channelUrl3: "",
          channelUrl4: "",
          channelUrl5: "",
          channelUrl6: "",
          channelUrl7: "",
          channelUrl8: "",
          channelUrl9: "",
          channelUrl10: ""
        };
        this.$refs["update"].iosChannel = {
          prod: "",
          channelUrl1: "",
          channelUrl2: "",
          channelUrl3: "",
          channelUrl4: "",
          channelUrl5: "",
          channelUrl6: "",
          channelUrl7: "",
          channelUrl8: "",
          channelUrl9: "",
          channelUrl10: ""
        };
      }
    },
    handleAppUrl(rowData) {
      let azUrl = [];
      this.allUrl = [];
      if (rowData.versionInfo.originType == "1") {
        rowData.appUrl.length > 0 &&
          rowData.appUrl.forEach((it, idx) => {
            if (it.cid == 0) this.$refs["update"].azChannel.prod = it.appUrl;
            if (it.cid == 1)
              this.$refs["update"].azChannel.channelUrl1 = it.appUrl;
            if (it.cid == 2)
              this.$refs["update"].azChannel.channelUrl2 = it.appUrl;
            if (it.cid == 3)
              this.$refs["update"].azChannel.channelUrl3 = it.appUrl;
            if (it.cid == 4)
              this.$refs["update"].azChannel.channelUrl4 = it.appUrl;
            if (it.cid == 5)
              this.$refs["update"].azChannel.channelUrl5 = it.appUrl;
            if (it.cid == 6)
              this.$refs["update"].azChannel.channelUrl6 = it.appUrl;
            if (it.cid == 7)
              this.$refs["update"].azChannel.channelUrl7 = it.appUrl;
            if (it.cid == 8)
              this.$refs["update"].azChannel.channelUrl8 = it.appUrl;
            if (it.cid == 9)
              this.$refs["update"].azChannel.channelUrl9 = it.appUrl;
            if (it.cid == 10)
              this.$refs["update"].azChannel.channelUrl10 = it.appUrl;
            // azUrl.push(it.appUrl);
            this.allUrl.push(it.appUrl);
          });
      }
      let iosUrl = [];
      if (rowData.versionInfo.originType == "0") {
        rowData.appUrl.length > 0 &&
          rowData.appUrl.forEach((it, idx) => {
            if (it.cid == 0) this.$refs["update"].iosChannel.prod = it.appUrl;
            if (it.cid == 1)
              this.$refs["update"].iosChannel.channelUrl1 = it.appUrl;
            if (it.cid == 2)
              this.$refs["update"].iosChannel.channelUrl2 = it.appUrl;
            if (it.cid == 3)
              this.$refs["update"].iosChannel.channelUrl3 = it.appUrl;
            if (it.cid == 4)
              this.$refs["update"].iosChannel.channelUrl4 = it.appUrl;
            if (it.cid == 5)
              this.$refs["update"].iosChannel.channelUrl5 = it.appUrl;
            if (it.cid == 6)
              this.$refs["update"].iosChannel.channelUrl6 = it.appUrl;
            if (it.cid == 7)
              this.$refs["update"].iosChannel.channelUrl7 = it.appUrl;
            if (it.cid == 8)
              this.$refs["update"].iosChannel.channelUrl8 = it.appUrl;
            if (it.cid == 9)
              this.$refs["update"].iosChannel.channelUrl9 = it.appUrl;
            if (it.cid == 10)
              this.$refs["update"].iosChannel.channelUrl10 = it.appUrl;
            // iosUrl.push(it.appUrl);
            this.allUrl.push(it.appUrl);
          });
      }
      // this.allUrl = [...azUrl, ...iosUrl];
    },
    // 详情
    handleDetail(item) {
      this.isView = true;
      this.getVersionInfo(item);
    },
    // 版本详情
    async getVersionInfo(row) {
      let res = await versionInfo({
        versionCode: row.versionCode,
        originType: row.originType
      });
      if (Number(res.code) === 200) {
        row = res.data;
        row.appUrl = row.appUrl.filter(it => it.appUrl != "");
        this.$refs["detail"].row = row;
        this.rowData = row;
      }
    },
    //发布
    handlePost(row) {
      let context = `确认发布该最新版本 <span style="color:#02A7F0">${
        row.versionCode
      }</span> 吗？发布后用户前端将收到版本更新提示`;
      this.$confirm(context, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        center: true
      })
        .then(async () => {
          this.rowData = null;
          await this.getVersionInfo(row),
            this.handleAppUrl(this.rowData),
            this.publish(this.rowData);
        })
        .catch(() => {});
    },
    // publish
    publish(row) {
      let appUrls = [];
      row.appUrl.length > 0 &&
        row.appUrl.forEach(it => {
          appUrls.push(it.cid + "-" + it.appUrl);
        });
      let params = {
        appUrl: appUrls.join(","),
        originType: row.versionInfo.originType,
        versionCode: row.versionInfo.versionCode
      };
      updatePublish({ ...params })
        .then(res => {
          if (Number(res.code) === 200) this.fetchDataList();
        })
        .catch(() => {});
    },
    //删除
    handleDelete(row) {
      let context = `确认删除已下架的版本 <span style="color:#02A7F0">${
        row.versionCode
      }</span> 吗？`;
      this.$confirm(context, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        center: true
      })
        .then(async () => {
          this.rowData = null;
          await this.getVersionInfo(row),
            this.handleAppUrl(this.rowData),
            this.deleteVersion(this.rowData);
        })
        .catch(() => {});
    },
    // delete
    deleteVersion(row) {
      let appUrls = [];
      row.appUrl.length > 0 &&
        row.appUrl.forEach(it => {
          appUrls.push(it.cid + "-" + it.appUrl);
        });
      let params = {
        appUrl: appUrls.join(","),
        originType: row.versionInfo.originType,
        versionCode: row.versionInfo.versionCode
      };
      versionDelete({ ...params })
        .then(res => {
          if (Number(res.code) === 200) this.fetchDataList();
        })
        .catch(() => {});
    },
    // 清除
    handleClear() {
      this.versionNo = "";
      this.fetchDataList();
    },
    //刷新
    handleRefresh() {
      this.fetchDataList();
    },
    // 查询
    handleSearch() {
      this.fetchDataList();
    },
    // 切换pageSize
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchDataList();
    },
    // 切换pageNum
    handleCurrentChange(val) {
      this.pageNum = val;
      this.fetchDataList();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/style.scss";
.disflex {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.btns {
  @extend .disflex;
  flex-direction: row;
}
.version_form {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
