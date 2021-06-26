<template>
  <div class="container">
    <main class="main">
      <div class="film_content">
        <div class="film_top">
          <h3></h3>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            plain
            @click="handleEdit(false)"
            >添加充值配置</el-button
          >
        </div>
        <!-- 列表 -->
        <el-table
          ref="multipleTable"
          :data="list"
          :header-cell-style="{ background: 'rgba(6, 209, 204,.7)' }"
          size="small"
          show-overflow-tooltip
          element-loading-text="Loading"
          border
          min-height="570"
          tooltip-effect="dark"
          fit
          stripe
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          highlight-current-row
        >
          <el-table-column label="充值方式" align="center" prop="configName" />
          <el-table-column label="支付图标" align="center" prop="payIcon">
            <template slot-scope="scope">
              <el-image
                v-show="scope.row.payIcon"
                class="pay_cion"
                :src="scope.row.payIcon"
                fit="contain"
                :preview-src-list="[scope.row.payIcon]"
              >
                <div slot="placeholder" class="tb_image_pl">
                  加载中<span class="dot">...</span>
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="通道编号" align="center" prop="configCode" />
          <el-table-column label="金额" align="center">
            <template slot-scope="scope">
              <div class="amout_content">
                <div
                  class="amout_item"
                  v-for="it in scope.row.list"
                  :key="it.id"
                >
                  {{ it.amount }}元
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            align="center"
            :formatter="formatterStatus"
          />
          <el-table-column label="操作" align="center" min-width="120">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="handleEdit(true, scope.row)"
                >编辑</el-button
              >
              <el-button size="small" @click="handleOpenStatus(scope.row)">{{
                scope.row.configStatus === 1 ? "停用" : "启用"
              }}</el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleDelete(scope.row.payConfigId)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </main>
    <add-amount :title="title" :show="isShow" ref="amount" />
  </div>
</template>

<script>
import AddAmount from "./components/addAmount";
import {
  getRechargeList,
  updateStatus,
  deleteConfig,
} from "@/api/recharge_api";

export default {
  name: "Amount",
  components: {
    AddAmount,
  },
  data() {
    return {
      list: [],
      isShow: false,
      isType: false,
      title: "添加配置",
      statusObj: {
        0: "停用",
        1: "启用",
      },
    };
  },
  mounted() {
    this.getRechargeList();
  },
  methods: {
    formatterStatus(row) {
      return this.statusObj[row.configStatus];
    },
    // 获取列表
    getRechargeList() {
      getRechargeList()
        .then((res) => {
          if (res.code * 1 === 200) {
            this.list = res.data;
          }
        })
        .catch(() => {});
    },
    // 编辑与添加
    handleEdit(bool, row) {
      this.isShow = true;
      this.isType = bool;
      this.title = this.isType ? "编辑配置" : "添加配置";
      this.$refs["amount"].isEdit = bool;
      if (bool) {
        let { payConfigId, configName, configCode, payIcon, original, list } =
          row;
        let amountList = JSON.parse(JSON.stringify(list)); // 深度clone
        this.$refs["amount"].form = {
          payConfigId,
          configName,
          configCode,
          amount: amountList,
          payIcon,
          original,
        };
      } else {
        this.$refs["amount"].form = {
          payConfigId: "",
          configName: "",
          configCode: "",
          amount: [],
          payIcon: "",
          original: 1,
        };
      }
    },

    // 启用、停用
    handleOpenStatus(row) {
      this.$confirm(
        `确定${row.configStatus === 1 ? "停用" : "启用"}吗？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true,
        }
      )
        .then(() => {
          this.handleOpenOrStop(row);
        })
        .catch(() => {});
    },
    handleOpenOrStop(row) {
      let params = {
        configStatus: row.configStatus === 1 ? 0 : 1,
        id: row.payConfigId,
      };
      updateStatus(params)
        .then((res) => {
          if (res.code * 1 === 200) {
            this.getRechargeList();
          }
        })
        .catch(() => {});
    },
    // 删除
    handleDelete(id) {
      this.$confirm("确认删除该金额吗？删除后前端将不显示", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          deleteConfig({ id })
            .then((res) => {
              if (res.code * 1 === 200) {
                this.getRechargeList();
              }
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.film_content {
  padding: 5vh 20vw 10vh 10vw !important;
}
.film_top {
  margin-bottom: 2vh !important;
}
.tip {
  display: block;
  color: #aaaaaa;
}
.amout_content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pay_cion {
  width: 50px;
  height: 50px;
}
@import "@/assets/styles/style.scss";
</style>