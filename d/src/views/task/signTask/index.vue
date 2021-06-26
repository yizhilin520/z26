<template>
  <div class="container">
    <main class="main">
      <div class="film_search">
        <h3 class="title">签到抖币领取设置</h3>
        <el-table :data="signList" border style="width: 100%">
          <el-table-column prop="key" align="center" label="名称" />
          <el-table-column prop="value" align="center" label="设定值">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.value"
                class="h-flex"
                :min="0"
                :disabled="id === scope.row.id ? false : true"
                @change="handleChangeSign(scope.row.value)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="
                  handleClickSign(
                    scope.row,
                    id === scope.row.id ? '确认' : '修改'
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
    </main>
    <div />
  </div>
</template>
<script>
import { setDoubiList, setUpdate } from "@/api/task_api";
import helper from "@/utils/helper";
export default {
  name: "SignTask",
  components: {},
  data() {
    return {
      id: "",
      signList: []
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      setDoubiList()
        .then(res => {
          if (Number(res.code) === 200) {
            const { signList } = res.data;
            this.signList = signList;

            this.signList.forEach(item => {
              item.key = `第${item.key}天`;
            });
          }
        })
        .catch(() => {});
    },
    // 检查是否为整数
    checkIntegerFn(val) {
      if (!helper.checkInteger(val)) {
        this.$message.warning("请输入整数");
        return true;
      }
      return false;
    },
    // 修改设定值
    handleEditValue(data, type) {
      setUpdate({ ...data })
        .then(res => {
          if (Number(res.code) === 200) {
            this.id = "";
            this.disabled = true;
            this.disabledCoinbox = true;
            this.disabledCoinboxNums = true;
            this.rangeDisabled = true;
            this.fetchData();
          }
        })
        .catch(err => {
          console.log(err);
          type === "received"
            ? (this.received = !this.received)
            : type === "boxed"
            ? (this.boxed = !this.boxed)
            : (type = "editBoxTimes" ? (this.boxTimes = !this.boxTimes) : "");
        });
    },
    handleChangeSign(val) {
      if (this.checkIntegerFn(val)) return;
    },
    // 签到抖币领取设置

    handleClickSign(row, type) {
      this.id = row.id;
      const params = {
        id: row.id,
        value: row.value
      };
      if (type === "确认") {
        this.handleEditValue(params);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";

.main {
  padding: 30px 50px !important;
}
.film_search {
  padding: 5px 0 60px 20px !important;
}
>>> .el-table,
.h-edit {
  font-size: 15px !important;
}
>>> .el-table--small th,
>>> td {
  padding: 15px 0 !important;
}
.h-edit {
  width: 51px;
  height: 24px;
  line-height: 24px;
  color: #fff;
  display: inline-block;
  background: #0e669a;
  border-radius: 4.32px;
}
</style>
