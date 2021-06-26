<template>
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
</template>
<script>
export default {
  name: "Paginations",
  props: {
    pages: {
      type: Object,
      pageSize: {
        type: Number
      },
      pageNum: {
        type: Number
      },
      total: {
        type: Number
      }
    },
    fetchData: {
      type: Function,
      default: () => {}
    },
    handleScroll: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  methods: {
    handleSizeChange(val) {
      if (this.$parent.$parent.pages) {
        this.$parent.$parent.pages.pageSize = val;
      } else {
        this.$parent.pages.pageSize = val;
      }
      this.fetchData();
    },
    handleCurrentChange(val) {
      if (this.$parent.$parent.pages) {
        this.$parent.$parent.pages.pageNum = val;
      } else {
        this.$parent.pages.pageNum = val;
      }
      this.handleScroll();
      this.fetchData();
    }
  }
};
</script>
<style lang="scss" scoped>
.block {
  text-align: right;
  margin-top: 10px;
}
</style>
