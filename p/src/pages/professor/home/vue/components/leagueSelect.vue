<template>
  <Poptip
    placement="bottom-start"
    width="408"
    class="league-filter"
    v-model="showPoptip"
  >
    <a class="league-link">
      <span class="link-label">赛事筛选</span>
      <Icon type="md-arrow-dropdown"/>
    </a>
    <div
      slot="content"
      class="select-content"
    >
      <CheckboxGroup v-model="leagueIds">
        <div class="league-info">
          <Checkbox
            v-for="item in leagueData"
            :key="item.leagueId"
            :label="item.leagueId"
          >
            <span class="league-name">
              {{ item.leagueName }}
            </span>
            <span
              class="checkbox-num"
            > [{{ item.count }}]</span>
          </Checkbox>
        </div>
      </CheckboxGroup>

      <div class="quick-filter" v-if="sportId == 1">
        <p @click="quickFilter(1)">五大联赛</p>
        <p @click="quickFilter(2)">只看热门</p>
      </div>
      <div class="filter-footer">
        <div class="select-num">
          选中<span class="num">[{{ selectNum }}]</span>场赛事
        </div>
        <div class="btn-group">
          <p
            class="btn-all"
            @click="changeChecked(1)"
          >
            全选
          </p>
          <p
            class="btn-anti-all"
            @click="changeChecked(2)"
          >
            反选
          </p>
          <p @click="toChecked" class="active-button">
            确定
          </p>
        </div>
      </div>
    </div>
  </Poptip>
</template>
<script>
import {Checkbox, CheckboxGroup, Icon, Poptip} from 'iview'
import $warning from '../../plugins/toast'

export default {
  components: {
    Icon,
    CheckboxGroup,
    Checkbox,
    Poptip
  },
  props: {
    leagueData: {
      default: () => [],
      type: Array
    },
    sportId: {
      default: 1,
      type: [Number, String]
    }
  },
  data() {
    return {
      leagueIds: [],
      showPoptip: false
    }
  },
  computed: {
    selectNum() {
      return this.leagueData.reduce((total, item) => {
        if (this.leagueIds.includes(item.leagueId)) {
          total = total + item.count
        }
        return total
      }, 0)
    }
  },
  watch: {
    leagueData: {
      handler() {
        this.leagueIds = this.leagueData.map(item => item.leagueId)
      },
      immediate: true,
    }
  },
  methods: {
    quickFilter(val) {
      if (val === 1) { // 五大联赛
        const fiveIds = [8, 25, 11, 28, 30]
        this.leagueIds = []
        const flag = this.leagueData.some(item => {
          return fiveIds.includes(item.leagueId)
        })
        if (flag) this.leagueIds = fiveIds
      } else { // 热门赛事
        this.leagueIds = this.leagueData.reduce((arr, item) => {
          if (item.isHot) arr.push(item.leagueId)
          return arr
        }, [])
      }
      this.toChecked()
    },
    toChecked() {
      if (this.leagueIds.length === 0) {
        $warning('请至少选择一项赛事')
        return
      }
      this.showPoptip = false
      this.$emit('on-confirm', this.leagueIds)
    },
    changeChecked(val) {
      if (val === 1) {
        this.leagueIds = this.leagueData.map(item => item.leagueId)
      } else {
        this.leagueIds = this.leagueData.reduce((arr, item) => {
          if (!this.leagueIds.includes(item.leagueId)) {
            arr.push(item.leagueId)
          }
          return arr
        }, [])
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.league-filter {
  color: #434A66;
  font-size: 12px;

  .league-link {
    font-size: 12px;
    color: $textColor;

    .link-label {
      vertical-align: middle;
    }
  }

  /deep/ .ivu-icon-md-arrow-dropdown {
    color: #434a66;
    vertical-align: middle;
  }

  /deep/ .ivu-select-arrow {
    color: #434a66;
    top: 52%;
  }

  &:hover {
    border-color: $textColor;

    /deep/ {
      .ivu-poptip-rel {
        a {
          color: $textColor;

          .ivu-icon {
            color: $textColor;
          }
        }
      }
    }
  }

  /deep/ .ivu-poptip-body {
    padding: 0;
  }

  .league-info {
    padding: 8px 16px;
    white-space: normal;

    .ivu-checkbox-wrapper {
      width: 116px;
      margin: 0 2px 10px 0;

      /deep/ {
        .ivu-checkbox {
          width: 16px;
          height: 16px;

          .ivu-checkbox-inner {
            border-radius: 50%;
          }

          &.ivu-checkbox-checked {
            .ivu-checkbox-inner {
              width: 16px;
              height: 16px;
              transition: none;
              display: inline-block;
              //background: url('../../../../assets/score/football/bt_cg1.png') center center
              //  no-repeat;
              background-size: 100% auto;
              background-repeat: no-repeat;
              background-color: transparent;
              border-color: transparent;

              &:after {
                display: none;
              }

              &:before {
                display: none;
              }
            }
          }

          .ivu-checkbox-focus {
            box-shadow: none;
          }
        }

        .league-name {
          display: inline-block;
          max-width: 72px;
          line-height: 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: middle;
          color: #14162c;
          font-size: 14px;
        }

        .checkbox-num {
          vertical-align: middle;
          color: #76809c;
        }
      }
    }
  }

  .quick-filter {
    padding: 12px 20px;
    margin-top: 10px;
    display: flex;
    border-top: 1px solid #e5e5e5;

    p {
      flex: 1;
      height: 32px;
      line-height: 32px;
      background: #f0f2f8;
      border-radius: 4px;
      text-align: center;
      font-size: 14px;
      cursor: pointer;

      &:first-child {
        margin-right: 10px;
      }

      &:hover {
        //background: linear-gradient(133deg, #feeac5 0%, #eec383 100%);
        background: $buttonActiveBackground;
        color: #fff;
      }
    }
  }

  .filter-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background: #f0f2f8;

    .select-num {
      font-size: 14px;
      color: #14162c;

      .num {
        color: #ce995b;
      }
    }

    .btn-group {
      display: flex;

      p {
        width: 68px;
        height: 32px;
        margin-left: 10px;
        line-height: 32px;
        text-align: center;
        font-size: 14px;
        background: #fff;
        color: #14162c;
        border-radius: 4px;
        cursor: pointer;

        &.btn-all {
          margin-left: 0;
        }

        &:hover, &.active-button {
          background: $buttonActiveBackground;
          color: #fff;
        }
      }
    }
  }
}
</style>