<template>
  <el-dialog
    custom-class="my-dialog"
    center
    :title="title"
    width="50%"
    :visible.sync="show"
    :before-close="handleCancel"
    :close-on-click-modal="false"
  >
    <el-form
      ref="form"
      :model="form"
      label-width="150px"
      class="demo-ruleForm"
      :rules="rules"
    >
      <el-form-item label="" prop="configName">
        <el-input
          v-model.trim="form.configName"
          placeholder="请输入充值方式名称"
          clearable
          :style="{ width: '300px' }"
        />
      </el-form-item>
      <el-form-item label="" prop="configCode">
        <el-input
          v-model.trim="form.configCode"
          :readonly="isEdit"
          placeholder="请输入通道编号"
          clearable
          :style="{ width: '300px' }"
        />
      </el-form-item>
      <el-form-item label="" prop="configCode">
        <el-radio-group v-model="form.original">
          <el-radio :label="1">原生</el-radio>
          <el-radio :label="0">h5</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="">
        <el-upload
          class="first_image"
          action
          :show-file-list="false"
          :multiple="false"
          accept="image/*"
          :http-request="handleUpPayIcon"
        >
          <el-button size="small" style="width: 100px" type="primary"
            >上传支付图标
          </el-button>
          <br />
          <div class="cover_img" v-show="form.payIcon">
            <img :src="form.payIcon" class="cover_avatar" />
          </div>
        </el-upload>
      </el-form-item>
      <!-- <el-form-item label="设置充值金额" prop="">
        <span class="tip">金额设置最少不得低于30元，最高不超过5000元</span>
      </el-form-item> -->
      <div class="amount_box" v-if="!isEdit">
        <el-form-item
          prop="amount"
          class="amount_input"
          v-for="it in 9"
          :key="it"
        >
          <el-input
            v-model.number="form.amount[it - 1]"
            show-word-limit
            clearable
            :style="{ width: '100px' }"
          />
        </el-form-item>
      </div>
      <div class="amount_box" v-else>
        <el-form-item
          prop="amount"
          class="amount_input"
          v-for="it in form.amount"
          :key="it.id"
        >
          <el-input
            v-model.number="it.amount"
            show-word-limit
            clearable
            :style="{ width: '100px' }"
          />
        </el-form-item>
        <el-form-item>
          <i
            class="el-icon-plus add"
            @click="handleAdd"
            v-show="isEdit && form.amount.length < 9"
          ></i>
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  addRechargeConfig,
  uploadImage,
  editRechargeConfig,
  deleteAmount,
} from "@/api/recharge_api";

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
    let checkAmount = (rule, value, callback) => {
      if (value * 1 < 30) {
        callback(new Error("充值最小金额不能低于30"));
      } else if (value * 1 > 5000) {
        callback(new Error("充值最大金额不能超过5000"));
      } else {
        callback();
      }
    };
    return {
      form: {
        configName: "",
        configCode: "",
        amount: [],
        payIcon: "",
        payConfigId: "",
        original: 1,
      },
      isEdit: false,
      tempAmount: [],
      rules: {
        configName: [
          { required: true, message: "请输入充值方式名称", trigger: "blur" },
        ],
        configCode: [
          { required: true, message: "请输入通道编号", trigger: "blur" },
        ],
        amount: [
          { required: true, message: "请输入充值金额", trigger: "blur" },
          // { pattern: /^[1-9]\d*$/, message: "请输入整数金额", trigger: "blur" },
          // { required: true, validator: checkAmount, trigger: "blur" },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    // 编辑可以添加金额
    handleAdd() {
      this.form.amount.push({
        amount: "",
        original: "0",
        payConfigId: "0",
        payIcon: this.form.payIcon,
        configName: this.form.configName,
      });
    },

    handleUpPayIcon(file) {
      let formData = new FormData();
      formData.append("file", file.file);
      uploadImage(formData)
        .then((res) => {
          if (res.code * 1 === 200) {
            this.form.payIcon = res.data;
            this.$forceUpdate();
          }
        })
        .catch(() => {});
    },
    handleSubmit() {
      if (this.form.amount.length <= 0)
        return this.$message.error("请输入充值金额");
      if (this.form.payIcon === "")
        return this.$message.error("请选择上传支付图标");

      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            this.tempAmount = this.form.amount.filter((it) => it.amount === "");
            let ids = this.tempAmount.map((it) => it.id).join(",");
            if (this.tempAmount.length > 0 && ids) await deleteAmount({ ids });
            this.form.amount.forEach((it) => {
              it.original = this.form.original;
              it.payConfigId = this.form.payConfigId;
              it.payIcon = this.form.payIcon;
              it.configName = this.form.configName;
            });
            this.form.amount = this.form.amount.filter(
              (it) => it.amount !== ""
            );
            let amountVoList = [...this.form.amount];
            let result = await editRechargeConfig(amountVoList);
            if (result.code * 1 === 200) {
              this.$parent.getRechargeList();
              this.handleCancel();
            }
          } else {
            delete this.form.payConfigId;
            this.form.amount = this.form.amount.filter(Boolean).join(",");
            addRechargeConfig(this.form)
              .then((res) => {
                if (res.code * 1 === 200) {
                  this.$parent.getRechargeList();
                }
              })
              .finally(() => {
                this.handleCancel();
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCancel() {
      this.form = {
        configName: "",
        configCode: "",
        amount: [],
        payConfigId: "",
        payIcon: "",
        original: 1,
      };
      this.$parent.isShow = false;
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
.demo-ruleForm {
  width: 80%;
  margin: 0 auto;
}
.amount_box {
  // width: 100%;
  margin-left: 150px;
  display: flex;
  flex-shrink: 0;
  flex-flow: row wrap;
  justify-content: space-between;
  >>> .el-form-item__content {
    margin-left: 0 !important;
  }
  .amount_input {
    width: 33.3%;
  }
}
.cover_img {
  margin: 2vh auto 0;
  img {
    width: auto;
    height: 50px;
  }
}
.add {
  font-size: 15px;
  border: 1px solid #b4bccc;
  border-radius: 5px;
  padding: 5px 15px;
  cursor: pointer;
}
</style>
