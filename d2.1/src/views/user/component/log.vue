<template>
  <div>
    <el-table
      :header-cell-style="{ background: '#f5f7fa' }"
      border
      :data="logList"
      fit
      highlight-current-row
      size="mini"
    >
      <el-table-column align="center" label="时间">
        <template slot-scope="scope">
          {{ scope.row.lastLoginTime }}
        </template>
      </el-table-column>
      <el-table-column label="IP" align="center">
        <template slot-scope="scope">
          {{ scope.row.ipAddress }}
        </template>
      </el-table-column>
      <el-table-column label="地区" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ipArea }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录设备" align="center" min-width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.phoneInfo }}</span>
        </template>
      </el-table-column>
    </el-table>
    <slot name="log_pagination"></slot>
  </div>
</template>

<script>
export default {
  components: {},

  props: {
    pages: {
      type: Object,
      default: null
    },
    logList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>
<style scoped lang="scss" scoped>
.inline-block {
  display: inline-block;
}
</style>
