<template>
  <el-dialog
    custom-class="version_dialog my-dialog"
    center
    :title="title"
    width="50%"
    :visible.sync="show"
    :before-close="handleCancel"
    :lock-scroll="false"
    :append-to-body="true"
  >
    <div class="form_box">
      <el-form
        ref="el_form"
        :model="form"
        label-width="150px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item label="版本号" prop="versionCode">
          <el-input
            :disabled="bool ? true : false"
            v-model.number="form.versionCode"
            placeholder="请输入版本号"
            onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )"
            clearable
            type="number"
            :style="{ width: '300px' }"
          />
        </el-form-item>
        <el-form-item label="版本名称">
          <el-input
            v-model="form.versionName"
            placeholder="请输入版本名称"
            clearable
            :style="{ width: '300px' }"
          />
        </el-form-item>
        <el-form-item label="更新类型">
          <el-select
            v-model="form.isUpdate"
            :style="{ width: '300px' }"
            placeholder="请选择更新类型"
          >
            <el-option
              v-for="item in updateTypeList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-radio-group v-model="form.originType">
            <el-radio label="1">安卓包地址</el-radio>
            <el-radio label="0">iOS包地址</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- <el-form-item label="选择发布终端">
          <el-select
            v-model="form.originType"
            :style="{ width: '300px' }"
            placeholder="请选择"
          >
            <el-option
              v-for="item in plantformList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item> -->

        <template v-if="form.originType === '1'">
          <el-form-item label="生产包下载地址">
            <el-input
              v-model="azChannel.prod"
              placeholder="请输入生产包地址"
              clearable
              type="textarea"
              :rows="5"
              :style="{ width: '300px' }"
            />
          </el-form-item>
          <el-form-item label="渠道下载地址一">
            <el-input
              v-model="azChannel.channelUrl1"
              placeholder="请输入渠道一地址"
              clearable
              :style="{ width: '300px' }"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="渠道下载地址二">
            <el-input
              v-model="azChannel.channelUrl2"
              placeholder="请输入渠道二地址"
              clearable
              :style="{ width: '300px' }"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="渠道下载地址三">
            <el-input
              v-model="azChannel.channelUrl3"
              placeholder="请输入渠道三地址"
              clearable
              :style="{ width: '300px' }"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="渠道下载地址四">
            <el-input
              v-model="azChannel.channelUrl4"
              placeholder="请输入渠道四地址"
              clearable
              :style="{ width: '300px' }"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="渠道下载地址五">
            <el-input
              v-model="azChannel.channelUrl5"
              placeholder="请输入渠道五地址"
              clearable
              :style="{ width: '300px' }"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="渠道下载地址六">
            <el-input
              v-model="azChannel.channelUrl6"
              placeholder="请输入渠道六地址"
              clearable
              :style="{ width: '300px' }"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="渠道下载地址七">
            <el-input
              v-model="azChannel.channelUrl7"
              placeholder="请输入渠道七地址"
              clearable
              :style="{ width: '300px' }"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="渠道下载地址八">
            <el-input
              v-model="azChannel.channelUrl8"
              placeholder="请输入渠道八地址"
              clearable
              :style="{ width: '300px' }"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="渠道下载地址九">
            <el-input
              v-model="azChannel.channelUrl9"
              placeholder="请输入渠道九地址"
              clearable
              :style="{ width: '300px' }"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="渠道下载地址十">
            <el-input
              v-model="azChannel.channelUrl10"
              placeholder="请输入渠道十地址"
              clearable
              :style="{ width: '300px' }"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
        </template>

        <template v-else>
          <el-form-item label="生产包下载地址">
            <el-input
              v-model="iosChannel.prod"
              placeholder="请输入生产包地址"
              clearable
              :style="{ width: '300px' }"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="渠道下载地址一">
            <el-input
              v-model="iosChannel.channelUrl1"
              placeholder="请输入渠道一地址"
              clearable
              :style="{ width: '300px' }"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="渠道下载地址二">
            <el-input
              v-model="iosChannel.channelUrl2"
              placeholder="请输入渠道二地址"
              clearable
              :style="{ width: '300px' }"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="渠道下载地址三">
            <el-input
              v-model="iosChannel.channelUrl3"
              placeholder="请输入渠道三地址"
              clearable
              :style="{ width: '300px' }"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="渠道下载地址四">
            <el-input
              v-model="iosChannel.channelUrl4"
              placeholder="请输入渠道四地址"
              clearable
              :style="{ width: '300px' }"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="渠道下载地址五">
            <el-input
              v-model="iosChannel.channelUrl5"
              placeholder="请输入渠道五地址"
              clearable
              :style="{ width: '300px' }"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="渠道下载地址六">
            <el-input
              v-model="iosChannel.channelUrl6"
              placeholder="请输入渠道六地址"
              clearable
              :style="{ width: '300px' }"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="渠道下载地址七">
            <el-input
              v-model="iosChannel.channelUrl7"
              placeholder="请输入渠道七地址"
              clearable
              :style="{ width: '300px' }"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="渠道下载地址八">
            <el-input
              v-model="iosChannel.channelUrl8"
              placeholder="请输入渠道八地址"
              clearable
              :style="{ width: '300px' }"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="渠道下载地址九">
            <el-input
              v-model="iosChannel.channelUrl9"
              placeholder="请输入渠道九地址"
              clearable
              :style="{ width: '300px' }"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="渠道下载地址十">
            <el-input
              v-model="iosChannel.channelUrl10"
              placeholder="请输入渠道十地址"
              clearable
              type="textarea"
              :rows="5"
              :style="{ width: '300px' }"
            />
          </el-form-item>
        </template>

        <el-form-item label="更新说明">
          <el-input
            v-model="form.versionExplain"
            placeholder="请输入更新说明"
            clearable
            type="textarea"
            :rows="3"
            :style="{ width: '300px' }"
          />
        </el-form-item>
        <el-form-item label="更新公告标题" prop="versionTitle">
          <el-input
            v-model="form.versionTitle"
            placeholder="请输入更新公告标题"
            clearable
            type="textarea"
            :rows="3"
            :style="{ width: '300px' }"
          />
        </el-form-item>
        <el-form-item label="更新公告内容" prop="versionContent">
          <el-input
            v-model="form.versionContent"
            placeholder="请输入更新公告内容"
            clearable
            :rows="5"
            type="textarea"
            :style="{ width: '300px' }"
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
import { addChannel, updateChannel } from "@/api/version_api";
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    bool: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    title() {
      return this.bool ? "编辑版本" : "添加版本";
    }
  },
  data() {
    return {
      azChannel: {
        prod: "",
        channelUrl1: "",
        channelUrl2: "",
        channelUrl3: "",
        channelUrl4: "",
        channelUrl5: "",
        channelUrl6: "",
        channelUrl7: "",
        channelUrl8: "",
        channelUrl9: "",
        channelUrl10: ""
      },
      iosChannel: {
        prod: "",
        channelUrl1: "",
        channelUrl2: "",
        channelUrl3: "",
        channelUrl4: "",
        channelUrl5: "",
        channelUrl6: "",
        channelUrl7: "",
        channelUrl8: "",
        channelUrl9: "",
        channelUrl10: ""
      },
      form: {
        versionCode: null,
        isUpdate: false,
        originType: "1",
        versionExplain: "",
        versionTitle: "",
        versionContent: "",
        versionName: ""
      },
      updateTypeList: [
        { key: false, value: "普通更新" },
        { key: true, value: "强制更新" }
      ],
      plantformList: [
        { key: "1", value: "安卓包地址" },
        { key: "0", value: "iOS包地址" }
      ],
      rules: {
        versionCode: [
          {
            required: true,
            message: "版本号不能为空",
            tigger: "blur",
            type: "number"
          }
        ],
        versionTitle: [
          { required: true, message: "公告标题不能为空", tigger: "blur" }
        ],
        versionContent: [
          { required: true, message: "公告内容不能为空", tigger: "blur" }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    // 校验地址
    checkChannelUrl() {
      let azChannel = this.azChannel;
      let iosChannel = this.iosChannel;
      if (
        azChannel.prod === "" &&
        azChannel.channelUrl1 === "" &&
        azChannel.channelUrl2 === "" &&
        azChannel.channelUrl3 === "" &&
        azChannel.channelUrl4 === "" &&
        azChannel.channelUrl5 === "" &&
        azChannel.channelUrl6 === "" &&
        azChannel.channelUrl7 === "" &&
        azChannel.channelUrl8 === "" &&
        azChannel.channelUrl1 === "" &&
        azChannel.channelUrl1 === "" &&
        azChannel.channelUrl1 === "" &&
        azChannel.channelUrl9 === "" &&
        azChannel.channelUrl10 === "" &&
        iosChannel.prod === "" &&
        iosChannel.channelUrl1 === "" &&
        iosChannel.channelUrl2 === "" &&
        iosChannel.channelUrl3 === "" &&
        iosChannel.channelUrl4 === "" &&
        iosChannel.channelUrl5 === "" &&
        iosChannel.channelUrl6 === "" &&
        iosChannel.channelUrl7 === "" &&
        iosChannel.channelUrl8 === "" &&
        iosChannel.channelUrl1 === "" &&
        iosChannel.channelUrl1 === "" &&
        iosChannel.channelUrl1 === "" &&
        iosChannel.channelUrl9 === "" &&
        iosChannel.channelUrl10 === ""
      ) {
        this.$message.error("至少一个地址才可进行新版本的添加");
        return true;
      }
      return false;
    },
    // 确定
    handleSubmit() {
      this.$refs["el_form"].validate(valid => {
        if (valid) {
          if (this.checkChannelUrl()) return;
          if (this.bool) {
            this.handleEdit();
          } else {
            this.handleAddChannel();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 添加
    handleAddChannel() {
      let appUrl =
        this.form.originType == "1"
          ? Object.values(this.azChannel)
          : Object.values(this.iosChannel);
      let arr = [];
      appUrl.forEach((item, index) => {
        if (item !== "") arr.push(index + "-" + item);
      });
      let {
        versionCode,
        isUpdate,
        originType,
        versionExplain,
        versionTitle,
        versionContent,
        versionName
      } = this.form;
      let params = {
        versionCode,
        isUpdate,
        originType,
        versionExplain,
        versionTitle,
        versionContent,
        versionName,
        appUrl: arr.join(",")
      };
      addChannel({ ...params })
        .then(res => {
          if (Number(res.code) === 200) {
            this.$parent.isUpdate = false;
            this.$parent.fetchDataList();
            this.$refs["el_form"] ? this.$refs["el_form"].resetFields() : "";
          }
        })
        .catch(() => {
          this.$parent.isUpdate = false;
          this.$refs["el_form"] ? this.$refs["el_form"].resetFields() : "";
        });
    },
    // 编辑
    handleEdit() {
      let appUrl =
        this.form.originType == "1"
          ? Object.values(this.azChannel)
          : Object.values(this.iosChannel);
      let arr = [];
      appUrl.forEach((item, index) => {
        if (item !== "") arr.push(index + "-" + item);
      });
      let {
        versionCode,
        isUpdate,
        originType,
        versionExplain,
        versionTitle,
        versionContent,
        versionName
      } = this.form;
      let params = {
        versionCode,
        isUpdate,
        originType,
        versionExplain,
        versionTitle,
        versionContent,
        versionName,
        appUrl: arr.join(",")
      };
      updateChannel({ ...params })
        .then(res => {
          if (Number(res.code) === 200) {
            this.$parent.isUpdate = false;
            this.$parent.fetchDataList();
            this.$refs["el_form"] ? this.$refs["el_form"].resetFields() : "";
          }
        })
        .catch(() => {
          this.$parent.isUpdate = false;
          this.$refs["el_form"] ? this.$refs["el_form"].resetFields() : "";
        });
    },
    //取消弹窗
    handleCancel() {
      this.$parent.isUpdate = false;
      this.$nextTick(() => {
        this.$refs["el_form"] ? this.$refs["el_form"].resetFields() : "";
        this.form.originType = "1";
      });
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
<style lang="scss">
.version_dialog {
  .el-dialog__body {
    overflow-y: scroll !important;
    height: 70vh;
  }
  .el-dialog__header {
    background-color: #f2f2f2 !important;
    font-weight: bold !important;
  }
  .el-dialog__footer {
    border-top: 1px solid #e4e4e4;
  }
}
</style>
