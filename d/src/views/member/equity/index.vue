<template>
  <div class="container">
    <main class="main">
      <div class="film_content">
        <div class="film_top">
          <h3>VIP权益设置</h3>
        </div>
        <!-- 列表 -->
        <el-table
          ref="multipleTable"
          :data="equityList"
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
          <el-table-column type="index" label="序号" align="center" />
          <el-table-column label="VIP名称" prop="name" align="center" />
          <el-table-column label="权益前端显示" align="center" class="equity">
            <template slot-scope="scope">
              <div
                class="icon_img"
                v-for="(it, idx) in scope.row.seniorDetail.filter(Boolean)"
                :key="idx"
              >
                <el-avatar
                  v-if="it.icon"
                  :size="40"
                  :src="it.icon"
                  fit="cover"
                ></el-avatar>
                <span class="eq_text">{{ it.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.row)"
                >添加VIP权益</el-button
              >
              <el-button
                size="mini"
                type="primary"
                @click="handleReset(scope.row)"
                >重置</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </main>
    <div />
    <!-- 添加，编辑 -->
    <equity-modal :show="isEdit" ref="equity" />
  </div>
</template>
<script>
import { vipRightList, vipRightReset } from "@/api/member_api";
import equityModal from "./modal/equityModal";
export default {
  name: "Equity",
  components: {
    equityModal
  },
  data() {
    return {
      loading: false,
      title: "",
      settingTitle: "",
      isEdit: false,
      isSetting: false,
      equityList: []
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      vipRightList()
        .then(res => {
          if (res.code * 1 === 200) {
            this.equityList = res.data;
          }
        })
        .catch(e => console.error(e));
    },
    //   添加VIP权益
    handleEdit(row) {
      this.isEdit = true;
      let { vipLevel } = row;
      this.$refs.equity.data = {
        vipLevel
      };
    },

    // 重置
    handleReset(row) {
      if (row.seniorDetail.filter(Boolean).length <= 0) return;
      let content = "确认重置该权益吗？重置后前端对应的VIP权益下不显示该权益";
      this.$confirm(content, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          vipRightReset({ vipLevel: row.vipLevel })
            .then(res => {
              if (res.code * 1 === 200) {
                this.fetchData();
              }
            })
            .catch(e => console.error(e));
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";
.icon_img {
  margin: 5px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 30%;
  .eq_text {
    display: inline-block;
    width: 80%;
    text-align: left;
    padding-left: 10px;
  }
}
>>> .el-avatar > img {
  width: 100%;
}
</style>
