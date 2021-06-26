<template>
  <el-dialog
    custom-class="my-dialog"
    center
    :title="title"
    width="50%"
    :visible.sync="show"
    :before-close="handleCancel"
  >
    <div class="form_box">
      <el-form
        ref="form"
        :model="form"
        label-width="150px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item label="邀请人数选择" prop="friendCount">
          <el-select v-model="form.friendCount" clearable>
            <el-option v-for="item in invitNumList" :key="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="长视频观影次数增加">
          <el-select v-model="form.longVideoCount" clearable>
            <el-option
              v-for="item in longTimesList"
              :key="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="短视频观影次数增加">
          <el-select v-model="form.shortVideoCount" clearable>
            <el-option
              v-for="item in shortTimesList"
              :key="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="抖币数奖励" prop="goldAmount">
          <el-input
            v-model.number="form.goldAmount"
            placeholder="请输入整数"
            clearable
          />
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { addTask, editTask } from "@/api/task_api";
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    let checkReward = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("抖币数不能为空"));
      } else if (!Number.isInteger(value)) {
        callback(new Error("请输入整数"));
      } else {
        callback();
      }
    };
    return {
      form: {
        friendCount: "",
        longVideoCount: "",
        shortVideoCount: "",
        goldAmount: "",
        userType: "0"
      },
      invitNumList: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      longTimesList: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15"
      ],
      shortTimesList: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20"
      ],
      isEdit: false,
      rules: {
        goldAmount: [
          // {required: true, message: "请输入抖币数值", trigger: "blur" },
          { required: true, validator: checkReward, trigger: "blur" }
        ],
        friendCount: [
          { required: true, message: "请选择邀请人数", trigger: "chnage" }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    handleSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.isEdit
            ? editTask({ ...this.form })
                .then(res => {
                  if (res.code * 1 === 200) {
                    this.$parent.isAdd = false;
                    this.$parent.fetchTaskList();
                  }
                })
                .catch(e => console.error(e))
            : addTask({ ...this.form })
                .then(res => {
                  if (res.code * 1 === 200) {
                    this.$parent.isAdd = false;
                    this.$parent.fetchTaskList();
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
      this.$refs["form"].resetFields();
      this.$parent.isAdd = false;
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
</style>
