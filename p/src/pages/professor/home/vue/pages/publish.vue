<template lang="pug">
  div.page-publish
    div.type-container.margin-content
      a.type-item(
        href="javascript: void(0)"
        v-for="({name, id}, index) in playTypeList"
        :key="index"
        v-text="name"
        :class="{'is-active': id === formParams.playType}"
        @click="$set(formParams, 'playType', id)"
      )
    div.button-container(:class="{stickTop}" :style="{width: `${($el||{}).clientWidth}px`}")
      a.select-match.is-hover-font-bold(href="javascript: void(0)" @click="onSelectMatch") 选择赛事
      div.publish-tips
        template(v-if="sendArticleNumber === -1")
          span 今天您还能发
          span.is-active(v-text="sendFeeArticleNumber")
          span 篇收费文章
        template(v-else)
          span 今天您还能发
          span.is-active(v-text="sendArticleNumber")
          span 篇文章，其中
          span.is-active(v-text="sendFeeArticleNumber")
          span 篇收费
      div.publish-button
        a.button-item.is-preview.is-hover-font-bold(href="javascript: void(0)" @click="onPublishPreview")
          span.button-label 预览
        a.button-item.is-publish.is-hover-font-bold(href="javascript: void(0)" v-if="judgeSendArticleByToday" @click="onPublishSubmit")
          span.button-label 发布
        <!-- a.button-item.is-draft.is-hover-font-bold(href="javascript: void(0)" @click="onPublishDraft") 存为草稿 -->
    div.button-container.margin-content(v-if="stickTop")
    div.match-container.margin-content
      MatchSelect.match-item(
        v-for="(row, index) in currentMatchesListByPlayId"
        :key="index"
        :data="row"
        :select="playSelectObj[getSelectObjKey(row.matchId, row.playType)] || {}"
        :plan-limit="planRatioLimit"
        @select="onPlaySelect"
        @delete="()=> onDeleteSelectMatchById(row.matchId)"
      )
    Editor.publish-editor(
      ref="editor"
      toolbar-class="editor-toolbar"
      warp-class="editor-warp"
      height="260px"
      :config="{menus: ['undo', 'redo']}"
      placeholder="输入文章内容不少于100字，涉嫌抄袭，出现广告，低俗无趣，擅留微信，QQ等联系方式等，将予以删除推荐单处理"
      @change="contentChange"
    )
      div.publish-editor-title(slot="middle")
        Input.title-input(placeholder="输入标题" v-model="formParams.title" :maxlength="30")
        div.title-limit {{ formParams.title ? `${formParams.title.length}/30` : '10-30字' }}
        //- 借助publish-editor-title定位内容的限制提示
        div.context-limit(v-if="contentLen")
          span 已输入
          span(style="color: #434A66;") {{contentLen}}
          span 字，至少100字
    div.plan-container.margin-content
      div.plan-label 方案价格
      div.plan-container(style="flex-wrap: wrap; flex: 1; overflow: hidden;")
        a.plan-item(
          href="javascript: void(0)"
          v-for="({label, value}) in planPriceList" v-text="label"
          :class="{'is-active': value === formParams.price, 'is-golden-hover-background': value === formParams.price}"
          @click="$set(formParams, 'price', value)"
        )
    div.radio-container.margin-content(v-if="false")
      div.radio-title 不中包退
      div.radio-wrap(:class="{'is-disabled': formParams.price === 0}")
        a.radio-inner(
          href="javascript: void(0)"
          :class="{'is-active': !!formParams.grantee}"
          @click="onGranteeHandle"
        )
        a.radio-label(
          href="javascript: void(0)"
          @click="onGranteeHandle"
        ) 不中包退
        div.radio-tips 本次推荐未命中或走盘，均返还用户付费金额
    Spin(fix v-show="loading" style="z-index: 2000;")
</template>
<script type="text/javascript">
import {Icon, Input, Spin} from 'iview'
import 'iview/dist/styles/iview.css'
import MatchSelect from '../components/matchSelect'
import Editor from '../components/editor'
import MatchModal from '../plugins/matchModal'
import * as ProfessorService from '@/servers/professor'
import unionWith from 'lodash/unionWith'
import throttle from 'lodash/throttle'
import {HttpCode} from '@/enums'
import ToastInstance from '../../plugins/toast'
import ModalInstance from '../../plugins/modal'
import PreviewInstance from '../plugins/preview'
import {addOnceEventListener, empty} from '@/utils/common'

export default {
  components: {
    Icon,
    MatchSelect,
    Editor,
    Input,
    Spin
  },
  props: {
    userId: null,
    pageId: null,
    onSubmit: {
      type: Function,
      default: empty
    }
  },
  data() {
    return {
      // 文章id
      articleId: this.pageId,
      // loading效果
      loading: false,
      // 玩法类型列表
      playTypeList: [],
      // 用户信息
      userDataInfos: {},
      // 表单参数
      formParams: {
        playType: null,
        // 方案价格
        price: 0,
        // 不中包退
        grantee: 0,
        // 标题
        title: null
      },
      // 赛事选择列表
      matchSelectList: [],
      // 赔率单选和双选的限制
      planRatioLimit: {},
      // 选择玩法eg====>{'matchId+playType':{index:盘口值,selectIndex: 选择的赔率索引值(后台需要的)数组, selectValue:选择赔率值数组}}
      playSelectObj: {},
      // 是否将发布预览一栏置顶
      stickTop: false,
      contentLen: 0
    }
  },
  computed: {
    // 判断今天是否能够发文章
    judgeSendArticleByToday() {
      const {sendArticleNumber, sendFeeArticleNumber} = this

      return sendArticleNumber || sendFeeArticleNumber
    },
    // 发文数量
    sendArticleNumber() {
      const {sendCount} = this.userDataInfos

      return sendCount || 0
    },
    // 收费文章发布数量
    sendFeeArticleNumber() {
      const {payCount} = this.userDataInfos

      return payCount || 0
    },
    // 方案价格列表
    planPriceList() {
      const {sendFeeArticleNumber, userDataInfos} = this

      const planPriceList = (userDataInfos.prices || [0]).map(price => {
        let label = `${price} 金币`
        if (price === 0) label = '免费'
        return {
          label,
          value: price
        }
      })
      if (sendFeeArticleNumber) return planPriceList
      return [planPriceList[0]]
    },
    // 根据玩法id获取当前选择的赛事列表
    currentMatchesListByPlayId() {
      const {formParams, matchSelectList} = this
      const {playType} = formParams

      return matchSelectList.filter(row => row.playType === playType)
    },
    // 是否是竞彩类型
    isLotteryType() {
      const {formParams} = this
      const {playType} = formParams

      return playType === 1 || playType === 4
    },
    // 是否是足球
    isFootballType() {
      const {formParams} = this
      const {playType} = formParams

      return playType === 1 || playType === 2 || playType === 3
    },
    // 是否是篮球
    isBasketballType() {
      const {formParams} = this
      const {playType} = formParams

      return playType === 4 || playType === 5 || playType === 6
    },
    currentSportId() {
      const {isFootballType, isBasketballType} = this
      if (isFootballType) return 1
      if (isBasketballType) return 2

      return null
    },
    // 不中包退值
    currentGrantee() {
      const {formParams} = this
      const {price, grantee} = formParams
      if (price) return grantee
      return 0
    }
  },
  beforeMount() {
    this.getPageData()
  },
  mounted() {
    // 监听窗口滚动事件
    addOnceEventListener(window, 'scroll', throttle(() => {
      this.stickTop = window.pageYOffset > 95
    }, 20))
  },
  methods: {
    $judgeCode(code) {
      return HttpCode.SUCCESS === code
    },
    // 监听富文本编辑器
    contentChange() {
      this.contentLen = this.$refs.editor.getText().replace(/(?:&nbsp;)|\s/g, '').length
    },
    // 数字取反
    numberReverse(number) {
      // 保险起见将值化为字符串
      const numStr = String(number)
      const minusReg = /^-/

      // 负数
      if (minusReg.test(numStr)) return numStr.replace(minusReg, '')
      // 正数
      return `-${numStr}`
    },
    // 发布/发布草稿成功地址跳转
    sendSuccessLinkPush() {
      const {resetCurrentPageData, getUserData, onSubmit} = this
      onSubmit(resetCurrentPageData)

      getUserData()
    },
    // 重置当前页面数据
    resetCurrentPageData(articleId) {
      const {playTypeList, $refs, getArticleDetailData, planPriceList} = this

      // 页面query参数改变时，参数重置
      this.formParams = {
        playType: playTypeList[0].id,
        price: planPriceList[0].value,
        grantee: 0,
        title: null
      }

      this.matchSelectList = []
      this.playSelectObj = {}
      $refs.editor.clear()

      this.articleId = articleId
      getArticleDetailData()
    },
    // 不中包退选择
    onGranteeHandle() {
      const {formParams} = this
      const {price, grantee} = formParams
      if (!price) return false

      this.$set(formParams, 'grantee', +!grantee)
    },
    // 敏感词检查 @returns {boolean} true没问题，false有敏感词
    checkSensitiveHandler(sensitiveWordList = []) {
      const {$refs} = this

      const tagStr = 'font'
      const tagAttrStr = 'data-word'
      const text = $refs.editor.getText()
      // 没有内容不检查
      if (!text) return true

      // 之前可能标记了敏感词，先将他们清理掉
      let html = $refs.editor.getHtml()
      const clearReg = new RegExp(`<${tagStr} ${tagAttrStr}="true">(.*?)</${tagStr}>`, 'ig')

      html = html.replace(clearReg, '$1')
      $refs.editor.setHtml(html)

      // 没有敏感词不检查
      if (!sensitiveWordList.length) return true
      let isHasSensitive = false

      for (let i = 0, length = sensitiveWordList.length; i < length; i += 1) {
        // eslint-disable-next-line
        const word = sensitiveWordList[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

        html = html.replace(new RegExp(word, 'g'), () => {
          if (!isHasSensitive) isHasSensitive = true
          return `<${tagStr} ${tagAttrStr}="true">${word}</${tagStr}>`
        })
      }
      $refs.editor.setHtml(html)

      return !isHasSensitive
    },
    // 检查标题敏感词 @returns 有就返回html字符串，没有就返回null
    checkTitleSensitiveHandler(sensitiveWordList) {
      const {formParams} = this
      const {title} = formParams
      // 没有敏感词不检查
      if (!title || !sensitiveWordList.length) return null
      let result = null
      let flag = false
      for (let i = 0, length = sensitiveWordList.length; i < length; i += 1) {
        const word = sensitiveWordList[i]
        result = title.replace(new RegExp(word, 'g'), () => {
          if (!flag) flag = true
          return `<span style="color: #fff;background: #FF5338;">${word}</span>`
        })
      }
      return flag && result
    },
    // 验证表单数据，返回false不通过和true通过
    validFormData() {
      const {
        $refs,
        currentMatchesListByPlayId,
        playSelectObj,
        getSelectObjKey,
        formParams
      } = this
      const {title} = formParams
      // 验证赛事
      if (!currentMatchesListByPlayId.length) {
        ToastInstance('赛事没有选择')
        return false
      }
      // 验证赛事赔率选择
      const selectValid = currentMatchesListByPlayId.every(({matchId, playType}) => {
        const selectKey = getSelectObjKey(matchId, playType)
        const {selectIndex = []} = playSelectObj[selectKey] || {}
        const selectIndexLength = selectIndex.length
        return !!selectIndexLength
      })
      if (!selectValid) {
        ToastInstance('请选择推荐选项')
        return false
      }
      // 验证标题
      if (!title) {
        ToastInstance('请输入标题')
        return false
      }
      if (title.length < 10 || title.length > 30) {
        ToastInstance('标题字数限制10-30字')
        return false
      }
      // 验证内容
      if ($refs.editor.isEmpty()) {
        ToastInstance('请输入内容')
        return false
      }
      let contentLen = $refs.editor.getText().replace(/(?:&nbsp;)|\s/g, '').length
      if (contentLen < 100) {
        ToastInstance('文章内容字数不少于100字')
        return false
      }

      return true
    },
    // 组装表单数据
    getFormData() {
      const {
        $refs,
        articleId,
        userId,
        formParams,
        currentMatchesListByPlayId,
        getSelectObjKey,
        playSelectObj,
        checkSensitiveHandler,
        currentSportId,
        currentGrantee
      } = this
      const {price, title, playType} = formParams

      // 清理敏感词
      checkSensitiveHandler()

      return {
        userId,
        planId: articleId,
        price,
        grantee: currentGrantee,
        title,
        content: $refs.editor.getHtml(),
        sportId: currentSportId,
        playType,
        matches: currentMatchesListByPlayId.map(({matchId, games = []}) => {
          const selectKey = getSelectObjKey(matchId, playType)
          const {index, selectIndex = []} = playSelectObj[selectKey] || {}

          return {
            matchId,
            index,
            ratios: (games.find(row => row.index === index) || {}).ratios || [],
            recommendIndexes: selectIndex.join(',')
          }
        })
      }
    },
    // 组装预览/草稿数据
    getFormDataOfDraft() {
      const {
        $refs,
        formParams,
        currentMatchesListByPlayId,
        getSelectObjKey,
        playSelectObj,
        articleId,
        playTypeList,
        checkSensitiveHandler,
        currentSportId,
        currentGrantee,
        isLotteryType
      } = this
      const {title, playType, price} = formParams

      // 清理敏感词
      checkSensitiveHandler()

      return {
        sportId: currentSportId,
        planId: articleId,
        price,
        grantee: currentGrantee,
        title,
        content: $refs.editor.getHtml(),
        playTypeId: playType,
        playTypeName: (playTypeList.find(({id}) => id === playType) || {}).name,
        trades: currentMatchesListByPlayId.map(row => {
          const {
            homeId,
            homeName,
            homeLogo,
            guestId,
            guestName,
            guestLogo,
            matchId,
            matchTime,
            leagueName,
            games = []
          } = row
          const selectKey = getSelectObjKey(matchId, playType)
          const {index, selectIndex = []} = playSelectObj[selectKey] || {}
          return {
            homeId,
            homeName,
            homeLogo,
            guestId,
            guestName,
            guestLogo,
            matchId,
            matchTime,
            leagueName,
            index,
            ratios: ((games.find(row => row.index === index) || {}).ratios || []).join(';'),
            recommendIndex: selectIndex.join(';'),
            games
          }
        })
      }
    },
    // 预览
    onPublishPreview() {
      const {validFormData, getFormDataOfDraft} = this
      if (!validFormData()) return false

      PreviewInstance(getFormDataOfDraft())
    },
    //存为草稿
    async onPublishDraft() {
      const {sendSuccessLinkPush, $refs, getFormDataOfDraft, formParams} = this
      const {title} = formParams
      // 验证标题
      if (!title) return ToastInstance('请输入标题')
      // 验证内容
      if ($refs.editor.isEmpty()) return ToastInstance('请输入内容')

      // await ProfessorService.publishArticleOfDraft(getFormDataOfDraft())

      ToastInstance('已存为草稿，可在文章管理中查看')

      sendSuccessLinkPush()
    },
    // 发布文章
    async onPublishSubmit() {
      const {
        $judgeCode,
        $createElement,
        sendSuccessLinkPush,
        validFormData,
        getFormData,
        checkSensitiveHandler,
        checkTitleSensitiveHandler
      } = this
      if (!validFormData()) return false

      this.loading = true
      try {
        const {data: {code, msg, data}} = await ProfessorService.publishArticle(getFormData()).toPromise()

        if (!$judgeCode(code)) {
          if (data) {
            return setTimeout(() => {
              // 延迟100毫秒，因为两个弹框会有阴影问题
              let {hasSensitive, contexts = [], data: rData} = data || {}
              if (rData) {
                hasSensitive = rData.hasSensitive
                contexts = rData.sensitives || []
              }
              if (hasSensitive && contexts.length) {
                // data有值说明是敏感词
                // 验证标题中是否有敏感词
                const htmlStr = checkTitleSensitiveHandler(contexts)
                let confirmText = $createElement('p', null, msg || '查询到文章中含有敏感词已为你标红，请修改后重新提交')
                if (htmlStr) {
                  confirmText = $createElement('div', {style: {margin: '0 -36px -10px', textAlign: 'left'}}, [
                    confirmText,
                    $createElement('p', {
                      style: {marginTop: '14px'},
                      domProps: {
                        innerHTML: `标题：${htmlStr}`
                      }
                    })
                  ])
                }
                ModalInstance.confirm({
                  title: htmlStr ? '提示' : null,
                  text: confirmText
                })
                checkSensitiveHandler(contexts)
              }
            }, 600)
          }
          return ToastInstance(msg || '发布失败')
        }

        ToastInstance('发布成功')

        sendSuccessLinkPush()
      } catch (e) {
        ToastInstance('发布失败')
      } finally {
        this.loading = false
      }
    },
    // 获取选择的赛事key
    getSelectObjKey(matchId, playType) {
      return `${matchId}+${playType}`
    },
    // 玩法选择
    onPlaySelect({indexVal: pIndex, recommendIndex: index, value}, {matchId, playType}) {
      const {playSelectObj, isLotteryType, planRatioLimit, isFootballType, isBasketballType, getSelectObjKey} = this
      const {singleLimit, doubleLimit} = planRatioLimit

      const selectObjKey = getSelectObjKey(matchId, playType)
      const {index: parentIndex, selectIndex = [], selectValue = []} = playSelectObj[selectObjKey] || {}
      const selectIndexLength = selectIndex.length

      const setSelectData = (i, valList) => this.$set(this.playSelectObj, selectObjKey, {
        index: pIndex,
        selectIndex: i,
        selectValue: valList
      })

      const indexOf = selectIndex.indexOf(index)
      const isInclude = indexOf !== -1

      if (isLotteryType && selectIndexLength < 2 && parentIndex === pIndex) {
        // 单选赔率限制(验证有没有值有值就是双选限制)
        if (selectIndexLength && isFootballType) {
          // 多选
          if (!isInclude && selectValue.concat([value]).some(row => row < doubleLimit)) return ToastInstance(`双选赔率需大于等于${doubleLimit}`)
        }
      }
      if (isLotteryType && parentIndex !== pIndex) {
        if (value < singleLimit) return ToastInstance(`单选赔率需大于等于${singleLimit}`)
      }

      // 竞彩足球可以选择两 其他只能单选也就是选择一个
      if (!isLotteryType || isBasketballType || parentIndex !== pIndex) return setSelectData([index], [value])

      // 竞彩选择了2个后在选择就提示
      if (!isInclude) {
        if (selectIndexLength >= 2) return ToastInstance('竞彩同一种玩法最多只能选择两项！')
        selectIndex.push(index)
        selectValue.push(value)
      } else {
        //包含
        selectIndex.splice(indexOf, 1)
        selectValue.splice(indexOf, 1)
      }

      setSelectData(selectIndex, selectValue)
    },
    // 选择赛事
    onSelectMatch() {
      const {
        userId,
        matchSelectList,
        currentMatchesListByPlayId,
        formParams,
        isLotteryType,
        planRatioLimit,
        isFootballType,
        isBasketballType
      } = this
      const {playType} = formParams
      const {singleLimit, doubleLimit} = planRatioLimit

      const selectLength = currentMatchesListByPlayId.length
      // 竞彩可以选择两项，其他只能选择一项
      if (selectLength) {
        if (isLotteryType) {
          if (selectLength >= 2) return ToastInstance('同一种玩法最多只能选择两项！')
        } else {
          return ToastInstance('当前玩法只能选择一场比赛！')
        }
      }
      let tipsLabel = null
      if (isLotteryType) {
        const singleLabel = `单选赔率需大于等于${singleLimit}`
        const doubleLabel = `双选时2个选项的赔率都必须大于等于${doubleLimit}`
        if (isFootballType) tipsLabel = `${singleLabel} ${doubleLabel}`
        if (isBasketballType) tipsLabel = singleLabel
      }
      MatchModal({
        userId,
        playType,
        tipsLabel,
        activeIds: currentMatchesListByPlayId.map(({matchId}) => matchId),
        onConfirm: list => {
          console.log('list', list)
          let rList = matchSelectList.concat(list)
          if (isLotteryType && currentMatchesListByPlayId.length && list.length === 2) {
            // 如果之前已经选择了一个然后再次选择了两个就直接替换
            rList = list
          }
          // 将数组合并并且去重(根据matchId和playType去重，因为可能一个赛事有两种玩法类型)
          this.matchSelectList = unionWith(rList, (arrVal, othVal) => arrVal.matchId === othVal.matchId && arrVal.playType === othVal.playType)
        }
      })
    },
    // 根据id删除选择的赛事
    onDeleteSelectMatchById(id) {
      const {matchSelectList} = this
      const index = matchSelectList.findIndex(({matchId}) => matchId === id)
      if (index !== -1) this.matchSelectList.splice(index, 1)
    },
    // 获取页面数据
    async getPageData() {
      const {getPlayTypeData, getUserData, getPlanRatioLimitData, getArticleDetailData} = this

      this.loading = true
      try {
        await getUserData().then(getPlayTypeData).then(getPlanRatioLimitData).then(getArticleDetailData)
      } finally {
        this.loading = false
      }
    },
    // 获取用户信息
    async getUserData() {
      const {$judgeCode, userId} = this
      try {
        const {data: {data = {}, code, msg}} = await ProfessorService.getUserInfos(userId).toPromise()
        if (!$judgeCode(code)) return ToastInstance(msg || '获取失败')

        this.userDataInfos = data
      } catch (e) {
        ToastInstance('获取失败')
      }
    },
    // 获取玩法类型
    async getPlayTypeData() {
      const {$judgeCode} = this
      try {
        const {data: {data, code, msg}} = await ProfessorService.getPlayTypes().toPromise()

        if (!$judgeCode(code)) return ToastInstance(msg || '获取失败')

        const playTypeList = data || []
        this.playTypeList = playTypeList
        // 默认竞彩足球
        this.$set(this.formParams, 'playType', playTypeList[0].id)
      } catch (e) {
        ToastInstance('获取失败')
      }
    },
    // 获取赔率单选和双选的限制
    async getPlanRatioLimitData() {
      const {$judgeCode} = this
      try {
        const {data: {data = {}, code, msg}} = await ProfessorService.getPlanRatioLimit().toPromise()
        if (!$judgeCode(code)) return ToastInstance(msg || '获取失败')

        this.planRatioLimit = data
      } catch (e) {
        ToastInstance('获取失败')
      }
    },
    // 编辑获取文章详情
    async getArticleDetailData() {
      const {$refs, articleId, userId, playTypeList, $judgeCode, getArticleDetailTradesData} = this
      if (!articleId) return false

      try {
        const {data: {data, code, msg}} = await ProfessorService.getArticleDetail({
          userId,
          planId: articleId
        }).toPromise()
        if (!$judgeCode(code)) return ToastInstance(msg || '获取失败')

        const setQueryData = (f, v) => this.$set(this.formParams, f, v)

        const {
          playTypeId = playTypeList[0].id,
          title,
          sportId,
          price = 0,
          grantee = 0,
          trades = [],
          content
        } = data || {}

        //标题
        setQueryData('title', title)
        // 类型
        setQueryData('playType', playTypeId)
        // 价格
        setQueryData('price', price)
        // 不中包退
        setQueryData('grantee', grantee)
        // 内容
        $refs.editor.setHtml(content)

        getArticleDetailTradesData(trades, sportId, playTypeId)
      } catch (e) {
        ToastInstance('获取失败')
      }
    },
    // 获取详情的交易数据
    async getArticleDetailTradesData(trades = [], sportId, playType) {
      const {getSelectObjKey} = this
      if (!trades.length) return false
      const isLottery = playType === 1 || playType === 4
      const indexFormat = v => String(Number.parseFloat(v))

      this.matchSelectList = trades.map(row => {
        const {games = [], index} = row
        let indexVal = indexFormat(index)
        // 竞彩盘口取反
        if (isLottery) indexVal = indexFormat(index)

        // 设置选中
        const selectIndex = row.recommendIndex.split(';').map(row => Number.parseInt(row))
        let selectValue = []
        const gamesLength = games.length
        games.forEach(gameRow => {
          if (gamesLength === 1 || indexFormat(gameRow.index) === indexVal) {
            // 只有一个的话就直接取game中的盘口
            if (gamesLength === 1) indexVal = indexFormat(gameRow.index)

            let ratiosList = gameRow.ratios || []
            if (ratiosList.length === 2) ratiosList = [ratiosList[0], undefined, ratiosList[1]]
            ratiosList.forEach((raRow, raIndex) => {
              if (selectIndex.includes(raIndex + 1)) selectValue.push(raRow)
            })
          }
        })

        const selectObjKey = getSelectObjKey(row.matchId, playType)
        if (selectValue.length) this.$set(this.playSelectObj, selectObjKey, {
          index: indexVal,
          selectIndex,
          selectValue
        })
        return {
          games,
          guestId: row.guestId,
          guestLogo: row.guestLogo,
          guestName: row.guestName,
          homeId: row.homeId,
          homeLogo: row.homeLogo,
          homeName: row.homeName,
          leagueName: row.leagueName,
          matchId: row.matchId,
          matchTime: row.matchTime,
          sportId,
          playType
        }
      })
    }
  }
}
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>
@import "../style/iview";

.page-publish {
  position: relative;
  padding-bottom: 30px;
  overflow: hidden;

  .margin-content {
    margin: 0 43px;
  }

  .is-hover-font-bold {
    &:hover {
      font-weight: bold !important;
    }
  }

  .is-golden-hover-background {
    &:hover {
      //background: #eec383 !important;
    }
  }

  .type-container {
    margin-top: 6px;
    display: flex;
    border-bottom: 1px solid #D8DCE7;

    .type-item {
      position: relative;
      margin-right: 66px;
      height: 48px;
      line-height: 48px;
      font-size: 18px;
      color: #363636;

      &:hover, &.is-active {
        color: $textColor;

        &:before {
          content: '';
          position: absolute;
          left: 0;
          bottom: -1px;
          width: 100%;
          height: 1px;
          background-color: $textColor;
        }
      }
    }
  }

  .button-container {
    $height: 44px;

    padding: 0 43px;
    margin-top: 32px;
    display: flex;
    height: $height;
    align-items: center;
    box-sizing: border-box;

    .select-match {
      width: 98px;
      height: $height;
      line-height: $height;
      font-size: 16px;
      color: #fff;
      text-align: center;
      background: $buttonActiveBackground;
      border-radius: 6px;

      .select-icon {
        font-size: 16px;
      }
    }

    .publish-tips {
      flex: 1;
      font-size: 14px;
      color: #5F5F5F;
      text-align: right;

      .is-active {
        color: $textColor;
      }
    }

    .publish-button {
      margin-left: 2px;
      display: flex;
      height: 100%;
      align-items: center;

      .button-item {
        margin-left: 16px;
        padding: 0 12px;
        height: 27px;
        line-height: 27px;
        font-size: 14px;
        color: #91A0CE;
        border-radius: 2px;
        border: 1px solid #91A0CE;
        box-sizing: border-box;

        &.is-publish {
          border: none;
          color: #fff;
          background: $buttonActiveBackground;

          .button-label {
            background-image: url("../images/publish_icon.png");
          }
        }

        &.is-preview {
          .button-label {
            background-image: url("../images/preview_icon.png");
          }
        }

        .button-label {
          padding-left: 20px;
          background-repeat: no-repeat;
          background-position: left center;
          background-size: 14px auto;
        }
      }
    }
  }

  .stickTop {
    position: fixed;
    width: 988px;
    height: 56px;
    z-index: 999;
    padding: 0 43px;
    top: 60px;
    margin: 0;
    background-color: #fff;
    border-bottom: 1px solid #E6EAF3;
    border-top: 1px solid #E6EAF3;
  }

  .match-container {
    margin-top: 20px;

    .match-item {
      margin-top: 10px;
    }
  }

  .publish-editor {
    margin-top: 20px;
    margin-left: 43px;
    margin-right: 43px;
    border-radius: 6px 6px 0px 0px;
    border: 1px solid #D8DCE7;
    overflow: hidden;

    /deep/ {
      .editor-toolbar {
        padding: 11px 20px 8px 20px;
        background-color: #F4F5F7;
      }

      .ivu-input {
        padding: 0;
        font-size: 22px;
        color: #14162C;
        border: none !important;

        &::placeholder {
          color: #949BB1;
        }
      }

      .editor-warp {
        font-size: 14px;
        line-height: 22px;
        color: #14162C;
        word-break: break-all;

        .editor-placeholder, .w-e-text {
          padding: 0 20px;
          padding-bottom: 10px;
        }

        /*敏感词样式*/
        font[data-word="true"] {
          background-color: #FF5338;
          color: #fff;
        }

        .text-content {
          height: 88%;
        }
      }
    }

    .publish-editor-title {
      margin-bottom: 15px;
      padding: 0 20px;
      display: flex;
      height: 64px;
      align-items: center;
      border-bottom: 1px solid #E6EAF3;
      position: relative;

      .title-input {
        flex: 1;
        overflow: hidden;
      }

      .title-limit {
        margin-left: 20px;
        font-size: 14px;
        color: #C2C9DC;
      }

      .context-limit {
        font-size: 12px;
        color: #949BB1;
        position: absolute;
        right: 20px;
        bottom: -270px;
      }
    }
  }

  .plan-container {
    display: flex;
    font-size: 16px;
    color: #434A66;
    align-items: center;

    .plan-label {
      margin-top: 30px;
      margin-right: 2px;
    }

    .plan-item {
      margin-top: 30px;
      margin-left: 20px;
      width: 145px;
      height: 46px;
      line-height: 46px;
      font-size: inherit;
      color: inherit;
      text-align: center;
      border-radius: 3px;
      border: 1px solid #D8DCE7;
      overflow: hidden;

      &:hover, &.is-active {
        color: $textColor;
        border-color: $textColor;
      }

      &.is-active {
        position: relative;

        &:before {
          content: '';
          position: absolute;
          right: 0;
          bottom: 0;
          width: 25px;
          height: 22px;
          background: url("../images/select_icon.png") no-repeat right bottom;
          background-size: 100% 100%;
        }
      }
    }
  }

  .radio-container {
    margin-top: 24px;
    display: flex;
    align-items: center;

    .radio-title {
      font-size: 14px;
      color: #14162C;
    }

    .radio-wrap {
      display: flex;
      align-items: center;
      margin-left: 22px;
      height: 22px;

      &.is-disabled {
        .radio-inner {
          border-color: #E6EAF3;

          &.is-active {
            &:before {
              background-color: #E6EAF3;
            }
          }
        }

        .radio-label {
          color: #949BB1;
        }
      }
    }

    .radio-inner {
      width: 16px;
      height: 16px;
      border: 1px solid #b7babf;
      border-radius: 8px;

      &.is-active {
        position: relative;
        border-color: #CE995B;

        &:before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 9px;
          height: 9px;
          background-color: #CE995B;
          border-radius: 4.5px;
          transform: translate3d(-50%, -50%, 0);
        }
      }
    }

    .radio-label {
      margin-left: 3px;
      font-size: 14px;
      color: #434A66;
    }

    .radio-tips {
      margin-left: 10px;
      font-size: 12px;
      color: #76809C;
    }
  }
}
</style>