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
              >添加</el-button
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
          <el-table-column
            align="center"
            label="渠道名称"
            prop="channelName"
          ></el-table-column>
          <el-table-column align="center" label="渠道url" prop="channelUrl" />
          <el-table-column
            align="center"
            label="环体安卓下载链接"
            prop="azUrl"
          />
          <el-table-column
            align="center"
            label="环体iOS下载链接"
            prop="iosUrl"
          />
          <el-table-column
            align="center"
            label="最后操作时间"
            prop="updateTime"
          />
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
                type="danger"
                @click="handleDelete(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </main>
    <div />
    <!-- 添加与编辑下载 -->
    <add-download :show="isAdd" ref="download" />
  </div>
</template>
<script>
import {
  downdSettingList,
  delDowndSetting,
  channelDownList,
} from "@/api/otherSetting_api";
import pagination from "@/components/paginations";
import AddDownload from "./components/AddDownload";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Download",
  components: { pagination, AddDownload },
  data() {
    return {
      loading: false,
      accountList: [],
      isAdd: false,
    };
  },
  computed: {
    ...mapGetters(["channelList"]),
  },
  mounted() {
    this.getFetchData();
    this.fetchDownList();
  },
  methods: {
    ...mapActions("other", ["setChanelList"]),
    formatterStatus(row) {
      return this.maskStatus[row.status];
    },
    //获取列表
    getFetchData() {
      downdSettingList()
        .then((res) => {
          if (Number(res.code) === 200) {
            this.accountList = res.data;
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
            this.$refs["download"].channelOptions = res.data;
          }
        })
        .catch((err) => console.log(err));
    },
    // 添加与编辑
    handleClickBtn(bool, row) {
      this.fetchDownList();
      this.isAdd = true;
      this.$refs["download"].isEdit = bool;
      if (bool) {
        let { id, azUrl, channelId, iosUrl, channelName } = row;
        this.$refs["download"].channelOptions.push({
          id: channelId,
          channelName,
        });
        this.$refs["download"].form = {
          azUrl,
          id,
          iosUrl,
          channelId,
        };
      } else {
        this.$refs["download"].form = {
          azUrl: "",
          channelId: "",
          id: "",
          iosUrl: "",
        };
      }
    },
    // 删除
    handleDelete(id) {
      this.$confirm("确定删除该渠道的环体下载链接设置吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          delDowndSetting({ id: id })
            .then((res) => {
              if (res.code * 1 === 200) {
                this.getFetchData();
              }
            })
            .catch((e) => console.error(e));
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
