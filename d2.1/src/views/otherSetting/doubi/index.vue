<template>
  <div class="container">
    <main class="main">
      <div class="film_search">
        <div style="margin-top: 50px">
          <div class="subtitle">倒计时器抖币领取设置</div>
          <el-row :gutter="30">
            <el-col :span="24">
              <div class="h-table">
                <div class="h-head h-title">
                  <div class="h-name">名称</div>
                  <div class="h-flex">设定值</div>
                  <div class="h-btn">操作</div>
                </div>

                <div class="h-head">
                  <p class="h-name">{{ name1 }}</p>
                  <div class="h-flex">
                    <el-input-number
                      v-model="duration"
                      :min="60"
                      :max="120"
                      :disabled="disabled"
                      @change="changeDuration"
                    />
                  </div>
                  <p class="h-btn">
                    <el-button
                      type="text"
                      size="small"
                      @click="handleClickDuration(!disabled ? '修改' : '确认')"
                    >
                      <span class="h-edit">{{
                        disabled ? "修改" : "确认"
                      }}</span>
                    </el-button>
                  </p>
                </div>

                <div class="h-head">
                  <p class="h-name">{{ name2 }}</p>
                  <p class="h-flex h-num">
                    <el-input
                      v-model="rangeStart"
                      class="h-input left"
                      :disabled="rangeDisabled"
                      @change="changeRangeStart"
                    />至
                    <el-input
                      v-model="rangeEnd"
                      class="h-input right"
                      :disabled="rangeDisabled"
                      @change="changeRangeEnd"
                    />
                  </p>
                  <div class="h-btn">
                    <el-button
                      type="text"
                      size="small"
                      @click="
                        handleClickRange(!rangeDisabled ? '修改' : '确认')
                      "
                    >
                      <span class="h-edit">{{
                        rangeDisabled ? "修改" : "确认"
                      }}</span>
                    </el-button>
                    <div>
                      <el-switch
                        v-model="received"
                        @change="handleOpenReceived"
                      ></el-switch>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </main>
    <div />
  </div>
</template>
<script>
import { setDoubiList, setUpdate } from "@/api/task_api";
import helper from "@/utils/helper";
export default {
  name: "Doubi",
  components: {},
  data() {
    return {
      loading: false,
      isAdd: false,
      homeList: [],
      id: "",
      duration: "", //抖币领取时长（秒）
      durationId: "",
      rangeStart: "",
      rangeEnd: "",
      rangeId: "",
      rangeDisabled: true,
      disabled: true,
      received: false,
      name1: "",
      name2: "",
    };
  },
  mounted() {
    this.getDoubiList();
  },
  methods: {
    getDoubiList() {
      setDoubiList()
        .then((res) => {
          if (res.code * 200) {
            let { homeList } = res.data;
            this.homeList = homeList;
            this.homeList.forEach((item) => {
              if (item.codeKey === "RAND_REWARD_DURATION") {
                this.durationId = item.id;
                this.duration = item.value;
                this.name1 = item.name;
              }
              if (item.codeKey === "RAND_REWARD_RANGE") {
                let arr = [];
                let rangeNums = "";
                rangeNums = item.value;
                arr = rangeNums.split("-");
                this.rangeStart = arr[0];
                this.rangeEnd = arr[1];
                this.rangeId = item.id;
                this.received = item.status;
                this.name2 = item.name;
              }
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
        .then((res) => {
          if (Number(res.code) === 200) {
            this.id = "";
            this.disabled = true;
            this.rangeDisabled = true;
            this.getDoubiList();
          } else {
            if (type === "received") this.received = !this.received;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleChangeSign(val) {
      if (!Number.isInteger(val)) return;
    },
    // 抖币领取时长（秒）
    changeDuration(currentValue) {
      if (this.checkIntegerFn(currentValue)) return;
      this.duration = currentValue;
    },
    handleClickDuration(type) {
      this.disabled = false;
      const params = {
        id: this.durationId,
        value: this.duration,
      };
      if (type === "修改") {
        this.handleEditValue(params);
      }
    },
    // 抖币领取数量（个）
    changeRangeStart(val) {
      if (this.checkIntegerFn(val)) return;
      if (val < 20) {
        this.rangeStart = 20;
        return this.$message.warning("抖币领取数量最小值为20");
      }
      this.rangeStart = val;
    },
    changeRangeEnd(val) {
      if (this.checkIntegerFn(val)) return;
      if (Number(val) > 150) {
        this.rangeEnd = 150;
        return this.$message.warning("抖币领取数量最大值为150");
      }
      if (Number(val) < Number(this.rangeStart)) {
        this.rangeEnd = 150;
        return this.$message.warning("抖币领取数量最大值要大于最小值");
      }
      this.rangeEnd = val;
    },
    handleClickRange(type) {
      this.rangeDisabled = false;
      let value = this.rangeStart + "-" + this.rangeEnd;
      let params = {
        id: this.rangeId,
        value: value,
      };
      if (type === "修改") {
        this.handleEditValue(params);
      }
    },
    handleOpenReceived() {
      let value = this.rangeStart + "-" + this.rangeEnd;
      let params = {
        id: this.rangeId,
        value: value,
        status: this.received ? "1" : "0",
      };
      this.handleEditValue(params, "received");
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/style.scss";
.disflex {
  display: flex;
  justify-content: center;
  align-items: center;
}

.subtitle {
  line-height: 3;
  font-size: 16px;
  background: #f2f2f2;
  text-align: center;
  color: #333333;
  font-weight: 600;
}
.main {
  padding: 30px 15vw !important;
}
.film_search {
  padding: 15px 40px 60px !important;
}
.h-table {
  border: 1px solid #d3d3d3;
  border-radius: 12px;
  // padding: 10px 0px;
}
.h-head {
  @extend .disflex;
  justify-content: space-around;
  font-family: MicrosoftYaHei-Bold;
  font-size: 14.4px;
  color: #3c3c3c;
  text-align: center;
  border-bottom: 1px solid #d3d3d3;
  p {
    font-size: 12px;
    color: #3c3c3c;
  }
  div {
    font-size: 13px;
    color: #3c3c3c;
    font-weight: bold;
  }
}
.h-head:last-child {
  border-bottom: none;
}
.h-name {
  flex: 1;
}
.h-title {
  padding: 16px 0;
}
.h-flex {
  flex: 1;
  // padding: 0 20px;
}
.h-input {
  width: 55px;
  text-align: center;
  height: 40px;
}
.h-num {
  @extend .disflex;
  justify-content: space-evenly;
  height: 40px;
}
.h-btn {
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: space-around;
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
