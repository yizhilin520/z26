<template>
  <div class="container">
    <main class="main">
      <div class="film_search">
        <div class="film_top">
          <h3>普通用户邀请奖励</h3>
          <div class="bar_right"></div>
        </div>
        <!-- 列表 -->
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
          size="small"
          :data="list"
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
          <el-table-column label="邀请人数" prop="friendCount" align="center" />
          <el-table-column
            label="体验会员（天）"
            prop="vipDay"
            align="center"
          />
          <el-table-column align="center" label="赠送抖币" prop="goldAmount" />
          <el-table-column
            label="修改时间"
            min-width="100"
            prop="updateTime"
            align="center"
          />
          <el-table-column align="center" label="操作人" prop="account" />
          <el-table-column
            align="center"
            min-width="100"
            label="操作"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                class="btn_change_handle"
                size="mini"
                type="primary"
                @click="handleModal(scope.row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 50px">
          <h3>VIP用户邀请奖励</h3>
          <div class="subtitle">每成功邀请1人</div>
          <el-table
            border
            style="width: 100%"
            v-loading="loading"
            :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
            size="small"
            :data="vipList"
            max-height="540"
            show-overflow-tooltip
            element-loading-text="Loading"
            tooltip-effect="dark"
            fit
            stripe
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            highlight-current-row
          >
            <el-table-column prop="vipDay" align="center" label="增加VIP天数">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.vipDay"
                  class="h-flex"
                  :min="0"
                  :disabled="id !== scope.row.id"
                  @change="handleChangeGold(scope.row.vipDay)"
                />
              </template>
            </el-table-column>
            <el-table-column align="center" label="获得抖币数">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.goldAmount"
                  class="h-flex"
                  :min="0"
                  :disabled="id !== scope.row.id"
                  @change="handleChangeGold(scope.row.goldAmount)"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  @click="
                    handleClickGold(
                      scope.row,
                      id === scope.row.id ? 'sure' : 'edit'
                    )
                  "
                >
                  <span class="h-edit">{{
                    id === scope.row.id ? "确认" : "修改"
                  }}</span>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </main>
    <div />
    <invitation-reward :show="isAdd" :title="title" ref="invit" />
  </div>
</template>
<script>
import { taskList, deleteTask, drawSetUpdate, editTask } from "@/api/task_api";
import invitationReward from "./modal/invitationReward";
export default {
  name: "InviteTask",
  components: {
    invitationReward,
  },
  data() {
    return {
      loading: false,
      isAdd: false,
      title: "",
      list: [],
      vipList: [],
      id: "",
    };
  },
  mounted() {
    Promise.all[(this.fetchTaskList(), this.fetchTaskVipList())];
  },
  methods: {
    // 普通用户邀请奖励列表
    fetchTaskList() {
      let userType = "0";
      taskList({ userType })
        .then((res) => {
          if (res.code * 1 === 200) {
            this.list = res.data;
          }
        })
        .catch((e) => console.error(e));
    },
    // VIP用户邀请奖励
    fetchTaskVipList() {
      let userType = "1";
      taskList({ userType })
        .then((res) => {
          if (res.code * 1 === 200) {
            this.vipList = res.data;
          }
        })
        .catch((e) => console.error(e));
    },

    //新增、编辑
    handleModal(row) {
      this.isAdd = true;
      this.title = "编辑邀请奖励";
      let {
        id,
        friendCount,
        vipDay,
        goldAmount,
      } = row;
      this.$refs.invit.form = {
        id,
        friendCount,
        vipDay,
        goldAmount,
        userType: "0",
      };
    },
    //删除
    handleDelTask(row) {
      let content =
        "确定删除该邀请奖励吗？删除后用户邀请对应的人数将无法获得相应的奖励";
      this.$confirm(content, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          deleteTask({ id: row.id })
            .then((res) => {
              if (res.code * 1 === 200) {
                this.fetchTaskList();
              }
            })
            .catch((e) => console.error(e));
        })
        .catch(() => {});
    },
    handleChangeGold(val) {
      if (!Number.isInteger(val)) this.$message.warning("请输入整数");
    },
    //修改
    handleClickGold(row, type) {
      this.id = row.id;
      type === "sure" &&
        editTask({
          id: row.id,
          userType: "1",
          goldAmount: row.goldAmount,
          vipDay: row.vipDay,
        })
          .then((res) => {
            if (res.code * 1 === 200) {
              this.id = "";
              this.fetchTaskList();
            }
          })
          .catch((e) => console.error(e));
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";

.subtitle {
  line-height: 3;
  font-size: 16px;
  background: #f2f2f2;
  text-align: center;
  color: #333333;
  font-weight: 600;
}
.main {
  padding: 30px 50px !important;
}
.film_search {
  padding: 15px 40px 60px !important;
}
>>> .el-table--small th,
>>> td {
  font-size: 15px !important;
}
</style>
