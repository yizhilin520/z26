<template lang="pug">
  div.ui-widget-match-modal(v-show="visible")
    div.match-mask(:style="{zIndex}")
    div.match-wrap(:style="{zIndex}")
      div.match-title
        span.title-label 选择赛事
        span.match-close.ivu-icon.ivu-icon-ios-close(@click="onCloseHandler")
      div.match-content
        // 筛选
        div.match-filter
          LeagueSelect.filter-item.match-select-filter.pro-iview(
            :sportId="queryParams.sportId"
            :leagueData="allLeague"
            @on-confirm="onLeagueSelectConfirm"
          )
          DatePicker.filter-item.date-filter.pro-iview(
            ref="datePicker"
            type="date"
            placeholder="年月日"
            :clearable="false"
            :editable="false"
            @on-change="onDateChange"
            :value="queryParams.date"
            :options="dateOptions"
          )
          Input.filter-item.search-filter(
            v-model="queryParams.leagueOrTeamName"
            placeholder="请输入联赛或球队"
            @on-enter="getPageData"
          )
            i.iconfont.iconRectangleCopy3.search-icon.block(slot="suffix" @click="getPageData")
          a.filter-item.reset-button(href="javascript: void(0)" @click="initPageParams(queryParams.playType)") 重置
        div.match-table
          Table.pro-iview(
            height="462"
            border
            :loading="loading"
            :columns="tableColumns"
            :data="tableList"
            @on-row-click="onTableSelect"
            :row-class-name="tableRowClassName"
          )
      div.match-footer
        div.footer-tips(v-text="tipsLabel")
        div.footer-buttons
          a.button-item.is-cancel(href="javascript: void(0)" @click="onCloseHandler") 取消
          a.button-item.is-confirm(href="javascript: void(0)" @click="onConfirmHandler" v-if="isLotteryType") 确定
</template>
<script type="text/javascript">
import {DatePicker, Input, Table} from 'iview'
import DayJs from 'dayjs'
import LeagueSelect from './leagueSelect'
import * as ProfessorService from '@/servers/professor'
import ToastInstance from '../../plugins/toast'
import {HttpCode} from "@/enums";

export default {
  name: 'MatchModal',
  components: {
    DatePicker,
    Input,
    Table,
    LeagueSelect
  },
  data() {
    return {
      visible: false,
      userId: null,
      zIndex: 1000,
      // 关闭
      onCancel: null,
      // 点击确定
      onConfirm: null,
      // 查询query参数
      queryParams: {},
      // 查询数据的loading状态
      loading: false,
      // 页面数据
      list: [],
      // 当前选中的id
      activeIds: [],
      // 展示联赛的ids
      showLeagueIds: [],
      // 底部提示
      tipsLabel: null,
      // 已发布方案的赛事id
      publishedMatchesId: []
    }
  },
  computed: {
    // 是否是足球
    isFootball() {
      return this.queryParams.sportId === 1
    },
    // 是否是篮球
    isBasketball() {
      return this.queryParams.sportId === 2
    },
    // 表格组件配置
    tableColumns() {
      const {
        activeIds,
        onTableSelect,
        queryParams: {playType, sportId},
        isFootball,
        isBasketball,
        isLotteryType,
        formatIndexVal,
        publishedMatchesId
      } = this

      const numberObj = {
        title: '编号',
        key: 'sortNo',
        align: 'center',
        width: 98
      }
      const leagueNameObj = {
        title: '赛事名称',
        key: 'leagueName',
        align: 'center',
        width: 96
      }
      const matchTimeObj = {
        title: '比赛时间',
        key: 'matchTime',
        align: 'center',
        width: 157,
        render(createElement, {row: {matchTime}}) {
          return createElement('div', null, DayJs(matchTime).format('YYYY-MM-DD HH:mm'))
        }
      }
      // 足球：主-客 篮球：客主
      const hostTeamObj = {
        title: sportId === 1 ? '主队 VS 客队' : '客队 VS 主队',
        align: 'center',
        render(createElement, {row: {homeName, guestName}}) {
          const label = sportId === 1 ? `${homeName} VS ${guestName}` : `${guestName} VS ${homeName}`
          return createElement('div', null, label)
        }
      }
      const letBallObj = {
        title: '让球',
        key: 'index',
        align: 'center',
        width: 50,
        render(h, {row: {games}}) {
          const [{index: fIndex}={}, {index: lIndex}={}] = games || []
          const fNumber = fIndex || 0
          const lNumber = lIndex || 0
          const absFNumber = Math.abs(formatIndexVal(fNumber))
          const absLNumber = Math.abs(formatIndexVal(lNumber))

          let fColor
          let fLabel = fNumber
          let lColor
          let lLabel = lNumber

          if (fNumber > 0) {
            fColor = '#FF5338'
            fLabel = `+${absFNumber}`
          }
          if (fNumber < 0) {
            fColor = '#65D275'
            fLabel = `-${absFNumber}`
          }

          if (lNumber > 0) {
            lColor = '#FF5338'
            lLabel = `+${absLNumber}`
          }
          if (lNumber < 0) {
            lColor = '#65D275'
            lLabel = `-${absLNumber}`
          }

          const dataList = [{label: fLabel, color: fColor}, {label: lLabel, color: lColor}]

          return h('div', {class: ['cell-vertical-container', 'is-hem']}, dataList.map(({label, color}) => h('div', {
            class: 'cell-item',
            style: {color}
          }, label)))
        }
      }
      const winFlatLoseObj = {
        title: '胜平负',
        align: 'center',
        width: 150,
        render(h, {row: {games}}) {
          const [{ratios}=[], {ratios: lastRatios}=[]] = games || []
          const [main, flat, guest] = ratios || []
          const [lMain, lFlat, lGuest] = lastRatios || []
          const oneMain = {label: '主胜', value: main}
          const oneFlat = {label: '平', value: flat}
          const oneGuest = {label: '客胜', value: guest}

          const twoMain = {label: '主胜', value: lMain}
          const twoFlat = {label: '平', value: lFlat}
          const twoGuest = {label: '客胜', value: lGuest}

          let dataList = []
          if (isFootball) {
            dataList = [
              [oneMain, oneFlat, oneGuest],
              // TODO 没有数据先隐藏
              // [twoMain, twoFlat, twoGuest]
            ]
          } else {
            dataList = [
              [oneGuest, oneMain],
              // TODO 没有数据先隐藏
              // [twoGuest, twoMain]
            ]
          }

          return h('div', {}, dataList.map(row => {
            return h('div', {class: ['cell-horizontal-container', 'is-hem']}, row.map(({
                                                                                         label,
                                                                                         value
                                                                                       }) => h('div', {class: 'cell-item'}, [
              h('div', null, [h('p', {class: 'cell-label'}, label), h('p', {class: 'cell-value'}, value)])
            ])))
          }))
        }
      }
      const selectObj = {
        title: '选择',
        align: 'center',
        width: isLotteryType ? 63 : 92,
        render(createElement, {row}) {
          const {matchId} = row
          const selectClass = ['match-select']
          if (publishedMatchesId.some(val => val === matchId)) selectClass.push('is-disable')
          if (activeIds.includes(matchId)) selectClass.push('is-active')
          if (isLotteryType) {
            selectClass.push('is-checkbox')
          } else {
            selectClass.push('is-button')
          }

          const clickHandle = (e) => {
            e.stopPropagation()
            onTableSelect(row)
          }

          return createElement('div', {class: selectClass, on: {click: clickHandle}}, '选择')
        }
      }
      const mainWinObj = {
        title: '主胜',
        align: 'center',
        width: 128,
        render(createElement, {row: {games}}) {
          const [{ratios}={}] = games || []
          const [main] = ratios || []
          return createElement('div', null, `主胜 ${main}`)
        }
      }
      const mainLetBallObj = {
        title: '让球',
        align: 'center',
        width: 100,
        render(createElement, {row: {games}}) {
          const [{index}={}] = games || []

          const absOneIndexVal = Math.abs(index || 0)
          let flatLabel = formatIndexVal(absOneIndexVal)

          if ((isFootball && index < 0) || (isBasketball && index > 0)) flatLabel = `客让 ${absOneIndexVal}`
          if ((isFootball && index > 0) || (isBasketball && index < 0)) flatLabel = `主让 ${absOneIndexVal}`
          return createElement('div', null, flatLabel)
        }
      }
      const guestWinObj = {
        title: '客胜',
        align: 'center',
        width: 100,
        render(createElement, {row: {games}}) {
          const [{ratios}={}] = games || []
          const [main, flat] = ratios || []
          return createElement('div', null, `客胜 ${flat}`)
        }
      }
      const bigObj = {
        title: '大',
        align: 'center',
        width: 128,
        render(createElement, {row: {games}}) {
          const [{ratios}={}] = games || []
          const [main] = ratios || []
          return createElement('div', null, `大 ${main}`)
        }
      }
      const scoredBallObj = {
        title: '进球数',
        align: 'center',
        width: 100,
        render(createElement, {row: {games}}) {
          const [{index}={}] = games || []
          return createElement('div', null, formatIndexVal(index || 0))
        }
      }
      const smallObj = {
        title: '小',
        align: 'center',
        width: 100,
        render(createElement, {row: {games}}) {
          const [{ratios}={}] = games || []
          const [main, flat] = ratios || []
          return createElement('div', null, `小 ${flat}`)
        }
      }

      if (playType === 1 || playType === 4) {
        // TODO 没有数据先隐藏
        // return [numberObj, leagueNameObj, matchTimeObj, hostTeamObj, letBallObj, winFlatLoseObj, selectObj]
        return [leagueNameObj, matchTimeObj, hostTeamObj, winFlatLoseObj, selectObj]
      } else if (playType === 2 || playType === 5) {
        if (isBasketball) return [leagueNameObj, matchTimeObj, hostTeamObj, guestWinObj, mainLetBallObj, mainWinObj, selectObj]
        return [leagueNameObj, matchTimeObj, hostTeamObj, mainWinObj, mainLetBallObj, guestWinObj, selectObj]
      } else if (playType === 3 || playType === 6) {
        if (isBasketball) return [leagueNameObj, matchTimeObj, hostTeamObj, smallObj, scoredBallObj, bigObj, selectObj]
        return [leagueNameObj, matchTimeObj, hostTeamObj, bigObj, scoredBallObj, smallObj, selectObj]
      }
      return []
    },
    // 时间选择器选项
    dateOptions() {
      return {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      }
    },
    // 赛事筛选需要的数据
    allLeague() {
      const {list, findFirstLetter} = this

      const map = {}
      const arr = list.reduce((sum, item) => {
        const leagueId = item.leagueId
        if (!map[leagueId]) {
          const leagueName = item.leagueName
          const isHot = item.isHot
          const letter = findFirstLetter(leagueName)
          const obj = {
            count: 1,
            leagueId,
            leagueName,
            isHot,
            letter
          }
          map[leagueId] = obj
          sum.push(obj)
        } else {
          map[leagueId].count++
        }
        return sum
      }, [])
      arr.sort((a, b) => {
        if (a.letter > b.letter) {
          return 1
        }
        return -1
      })
      return arr
    },
    // 表格需要的数据
    tableList() {
      const {list, showLeagueIds} = this
      if (showLeagueIds && showLeagueIds.length) return list.filter(({leagueId}) => showLeagueIds.includes(leagueId))

      return list
    },
    // 是否是竞彩类型
    isLotteryType() {
      const {queryParams} = this
      const {playType} = queryParams

      return playType === 1 || playType === 4
    }
  },
  methods: {
    $judgeCode(code) {
      return HttpCode.SUCCESS === code
    },
    // 表格行名的回调方法
    tableRowClassName({matchId}) {
      const {publishedMatchesId} = this
      if (!publishedMatchesId.length) return
      const flag = publishedMatchesId.some(val => val === matchId)
      if (flag) return 'is-disable-row'
    },
    // 格式化盘口值
    formatIndexVal(indexVal) {
      let indexStr = String(indexVal)
      if (indexStr.startsWith('+')) indexStr.substr(1)
      return Number.parseFloat(indexStr)
    },
    // 点击确定回调
    onConfirmHandler() {
      const {activeIds, tableList, onConfirm, queryParams} = this
      const {sportId, playType} = queryParams
      if (activeIds === null || !activeIds.length) return ToastInstance('请至少选择一项赛事')

      if (onConfirm) onConfirm(tableList.filter((row) => {
        const isInclude = activeIds.includes(row.matchId)
        if (isInclude) {
          // 将参数设置进去
          row.sportId = sportId
          row.playType = playType
        }

        return isInclude
      }))

      this.visible = false
      // 将数据置空，要流畅一点因为数据可能太多
      this.list = []
    },
    findFirstLetter(name) {
      // 英文字母开头
      if (/^[a-zA-Z]/.test(name)) return name[0].toUpperCase()
      const letters = 'abcdefghjklmnopqrstwxyz'.split('')
      const zh = '阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀'.split('')
      const letter = letters.find((item, i) => (name.localeCompare(zh[i]) >= 0 && name.localeCompare(zh[i + 1]) < 0))
      return letter ? letter.toUpperCase() : ''
    },
    // 赛事筛选确定后
    onLeagueSelectConfirm(ids) {
      this.showLeagueIds = ids
    },
    // 时间选择
    onDateChange(date) {
      this.$set(this.queryParams, 'date', date)
      this.getPageData()
    },
    // 表格选择
    onTableSelect({matchId}) {
      const {isLotteryType, activeIds, onConfirmHandler, publishedMatchesId} = this
      const isPublished = publishedMatchesId.some(val => val === matchId)
      if (isPublished) return ToastInstance('您已发布过该比赛，同一比赛只能发布一种玩法的一个方案')

      if (!isLotteryType) {
        this.activeIds = [matchId]
        return onConfirmHandler()
      }
      // 竞彩最多选择两个
      // 检查是否包含
      const indexOf = activeIds.indexOf(matchId)
      if (indexOf !== -1) {
        // 包含去除
        this.activeIds.splice(indexOf, 1)
      } else {
        // 没有包含
        if (activeIds.length > 1) return ToastInstance('最多选择两场串关！')
        activeIds.push(matchId)
      }
      return false
    },
    // 关闭
    onCloseHandler(e) {
      const {onCancel, $refs} = this
      if (onCancel) onCancel(e)

      if ($refs.datePicker) $refs.datePicker.focusedDate = new Date()

      this.visible = false
      // 将数据置空，要流畅一点因为数据可能太多
      this.list = []
    },
    /**
     * 页面参数初始化
     * @param type 1竞彩足球；2足球让球；3足球大小；4竞彩篮球；5篮球让分；6篮球大小分
     */
    initPageParams(type) {
      const {getPageData} = this
      let sportId
      if (type === 1 || type === 2 || type === 3) {
        // 足球
        sportId = 1
      } else if (type === 4 || type === 5 || type === 6) {
        // 篮球
        sportId = 2
      }
      this.queryParams = {
        sportId,
        playType: type
      }

      getPageData()

      this.visible = true
    },
    // 获取页面数据
    async getPageData() {
      const {getExpertMatchesData, getPublishedMatchesIdData} = this

      this.loading = true
      try {
        await getExpertMatchesData()
        await getPublishedMatchesIdData()
      } finally {
        this.loading = false
      }
    },
    // 获取赛事列表
    async getExpertMatchesData() {
      const {queryParams, $judgeCode} = this

      // 请求数据时将数据置空
      this.showLeagueIds = []

      const {data: {data, code, msg}} = await ProfessorService.getExpertMatches(queryParams).toPromise()
      if (!$judgeCode(code)) ToastInstance(msg || '请求失败请重试！')

      const rData = data || []

      if (!rData.length) this.activeIds = []

      this.list = rData
    },
    // 获取专家已发布的方案赛事id
    async getPublishedMatchesIdData() {
      const userId = this.userId
      if (!userId) return false
      const {queryParams, $judgeCode} = this
      const {playType} = queryParams

      const {data: {data, code, msg}} = await ProfessorService.getPublishedMatchesId({
        userId,
        sport: playType
      }).toPromise()
      if (!$judgeCode(code)) ToastInstance(msg || '请求失败请重试！')

      const rData = data || []

      this.publishedMatchesId = rData
    }
  }
}
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>
@import '../style/iview';

.ui-widget-match-modal {
  .match-mask, .match-wrap {
    position: fixed;
  }

  .match-mask {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .6);
  }

  .match-wrap {
    top: 50%;
    left: 50%;
    width: 902px;
    background: #fff;
    border-radius: 10px;
    transform: translate3d(-50%, -50%, 0);
  }

  .match-title {
    padding: 0 25px;
    display: flex;
    color: #434A66;
    height: 60px;
    align-items: center;
    background-color: #EAF1FF;
    border-radius: 10px 10px 0 0;

    .title-label {
      flex: 1;
      font-size: 18px;
      font-weight: 600;
    }

    .match-close {
      font-size: 30px;
      font-weight: bold;
      color: #949BB1;
      cursor: pointer;
      transform: rotate(0deg);
      transition: .5s;

      &:hover {
        transform: rotate(180deg);
      }
    }
  }

  .match-content {
    margin: 0 46px;
  }

  .match-filter {
    display: flex;
    margin-top: 16px;
    height: 30px;
    align-items: center;

    .filter-item {
      margin-left: 16px;
      font-size: 12px;
      color: #434A66;

      &:first-child {
        margin-left: 0;
      }

      &:hover {
        /deep/ {
          .ivu-input {
            border-color: $textColor;

            &::placeholder {
              color: #434A66;
            }
          }
        }

        .search-icon {
          // color: #CE995B;
          background-color: #eec383;
        }
      }

      /deep/ {
        .ivu-input {
          padding: 4px 32px 4px 10px;
          font-size: 12px;
          color: #434A66;
          height: 30px;
          line-height: 30px;
          border: 1px solid #e6eaf3;
          border-radius: 6px 2px 6px 6px;
          box-shadow: none;

          &::placeholder {
            color: #6D6F89;
          }
        }
      }
    }

    .match-select-filter {
      display: flex;
      width: 83px;
      height: 30px;
      border: 1px solid #e6eaf3;
      border-radius: 6px 2px 6px 6px;
      align-items: center;
      justify-content: center;

      &:hover {
        border-color: #e6eaf3;
      }

      /deep/ {
        .league-info {
          max-height: 400px;
          overflow: auto;
        }
      }
    }

    .date-filter {
      width: 120px;

      /deep/ {
        .ivu-input {
          cursor: pointer;
        }
      }
    }

    .search-filter {
      width: 175px;

      /deep/ {
        .ivu-input {
          padding-right: 60px;
        }

        .ivu-input-suffix {
          cursor: pointer;
          width: 50px;
        }
      }

      .search-icon {
        font-weight: bold;
        color: #6A3E12;
        line-height: 30px;
        background-color: $textColor;
        border-radius: 0 1px 5px 0;
      }
    }

    .reset-button {
      width: 60px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: $textColor;
      text-align: center;
      border-radius: 6px;
      border: 1px solid$textColor;
    }
  }

  .match-table {
    margin-top: 16px;

    $borderColor: #E6EAF3;
    $headerBg: #EAF1FF;
    $tableItemHeight: 42px;

    /deep/ {
      .ivu-table-wrapper {
        border-color: $borderColor;
        border-radius: 6px 6px 0 0;
        overflow: hidden;

        .ivu-table {
          &:after, &:before {
            background-color: $borderColor;
          }

          .is-disable-row {
            td {
              color: #949BB1;
            }
          }

          td {
            height: $tableItemHeight;
            line-height: 16px;
            border-right-color: $borderColor;
            border-bottom-color: $borderColor;
          }
        }

        .ivu-table-row-hover {
          cursor: pointer;

          //td {
          //background-color: #FEF3E7;
          //}
        }
      }

      .ivu-table-header {
        color: #14162C;
        font-size: 14px;

        colgroup > col[width="17"] {
          width: 0;
        }

        th {
          font-weight: 400;
          height: $tableItemHeight;
          background-color: $headerBg;
          border-right: none;
          border-bottom-color: $borderColor;

          &:first-child {
            border-left: none;
          }
        }
      }

      .ivu-table-cell {
        $aroundSpace: 5px;

        padding-left: $aroundSpace;
        padding-right: $aroundSpace;

        .match-select {
          margin: auto;
          position: relative;
          cursor: pointer;

          &.is-checkbox {
            width: 16px;
            height: 16px;
            border: 1px solid #b7babf;
            border-radius: 8px;
            text-indent: -999px;

            &.is-active {
              border-color: $textColor;

              &:before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 9px;
                height: 9px;
                background-color: $textColor;
                border-radius: 4.5px;
                transform: translate3d(-50%, -50%, 0);
              }

              &.is-disable {
                &:before {
                  background-color: #D0D3DD;
                }
              }
            }

            &.is-disable {
              border-color: #D0D3DD !important;
            }
          }

          &.is-button {
            width: 46px;
            height: 22px;
            line-height: 22px;
            text-align: center;
            color: $textColor;
            font-size: 12px;
            box-sizing: content-box;
            text-decoration: underline;

            &:hover {
              font-weight: bold;
            }

            &.is-disable {
              color: #949BB1;
              text-decoration: none;

              &:hover {
                font-weight: normal;
              }
            }
          }
        }

        .cell-vertical-container, .cell-horizontal-container {
          &.is-hem {
            margin-left: -$aroundSpace;
            margin-right: -$aroundSpace;
          }

          .cell-item {
            display: flex;
            height: $tableItemHeight;
            align-items: center;
            justify-content: center;
          }
        }

        .cell-vertical-container {
          .cell-item {
            border-bottom: 1px solid $borderColor;

            &:last-child {
              border-bottom: none;
            }
          }
        }

        .cell-horizontal-container {
          display: flex;
          height: $tableItemHeight;
          border-bottom: 1px solid $borderColor;

          &:last-child {
            border-bottom: none;
          }

          .cell-item {
            flex: 1;
            border-left: 1px solid $borderColor;
            overflow: hidden;

            &:first-child {
              border-left: none;
            }
          }
        }
      }

      .ivu-table-body {
        font-size: 12px;
        color: #434A66;
        overflow-x: hidden;

        table {
          width: calc(100% + 4px) !important;
        }
      }

      .ivu-table-tip {
        overflow: hidden;
      }
    }
  }

  .match-footer {
    display: flex;
    margin: 20px 46px 40px 46px;
    height: 32px;
    align-items: center;

    .footer-tips {
      flex: 1;
      color: #FF5338;
      font-size: 12px;
      overflow: hidden;
    }

    .footer-buttons {
      display: flex;
      align-items: center;

      .button-item {
        margin-left: 30px;
        width: 80px;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        text-align: center;
        border-radius: 6px;
        box-sizing: border-box;

        &.is-cancel {
          color: #2C2F57;
          border: 1px solid #2C2F57;
        }

        &.is-confirm {
          color: #fff;
          background: $buttonActiveBackground;
        }
      }
    }
  }
}
</style>