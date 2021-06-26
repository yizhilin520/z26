<template>
  <div class="d_dialog">
    <el-dialog
      custom-class="custom-dialog my-dialog"
      center
      title="新增分类"
      :visible.sync="show"
      width="40%"
      :before-close="handleCancel"
    >
      <div class="dis_flex" v-if="checkboxList.length > 0">
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            v-for="it in checkboxList"
            :key="it.sid"
            :label="it.sid"
            >{{ it.name }}</el-checkbox
          >
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="handleClickOK">确 定</el-button>
        </span>
      </div>
      <div class="dis_flex" v-else>
        <div>暂无数据，请前往分类管理中增加分类</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { recommendAdd } from "@/api/home_api";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      checkList: [],
      checkboxList: [],
    };
  },
  methods: {
    //   弹窗确定
    handleClickOK() {
      recommendAdd({ sid: this.checkList.join(",") })
        .then((res) => {
          if (res.code * 1 === 200) {
            this.$parent.isAdd = false;
            this.checkList = [];
            this.$parent.fetchData();
          }
        })
        .catch((e) => console.error(e));
    },
    //取消弹窗
    handleCancel() {
      this.$parent.isAdd = false;
      this.checkboxList = [];
      this.checkList = [];
    },
  },
};
</script>
<style lang="scss" scoped>
.dis_flex {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100px;
}
</style>
