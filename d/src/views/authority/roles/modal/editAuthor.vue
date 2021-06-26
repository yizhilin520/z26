<template>
  <el-dialog
    title="修改权限"
    :destroy-on-close="true"
    :visible.sync="show"
    width="50%"
    custom-class="my-dialog"
    center
    :append-to-body="true"
    :before-close="handleCancel"
  >
    <el-tree
      ref="tree"
      :data="dataList"
      show-checkbox
      node-key="id"
      :props="defaultProps"
      :default-checked-keys="defaultKeys"
      @check="checkNodes"
      default-expand-all
      empty-text="暂无数据"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { editRoleMenu } from "@/api/authority_api";
export default {
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dataList: [],
      defaultKeys: [],
      id: "",
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  computed: {},
  mounted() {},
  methods: {
    // check
    checkNodes(a, b) {
      const fn = (item) => item !== undefined;
      if (this.defaultKeys) {
        this.defaultKeys.length = 0;
        this.defaultKeys.push(
          ...new Set([
            ...b.halfCheckedKeys.filter(fn),
            ...b.checkedKeys.filter(fn),
          ])
        );
      }
    },
    // handleSubmit
    handleSubmit() {
      if (this.defaultKeys.length <= 0)
        return this.$message.error("请勾选权限菜单");
      this.defaultKeys = [
        ...new Set([...this.defaultKeys, ...this.$parent.parentIds]),
      ].filter(Boolean);
      let params = {
        id: this.id,
        resourceIds: this.defaultKeys,
      };
      editRoleMenu(params)
        .then((res) => {
          if (res.code * 1 === 200) {
            this.handleCancel();
            this.$parent.getFetchData();
          }
        })
        .catch(() => {});
    },
    //取消弹窗
    handleCancel() {
      this.$parent.isEditAuthor = false;
      this.defaultKeys = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.form_box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
>>> .el-input__inner,
>>> .el-textarea__inner {
  width: 300px;
}
>>> .el-dialog {
  margin-top: 5vh !important;
  .el-dialog__body {
    overflow: auto;
    max-height: 80vh;
    .userdetails-container {
      max-height: none;
    }
  }
}
</style>
