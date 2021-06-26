<template>
  <el-dialog
    custom-class="my-dialog"
    center
    title="VIP套餐编辑"
    width="50%"
    :visible.sync="show"
    :before-close="handleCancel"
  >
    <div class="form_box">
      <el-form
        ref="form"
        :model="form"
        label-width="120px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item label="会员类型">
          <el-input
            v-model="form.name"
            type="text"
            readonly
            class="member_type"
          />
        </el-form-item>
        <el-form-item label="原价抖币数" prop="originalPrice">
          <div class="nums">
            <el-input v-model.number="form.originalPrice" clearable />
            &nbsp;&nbsp;个
          </div>
        </el-form-item>
        <el-form-item label="现价抖币数" prop="price">
          <div class="nums">
            <el-input v-model.number="form.price" clearable /> &nbsp;&nbsp;个
          </div>
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
import { vipUpdatePlan } from "@/api/member_api";

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    let checkPrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("抖币不能为空"));
      } else if (!Number.isInteger(value)) {
        callback(new Error("请输入整数"));
      } else {
        callback();
      }
    };
    return {
      packageList: [
        {
          value: 30,
          label: "1个月",
        },
        {
          value: 90,
          label: "3个月",
        },
        {
          value: 360,
          label: "12个月",
        },
        {
          value: 0,
          label: "永久",
        },
      ],
      levelList: [
        {
          value: 1,
          label: "黄金",
        },
        {
          value: 2,
          label: "白金",
        },
        {
          value: 3,
          label: "砖石",
        },
        {
          value: 4,
          label: "永久",
        },
      ],
      rules: {
        originalPrice: [
          { required: true, validator: checkPrice, trigger: "blur" },
        ],
        price: [{ required: true, validator: checkPrice, trigger: "blur" }],
      },
      form: {
        name: "",
        originalPrice: "",
        price: "",
        vipLevel: "",
      },
    };
  },
  mounted() {},

  methods: {
    handleSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          vipUpdatePlan({ ...this.form })
            .then((res) => {
              if (res.code * 1 === 200) {
                this.handleCancel();
                this.$parent.fetchData();
              }
            })
            .catch((e) => console.error(e));
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //取消弹窗
    handleCancel() {
      this.$parent.isPackage = false;
      this.$refs["form"].resetFields();
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
.member_type >>> input {
  border: none;
}
.nums {
  display: flex;
}
</style>
