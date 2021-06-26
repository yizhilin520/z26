<template lang="pug">
  div.widget-match-select
    div.match-infos
      span.info-item(v-text="data.leagueName")
      span.info-item(v-text="currentMatchTime")
    a.match-close.ivu-icon.ivu-icon-ios-close(href="javascript: void(0)" @click="onDelete")
    div.match-header.clearfix
      div.match-host-guest(v-if="isFootball")
        div.match-name.is-left
          span.name-host （主）
          span.name-text(v-text="data.homeName")
          v-image.match-image(:src="data.homeLogo" fit="contain" :defaultImage="defaultTeamLogo")
        div.match-vs VS
        div.match-name.is-right
          v-image.match-image(:src="data.guestLogo" fit="contain" :defaultImage="defaultTeamLogo")
          span.name-text(v-text="data.guestName")
      div.match-host-guest(v-if="isBasketball")
        div.match-name.is-left
          span.name-text(v-text="data.guestName")
          v-image.match-image(:src="data.guestLogo" fit="contain" :defaultImage="defaultTeamLogo")
        div.match-vs VS
        div.match-name.is-right
          v-image.match-image(:src="data.homeLogo" fit="contain" :defaultImage="defaultTeamLogo")
          span.name-text(v-text="data.homeName")
          span.name-host （主）
    div.match-select
      div.match-select-item(
        v-for="(row, index) in getMatchOddsList"
        :key="index"
      )
        //-div.select-item.is-index 0
        a.select-item(
          v-for="(subRow, subIndex) in row"
          :key="subIndex"
          href="javascript: void(0)"
          :class="getSelectClass(subRow)"
          @click="()=>subRow.click(subRow)"
        )
          span(
            v-for='(labelRow, labelIndex) in ((typeof subRow.label ==="undefined" ? "" : `${subRow.label}`).split(/\\s+/))'
            :key="labelIndex"
            v-text="labelRow"
          )
</template>
<script type="text/javascript">
import DayJs from 'dayjs'
import Image from './Image'
import Modal from '../../plugins/modal'
import DefaultFootballMatchImage from '@/assets/images/default_football_match_image.png';
import DefaultBasketballMatchImage from '@/assets/images/default_basketball_match_image.png';

const empty = () => {
}

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    select: Object,
    // 赔率限制
    planLimit: Object
  },
  components: {
    VImage: Image
  },
  computed: {
    // 获取默认球队logo
    defaultTeamLogo() {
      const {isFootball, isBasketball} = this
      if (isFootball) return DefaultFootballMatchImage
      if (isBasketball) return DefaultBasketballMatchImage
      return null
    },
    // 获取选择的对象
    currentSelectObj() {
      const {select} = this
      const {index, selectIndex} = select || {}

      return {
        index,
        selectIndex: selectIndex || []
      }
    },
    // 获取开赛时间
    currentMatchTime() {
      return DayJs(this.data.matchTime).format('YYYY-MM-DD HH:mm')
    },
    // 是否是足球
    isFootball() {
      return this.data.sportId === 1
    },
    // 是否是篮球
    isBasketball() {
      return this.data.sportId === 2
    },
    // 竞彩
    isLottery() {
      const {playType} = this.data

      return playType === 1 || playType === 4
    },
    // 让球
    isHandicap() {
      const {playType} = this.data

      return playType === 2 || playType === 5
    },
    // 大小
    isSize() {
      const {playType} = this.data

      return playType === 3 || playType === 6
    },
    // 获取已选择赛事赔率列表
    getMatchOddsList() {
      const {data, isLottery, isFootball, isBasketball, isHandicap, isSize, onPlanSelect, formatIndexVal} = this
      const [{ratios: oneRatios, index: oneIndex} = {}, {ratios: twoRatios, index: twoIndex} = {}] = data.games || []
      const [main = 0, flat = 0, lose = 0] = oneRatios || []
      const oneIndexVal = oneIndex || 0
      const twoIndexVal = twoIndex || 0

      // 定义几个对象
      let mainObj = {label: main, click: empty}
      let flatObj = {label: flat, click: empty}
      let loseObj = {label: lose, click: empty}

      if (isLottery) {
        // 竞彩 盘口、主胜、平局、客胜
        mainObj = {
          label: `主胜 ${main}`,
          // 盘口值
          indexVal: oneIndexVal,
          // 交易项的下标(从1开始)
          recommendIndex: 1,
          value: main,
          click: onPlanSelect
        }
        flatObj = {
          label: `平局 ${flat}`,
          indexVal: oneIndexVal,
          recommendIndex: 2,
          value: flat,
          click: onPlanSelect
        }
        loseObj = {
          label: `客胜 ${lose}`,
          indexVal: oneIndexVal,
          recommendIndex: 3,
          value: lose,
          click: onPlanSelect
        }
      } else if (isHandicap) {
        // 让球 主胜、主让(盘口)、客胜
        mainObj = {
          label: `主胜 ${main}`,
          indexVal: oneIndexVal,
          recommendIndex: 1,
          value: main,
          click: onPlanSelect
        }

        const absOneIndexVal = Math.abs(oneIndexVal || 0)
        let flatLabel = formatIndexVal(absOneIndexVal)

        if ((isFootball && oneIndexVal < 0) || (isBasketball && oneIndexVal > 0)) flatLabel = `客让 ${formatIndexVal(absOneIndexVal)}`
        if ((isFootball && oneIndexVal > 0) || (isBasketball && oneIndexVal < 0)) flatLabel = `主让 ${formatIndexVal(absOneIndexVal)}`

        flatObj = {
          label: flatLabel,
          class: ['is-disabled'],
          click: empty
        }
        loseObj = {
          label: `客胜 ${flat}`,
          indexVal: oneIndexVal,
          recommendIndex: 3,
          value: flat,
          click: onPlanSelect
        }
      } else if (isSize) {
        // 大小 大、大小(盘口)、小
        mainObj = {
          label: `大 ${main}`,
          indexVal: oneIndexVal,
          recommendIndex: 1,
          value: main,
          click: onPlanSelect
        }
        flatObj = {
          label: `大小 ${formatIndexVal(oneIndexVal)}`,
          class: ['is-disabled'],
          click: empty
        }
        loseObj = {
          label: `小 ${flat}`,
          indexVal: oneIndexVal,
          recommendIndex: 3,
          value: flat,
          click: onPlanSelect
        }
      }

      const itemArr = [mainObj, flatObj, loseObj]
      let result = [itemArr]
      if (isLottery) {
        const [twoMain = 0, twoFlat = 0, twoLose = 0] = twoRatios || []
        // TODO 没有数据先隐藏
        // result = [isFootball ? itemArr : [mainObj, loseObj], [{
        //   label: `主胜 ${twoMain}`,
        //   indexVal: twoIndexVal,
        //   recommendIndex: 1,
        //   value: twoMain,
        //   click: onPlanSelect
        // }, isFootball && {
        //   label: `平局 ${twoFlat}`,
        //   indexVal: twoIndexVal,
        //   recommendIndex: 2,
        //   value: twoFlat,
        //   click: onPlanSelect
        // }, {
        //   label: `客胜 ${isFootball ? twoLose : twoFlat}`,
        //   indexVal: twoIndexVal,
        //   recommendIndex: 3,
        //   value: isFootball ? twoLose : twoFlat,
        //   click: onPlanSelect
        // }].filter(Boolean)]
        result = [isFootball ? itemArr : [mainObj, loseObj]]
      }

      if (isBasketball) {
        // 篮球数组置反
        result = result.map(row => row.reverse())
      }

      if (isLottery) {
        // 竞彩
        result = result.map((row, index) => {
          let label
          let classArr = ['is-index']

          if (index) {
            // 防止返回的数据有+-符号，处理下
            const absTwoIndexVal = Math.abs(twoIndexVal)
            if (twoIndexVal > 0) {
              label = `+${formatIndexVal(absTwoIndexVal)}`
              classArr.push('is-red')
            }
            if (twoIndexVal < 0) {
              label = `-${formatIndexVal(absTwoIndexVal)}`
              classArr.push('is-green')
            }
          } else {
            label = formatIndexVal(oneIndexVal)
          }
          // TODO 没有数据先隐藏
          // return [{
          //   label,
          //   class: classArr,
          //   click: empty
          // }].concat(row)
          return row
        })
      }

      return result
    }
  },
  methods: {
    // 格式化盘口值
    formatIndexVal(indexVal) {
      let indexStr = String(indexVal)
      if (indexStr.startsWith('+')) indexStr.substr(1)
      return Number.parseFloat(indexStr)
    },
    // 获取样式
    getSelectClass({recommendIndex, class: className, indexVal, value}) {
      const {currentSelectObj, planLimit, isLottery} = this
      const {singleLimit} = planLimit
      const {index: sPIndex, selectIndex} = currentSelectObj
      const indexFormat = v => String(Number.parseFloat(v))

      const rClass = className || []
      if (isLottery && value < singleLimit) rClass.push('is-disabled')
      if (indexFormat(sPIndex) === indexFormat(indexVal) && selectIndex.includes(recommendIndex)) rClass.push('is-active')

      return rClass
    },
    // 删除
    onDelete() {
      Modal.confirm({
        text: '确认删除当前赛事？',
        onConfirm: () => this.$emit('delete')
      })
    },
    // 选择
    onPlanSelect(row) {
      const {data} = this

      this.$emit('select', row, data)
    }
  }
}
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>
.widget-match-select {
  position: relative;
  padding-bottom: 20px;
  box-shadow: 1px 1px 5px 3px rgba(244, 245, 247, 0.48);
  border-radius: 10px;

  .match-header {
    position: relative;
    height: 67px;
    align-items: center;
  }

  .match-infos {
    padding: 0 14px;
    display: flex;
    align-items: center;
    height: 47px;
    font-size: 14px;
    color: #6D6F89;
    background: #EBF0FB;
    border-radius: 10px 10px 0px 0px;

    .info-item {
      margin-left: 10px;
    }
  }

  .match-host-guest {
    display: flex;
    margin-top: 30px;
    height: 38px;
    align-items: center;
    justify-content: center;

    .match-name {
      position: relative;
      font-size: 14px;
      color: #434A66;
      display: flex;
      align-items: center;

      &.is-left {
        .name-host {
          left: 0;
          transform: translate3d(-100%, -50%, 0);
        }

        .name-text {
          margin-right: 10px;
        }
      }

      &.is-right {
        .name-host {
          right: 0;
          transform: translate3d(100%, -50%, 0);
        }

        .match-image {
          margin-right: 10px;
        }
      }
    }

    .name-host {
      margin-top: -1px;
      position: absolute;
      top: 50%;
      line-height: 1;
      color: #929BB3;
    }

    .match-image {
      width: 38px;
      height: 38px;
    }

    .match-vs {
      margin: 0 20px;
      font-size: 18px;
      color: #14162C;
      font-weight: 600;
    }

    .name-text {
      font-weight: 600;
    }
  }

  .match-close {
    position: absolute;
    top: 8px;
    right: 14px;
    height: 10px;
    color: #949BB1;
    font-size: 30px;
  }

  .match-select-item {
    $height: 60px;

    margin-top: 10px;
    display: flex;
    justify-content: center;

    &:first-child {
      margin-top: 0;
    }

    .select-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-left: 5px;
      text-align: center;
      width: 122px;
      height: $height;
      color: #434A66;
      font-size: 16px;
      background-color: #F4F5F7;
      border-radius: 2px;

      span {
        margin: 4px 0;
        height: 16px;
        line-height: 16px;
      }

      &:first-child {
        margin-left: 0;
      }

      &:hover {
        color: #fff;
        background-color: $textColor;
      }

      &.is-index {
        width: 55px;
        font-size: 22px;
        background-color: #F4F5F7;
        cursor: default;

        &:hover {
          color: #434A66;
          background-color: #F4F5F7;
        }

        &.is-red, &.is-green {
          color: #fff;
        }

        &.is-red {
          background-color: #FF5338;
        }

        &.is-green {
          background-color: #65D275;
        }
      }

      &.is-active {
        color: #fff;
        background-color: $textColor;
      }

      &.is-disabled {
        color: #949BB1;
        background-color: #F4F5F7;
        cursor: default;
      }
    }
  }
}
</style>