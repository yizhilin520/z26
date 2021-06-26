<template>
  <el-dialog
    custom-class="my-dialog"
    center
    :title="uInfo.title"
    width="30%"
    :visible.sync="show"
    :before-close="handleCancel"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :append-to-body="true"
  >
    <div class="container">
      <template v-if="uInfo.type === 'headImage'">
        <el-upload
          class="first_image"
          ref="upload"
          action
          :auto-upload="false"
          :show-file-list="false"
          :multiple="false"
          accept="image/*"
          :http-request="handleUpPayIcon"
        >
          <el-button size="small" style="width: 100px" type="primary"
            >上传头像
          </el-button>
          <br />
          <div class="cover_img" v-show="headImage">
            <img :src="headImage" class="cover_avatar" />
          </div>
        </el-upload>
      </template>

      <template v-else-if="uInfo.type === 'nickname'">
        <el-input
          v-model="userParams.nickname"
          show-word-limit
          placeholder="请输入昵称"
          clearable
          :style="{ width: '300px' }"
        />
      </template>

      <template v-else-if="uInfo.type === 'sex'">
        <el-select v-model="userParams.sex" clearable>
          <el-option
            v-for="item in sexOptions"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </template>

      <template v-else-if="uInfo.type === 'birthday'">
        <el-date-picker
          v-model="userParams.birthday"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        >
        </el-date-picker>
      </template>

      <div class="pwd_box" v-else>
        <el-input
          v-model="userMsg.password"
          readonly
          :style="{ width: '300px' }"
        />
        <br />
        <div class="tip">注：重置为初始密码</div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { uploadImage, changePassword, updateUserInfo } from "@/api/user_api";
import md5 from "js-md5";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    uInfo: {
      type: Object,
      default: {
        title: {
          type: String,
          default: "",
        },
        userText: {
          type: String,
          default: "",
        },
        type: {
          type: String,
          default: "",
        },
      },
    },
  },
  data() {
    return {
      form: {},
      isEdit: false,
      sexOptions: [
        { key: 0, value: "男" },
        { key: 1, value: "女" },
        { key: 2, value: "保密" },
      ],
      headImage: "",
      userParams: {
        id: "",
        sex: "",
        birthday: "",
        nickname: "",
      },
    };
  },
  computed: {
    userMsg() {
      return {
        account: this.$parent.userInfo.account,
        password: "dd12345678",
      };
    },
  },
  mounted() {},
  methods: {
    handleUpPayIcon(file) {
      let formData = new FormData();
      formData.append("file", file.file);
      formData.append("id", this.$parent.userInfo.id);
      uploadImage(formData)
        .then((res) => {
          if (res.code * 1 === 200) {
            this.headImage = res.data;
            this.$bus.$emit("updateImage", true);
          }
        })
        .catch(() => {})
        .finally(() => {
          this.handleCancel();
        });
    },
    //更新用户信息
    handleUpdateUserInfo() {
      updateUserInfo(this.userParams)
        .then((res) => {
          if (res.code * 1 === 200) {
            this.$bus.$emit("updateUserInfo", true);
          }
        })
        .catch(() => {})
        .finally(() => {
          this.handleCancel();
        });
    },
    handleSubmit() {
      let { type } = this.uInfo;
      switch (type) {
        case "headImage":
          this.$refs["upload"].submit();
          break;
        case "nickname":
          this.handleUpdateUserInfo();
          break;
        case "sex":
          this.handleUpdateUserInfo();
          break;
        case "birthday":
          this.handleUpdateUserInfo();
          break;
        case "password":
          this.userMsg.password = md5(this.userMsg.password);
          changePassword(this.userMsg)
            .then((res) => {
              if (res.code * 1 === 200) {
              }
            })
            .finally(() => {
              this.handleCancel();
            });
          break;
        default:
          break;
      }
    },
    handleCancel() {
      this.$parent.isInfo = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-content: center;
}
.cover_img {
  margin: 2vh auto 0;
  width: 60px;
  height: 60px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.tip {
  margin-top: 2%;
  color: #666;
  font-size: 12px;
}
</style>
