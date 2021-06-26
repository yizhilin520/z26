<template>
  <div class="container">
    <main class="main">
      <div class="film_content">
        <div class="film_top">
          <h3>VIP套餐列表</h3>
        </div>
        <!-- 列表 -->
        <el-table
          ref="multipleTable"
          :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
          size="small"
          :data="vipList"
          max-height="600"
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
            type="index"
            label="序号"
            width="100"
            align="center"
          />
          <el-table-column label="VIP名称" prop="name" align="center" />
          <el-table-column
            label="VIP说明"
            show-overflow-tooltip
            prop="notes"
            align="center"
            min-width="100"
          />
          <el-table-column
            align="center"
            label="VIP时长"
            :formatter="formatterDuration"
          />
          <el-table-column align="center" label="所需金币数">
            <template slot-scope="scope">{{ scope.row.coin || 0 }}</template>
          </el-table-column>
          <el-table-column align="center" label="赠送抖币（个）">
            <template slot-scope="scope">{{ scope.row.gold || 0 }}</template>
          </el-table-column>
          <el-table-column label="修改人" prop="updateUser" align="center" />
          <el-table-column
            label="修改时间"
            min-width="100"
            prop="updateTime"
            align="center"
          />

          <el-table-column
            align="center"
            min-width="100"
            label="操作"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                class="btn_change_handle"
                size="mini"
                type="primary"
                :disabled="scope.row.valided"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </main>
    <div />
    <!-- vip套餐编辑 -->
    <edit-package :show="isPackage" ref="package" />
  </div>
</template>
<script>
import { vipList } from "@/api/member_api";
import editPackage from "./modal/editPackage";
export default {
  name: "Package",
  components: {
    editPackage,
  },
  data() {
    return {
      loading: false,
      isPackage: false,
      vipList: [],
      durations: {
        30: "一个月",
        90: "三个月",
        360: "一年",
        0: "永久",
      },
      rowData: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    formatterDuration(row) {
      return this.durations[row.duration];
    },
    // 获取列表
    fetchData() {
      vipList()
        .then((res) => {
          if (res.code * 1 === 200) {
            this.vipList = res.data;
          }
        })
        .catch((e) => console.error(e));
    },
    // 编辑
    handleEdit(row) {
      this.isPackage = true;
      let { sid, name, vipLevel, coin, gold } = row;
      this.$refs.package.form = {
        sid,
        name,
        vipLevel,
        coin,
        gold,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";
.table_img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: scale-down;
}
.img_box {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
