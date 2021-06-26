<template>
  <div class="container">
    <main class="main">
      <div class="film_content">
        <div class="film_top">
          <h3>头像列表</h3>
          <el-upload
            :show-file-list="false"
            class="upload-demo"
            :http-request="uploadsubmitAdd"
            action
            accept=".jpg,jpeg,.png,.gif,.JPG,.JPEG,.PNG"
            :disabled="isEdit"
          >
            <el-button size="small" type="primary" @click="handleClick"
              >上传头像</el-button
            >
          </el-upload>
        </div>
        <!-- 列表 -->
        <el-table
          ref="multipleTable"
          :data="accountList"
          :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
          size="small"
          max-height="700"
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
          <el-table-column align="center" label="头像">
            <template slot-scope="scope">
              <el-avatar :size="60" :src="scope.row.headImage" />
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
        <pagination
          :pages="pages"
          :fetchData="getFetchData"
          :handleScroll="handleScroll"
        />
      </div>
    </main>
    <div />
  </div>
</template>
<script>
import {
  avatarList,
  delHeadImage,
  addHeadImage,
  uploadImage,
} from "@/api/otherSetting_api";
import pagination from "@/components/paginations";
export default {
  name: "Avatar",
  components: { pagination },
  data() {
    return {
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      loading: false,
      accountList: [],
      isEdit: false,
    };
  },
  mounted() {
    this.getFetchData();
  },
  methods: {
    //获取列表
    getFetchData() {
      let { pageNum, pageSize } = this.pages;
      avatarList({ pageNum, pageSize })
        .then((res) => {
          if (Number(res.code) === 200) {
            let { total, pageNum, pageSize, list } = res.data;
            this.pages = {
              pageNum,
              pageSize,
              total: total * 1,
            };
            this.accountList = list;
            this.isEdit = total * 1 >= 30 ? true : false;
          }
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
      const res = await uploadImage(formdata);
      if (res.code * 1 === 200 && res.data !== null) {
        addHeadImage({ headImage: res.data })
          .then((res) => {
            this.getFetchData();
          })
          .catch(() => {});
      } else {
        this.$$message.error("上传失败");
      }
    },
    handleClick() {
      if (this.isEdit) {
        this.$message.error("系统头像数不能超过30个");
        return;
      }
    },
    // 删除公告
    handleDelete(item) {
      this.$confirm("确认要删除该头像吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          delHeadImage({ id: item.id })
            .then((res) => {
              if (res.code * 1 === 200) {
                if (this.accountList.length === 1 && this.pages.pageNum > 1)
                  this.pages.pageNum -= 1;
                this.getFetchData();
              }
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    handleScroll() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";
>>> .el-avatar > img {
  width: 100%;
}
</style>
