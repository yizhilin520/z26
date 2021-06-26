<template>
  <div class="container">
    <main class="main">
      <div class="film_search">
        <h3>昵称词汇设置</h3>
        <el-form
          ref="ruleForm"
          class="searchForm"
          :model="ruleForm"
          :inline="true"
          status-icon
          label-width="100px"
          size="small"
        >
          <el-form-item label="新官方昵称">
            <el-input
              v-model="ruleForm.name"
              clearable
              placeholder="请输入新官方昵称"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="onSubmit"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <div class="film_content">
        <div class="film_top">
          <h3>已有昵称词汇</h3>
        </div>
        <!-- 列表 -->
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="accountList"
          :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
          size="small"
          max-height="540"
          show-overflow-tooltip
          element-loading-text="Loading"
          border
          tooltip-effect="dark"
          fit
          stripe
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          highlight-current-row
        >
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="80px"
          />
          <el-table-column align="center" prop="nickname" label="昵称词汇" />
          <el-table-column align="center" label="头像设置">
            <template slot-scope="scope">
              <el-upload
                :show-file-list="false"
                class="upload-demo"
                :http-request="uploadsubmitAdd"
                action
                accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
              >
                <div
                  v-if="scope.row.headImage !== ''"
                  @click="clickIdAndName(scope.row)"
                >
                  <el-avatar :size="60" :src="scope.row.headImage" />
                </div>
                <el-button
                  v-else
                  size="small"
                  type="primary"
                  @click="clickIdAndName(scope.row)"
                  >点击上传</el-button
                >
              </el-upload>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            prop="created_at"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </main>
    <div />
  </div>
</template>
<script>
import { getList, adevImg, add, deles, update } from "@/api/otherSetting_api";
export default {
  name: "Account",
  components: {},
  data() {
    return {
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      loading: false,
      ruleForm: {
        name: ""
      },
      id: "",
      name: "",
      accountList: [],
      isEdit: false
    };
  },
  mounted() {
    this.getFetchData();
  },
  methods: {
    //获取列表
    getFetchData() {
      getList()
        .then(res => {
          if (Number(res.code) === 200) {
            this.accountList = res.data;
          }
        })
        .catch(() => {});
    },
    //提交
    onSubmit() {
      if (this.ruleForm.name === "") {
        this.$message.error("请输入新官方昵称");
        return false;
      }
      add({ nickname: this.ruleForm.name })
        .then(res => {
          this.getFetchData();
          this.ruleForm.name = "";
        })
        .catch(() => {});
    },
    // 上传
    async uploadsubmitAdd(req) {
      const j = "image/jpeg";
      const p = "image/png";
      const g = "image/gif";
      const t = req.file.type;
      if (t !== j && t !== p && t !== g) {
        this.$message.error("上传头像图片只能是 JPG/png/gif 格式!");
        return false;
      }
      const formdata = new FormData();
      formdata.append("file", req.file);
      const res = await adevImg(formdata);
      if (res.code * 1 === 200 && res.data !== null) {
        update({ nickname: this.name, id: this.id, headImage: res.data })
          .then(res => {
            if (res.code * 1 === 200) this.getFetchData();
          })
          .catch(() => {});
      } else {
        this.$message.error("上传失败");
      }
    },
    clickIdAndName(row) {
      this.id = "";
      this.name = "";
      this.id = row.id;
      this.name = row.name;
    },
    // 编辑、添加
    handleEdit(bool, item) {
      this.isEdit = true;
    },
    // 删除公告
    handleDelete(item) {
      this.$confirm("确认要删除该昵称吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          deles({ id: item.id })
            .then(res => {
              this.getFetchData();
            })
            .catch(() => {});
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";
>>> .el-avatar > img {
  width: 100%;
}
</style>
