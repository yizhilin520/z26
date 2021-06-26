<template>
  <div>
    <el-dialog
      :title="dialogTitle.title"
      :destroy-on-close="true"
      :visible.sync="show"
      width="50%"
      custom-class="my-dialog"
      center
      :before-close="handleCancel"
    >
      <div class="form_box">
        <el-form
          ref="searchForm"
          :model="searchForm"
          label-width="80px"
          class="demo-ruleForm"
          :rules="rules"
        >
          <el-form-item label="发布平台">
            <el-select v-model="searchForm.platform">
              <el-option
                v-for="item in platfomOptiones"
                :key="item.key"
                :label="item.value"
                :value="item.key"
                placeholder="请选择发布平台"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发布渠道">
            <el-select v-model="searchForm.channelId">
              <el-option
                v-for="item in channelList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="显示层级">
            <el-select v-model="searchForm.level">
              <el-option
                v-for="item in option"
                :key="item.key"
                :label="item.value"
                :value="item.key"
                placeholder="请选择显示层级"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="公告标题" prop="title">
            <el-input
              v-model="searchForm.title"
              placeholder="请输入公告标题"
              clearable
              rows="3"
              type="textarea"
            />
          </el-form-item>
          <el-form-item label="公告内容" prop="context">
            <el-input
              v-model="searchForm.context"
              minlength="1"
              maxlength="500"
              show-word-limit
              type="textarea"
              clearable
              placeholder="请输入公告内容"
              rows="5"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer" :style="{ marginBottom: '0' }">
        <el-button size="small" @click="handleCancel">取 消</el-button>
        <el-button type="primary" size="small" @click="handleSubmit">{{
          dialogTitle.bol ? "确定" : "发布"
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { saveNotice } from "@/api/notice_api";
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      searchForm: {
        platform: 0,
        title: "",
        context: "",
        level: 1,
        id: "",
        channelId: "-1"
      },
      option: [
        { key: 1, value: "1级" },
        { key: 2, value: "2级" },
        { key: 3, value: "3级" }
      ],
      platfomOptiones: [],
      channelList: [],
      rules: {
        title: [
          { required: true, message: "公告标题不能为空", trigger: "blur" }
        ],
        context: [
          { required: true, message: "公告内容不能为空", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    handleSubmit() {
      this.$refs["searchForm"].validate(valid => {
        if (valid) {
          saveNotice({ ...this.searchForm })
            .then(res => {
              if (res.code * 1 === 200) {
                this.handleCancel();
                this.$parent.fetchData();
              }
            })
            .catch(e => console.error(e));
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //取消弹窗
    handleCancel() {
      this.$parent.isNotice = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.form_box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
>>> .el-input__inner {
  width: 300px;
}
>>> .el-textarea__inner {
  width: 400px;
}
</style>
