<template>
  <el-dialog
    custom-class="my-dialog"
    center
    title="添加VIP权益"
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
        <el-form-item label="权益名称" prop="name">
          <el-input v-model="form.name" clearable />
        </el-form-item>
        <el-form-item label="权益图标">
          <el-upload
            ref="upload"
            :show-file-list="false"
            action
            :http-request="uploadImg"
            :before-upload="beforeUpload"
            :multiple="false"
            accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
          >
            <el-button size="small" type="primary">添加图片</el-button>
            <br />
            <img v-if="form.icon" :src="form.icon" class="avatar" />
          </el-upload>
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
import { vipRightAdd, uploadImage } from "@/api/member_api";
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: "权益名称不能为空", trigger: "blur" }]
      },
      fileList: [],
      form: {
        name: "",
        icon: "",
        vipLevel: ""
      },
      data: {
        did: "",
        title: ""
      }
    };
  },
  mounted() {},
  methods: {
    beforeUpload(file) {
      // const isLt1M = file.size / 1024 / 1024 < 1;
      // if (isLt1M) {
      //   return true;
      // }
      // this.$message({
      //   message: "请不要上传大于1m的文件.",
      //   type: "warning"
      // });
      // return false;
    },
    async uploadImg(req) {
      let formdata = new FormData();
      formdata.append("file", req.file);
      let res = await uploadImage(formdata);
      if (res.code * 1 === 200 && res.data !== null) {
        this.form.icon = res.data;
      }
    },
    handleSubmit() {
      if (this.form.icon === "") return false;
      this.$refs["form"].validate(valid => {
        if (valid) {
          let params = Object.assign({ ...this.data }, { ...this.form });
          vipRightAdd({ ...params })
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
      this.$parent.isEdit = false;
      this.form = {
        notes: "",
        icon: ""
      };
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
.avatar {
  width: 130px;
  height: 100px;
  object-fit: cover;
}
</style>
