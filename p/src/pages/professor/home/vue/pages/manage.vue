<template>
  <div class="content-container">
    <div class="query-form">
      <div class="form-item">
        <!-- <label class="form-label">类型：</label> -->
        <div class="form-content">
          <div
            v-for="(row, index) in [{l:'全部',v:null},{l:'足球',v:1},{l:'篮球',v:2}]"
            :key="index"
            class="type-item"
            :class="{active: queryParams.sportType === row.v}"
            @click="$set(queryParams, 'sportType', row.v)"
            v-text="row.l"
          />
        </div>
      </div>
      <div class="form-item">
        <label class="form-label">日期：</label>
        <div class="form-content pro-iview">
          <DatePicker
            class="query-form-date"
            :value="getQueryDate"
            format="yyyy-MM-dd"
            type="daterange"
            :editable="false"
            separator=" 至 "
            placement="bottom-end"
            :confirm="false"
            placeholder="请选择时间"
            @on-change="onDateChange"
          />
          <div
            class="query-button"
            type="default"
            @click="onSearch"
          >
            查询
          </div>
        </div>
      </div>
    </div>
    <div class="query-inline">
      <div class="inline-tab fl">
        <div
          v-for="(row, index) in exStatusData"
          :key="`exStatus_item_${index}`"
          class="tab-item"
          :class="{active: row.value === queryParams.exStatus}"
          @click="onTabsHandler(row.value)"
          v-text="row.label"
        />
      </div>
      <div class="order-right fr">
        <ul>
          <li
            v-for="(row, index) in orderDataArr"
            :key="`order_item_${index}`"
            class="order-item fl"
            @click.stop="onSetOrder(row)"
          >
            <span
              class="fl"
              v-text="row.label"
            />
            <span class="caret-wrapper fl">
              <i
                class="caret-icon top"
                :class="{active: getOrderActive(row, 1)}"
                @click.stop="onSetOrder(row, 1)"
              />
              <i
                class="caret-icon bottom"
                :class="{active: getOrderActive(row, 0)}"
                @click.stop="onSetOrder(row, 0)"
              />
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="content-box">
      <ul v-if="data.list && data.list.length">
        <li
          v-for="(row, index) in data.list"
          :key="`content_item_${queryParams.exStatus}_${index}`"
          class="content-item"
          @click="preview(row)"
        >
          <img
            v-if="queryParams.exStatus == 1 && row.isWalking == 1"
            class="result-logo"
            :src="require('../images/walk.png').default"
          >
          <img
            v-else-if="queryParams.exStatus == 1 && row.hitStatus == 1"
            class="result-logo"
            :src="require('../images/win.png').default"
          >
          <img
            v-else-if="queryParams.exStatus == 1 && row.hitStatus == 2"
            class="result-logo"
            :src="require('../images/loss.png').default"
          >
          <img
            v-else-if="queryParams.exStatus == 1 && row.hitStatus == 3"
            class="result-logo is-cancel"
            :src="require('../images/match_cancel.png').default"
          >
          <div class="row-contributor">
            <p
              class="row-title"
            >
              <img
                v-if="row.guarantee == 1"
                style="marginRight: 6px; position: relative; top: -1px;"
                :src="require('../images/return.png').default"
              >
              {{ row.title }}
            </p>
            <div
              v-for="(team, teamIndex) in row.expertTeams"
              :key="teamIndex"
              class="row-meta"
            >
              <div
                class="row-channel"
                v-text="`【${row.lotteryClassName}】${team.leagueName}`"
              />
              <div
                class="row-teamname"
              >
                {{
                  team.sportType === 1 ? `${team.homeTeamName} VS ${team.guestTeamName}` : `${team.guestTeamName} VS ${team.homeTeamName}`
                }}
              </div>
              <div
                class="row-time"
              >
                {{ team.matchTime | dateFormatter }}
              </div>
            </div>
            <div class="row-count">
              <div class="count-item fl diamond">
                <span v-if="row.price != 0">{{ row.price }}金币</span>
                <span v-else>免费</span>
              </div>
              <div class="count-item fl">
                <span>阅读：</span>
                <span v-text="row.hitsNum || 0"/>
              </div>
              <div class="count-item fl">
                <span>购买：</span>
                <span v-text="row.purchaseNum || 0"/>
              </div>
              <div class="count-item fl">
                <span>销售额：</span>
                <span v-text="row.saleVolume || 0"/>
              </div>
              <div class="count-item fr publish-time">
                <span>{{ row.publishTime | dateFormatter2 }} 发布</span>
              </div>
            </div>
          </div>
          <!-- 1：已发布, 100：在售，0：待审核, 2：未通过， -4：已撤回  ，草稿在本地-->
          <!--按钮(已发布：没有，审核中：撤回，未通过：编辑和删除，草稿：编辑和删除)-->
          <div
            v-if="+queryParams.exStatus !== 1 && +queryParams.exStatus !== 100"
            class="row-buttons"
          >
            <template v-if="+queryParams.exStatus === 0">
              <!-- <Button
                type="cancel"
                :loading="handleLoading.rollbackLoading"
                @click.stop="onRollback(row)"
              >
                撤回
              </Button>-->
            </template>
            <template v-else>
              <Button
                type="cancel"
                @click.stop="onEditor(row)"
              >
                编辑
              </Button>
              <Button
                type="cancel"
                :loading="handleLoading.deleteLoading"
                @click.stop="onDelete(row)"
              >
                删除
              </Button>
            </template>
          </div>
        </li>
      </ul>
      <div
        v-else
        class="no-data"
      >
        <p>暂无数据</p>
      </div>
      <Spin
        v-if="data.loading"
        size="large"
        fix
      />
    </div>
    <Page
      v-if="data.total"
      align="center"
      :current.sync="queryParams.page"
      :page-size="queryParams.size"
      :total="data.total"
      @on-change="getPageData"
    />
  </div>
</template>
<script type="text/javascript">
import {DatePicker, Spin} from 'iview'
import 'iview/dist/styles/iview.css'
import dayJs from 'dayjs'
import * as ProfessorService from '@/servers/professor'
import Page from '../components/page'
import Button from '../components/button'
import Modal from '../../plugins/modal'
import PreviewUtil from '../plugins/preview'
import $warning from '../../plugins/toast'
import {HttpCode} from "@/enums";

// 默认的排序 0 desc 降序 1 asc 升序
const DEFAULT_ORDER_TYPE = 1

export default {
  props: {
    userId: null,
    history: {
      type: Object,
      default: {}
    }
  },
  filters: {
    dateFormatter(dataStr) {
      const diffDate = dayJs(dataStr)
      const formatDate = diffDate.format('MM-DD HH:mm')
      return formatDate
    },
    dateFormatter2(dataStr) {
      const diffDate = dayJs(dataStr)
      const formatDate = diffDate.format('YYYY-MM-DD HH:mm:ss')
      return formatDate
    }
  },
  components: {
    Button,
    DatePicker,
    Page,
    Spin
  },
  data() {
    return {
      queryParams: {
        expertId: null,
        page: 1,
        size: 15,
        // null: 全部，1：足球，2：篮球
        sportType: null,

        startTime: null,
        endTime: null,
        // 1：已发布, 100：在售，0：待审核, 2：未通过， -4：已撤回  ，草稿在本地
        exStatus: 1,
        //0 :时间,1: 阅读,2：购买 3:销售额
        sortType: 0,
        //0 desc 降序 1 asc 升序
        sortType2: DEFAULT_ORDER_TYPE
      },
      data: {
        total: 0,
        loading: false,
        list: []
      },
      channelData: [],
      exStatusData: [{
        label: '已发布',
        value: 1
      }, {
        label: '在售',
        value: 100
      }, {
        label: '审核中',
        value: 0
      }, {
        label: '未通过',
        value: 2
      }, {
        label: '已撤回',
        value: -4
        // }, {
        //   label: '草稿',
        //   value: 6
      }],
      orderDataArr: [{
        label: '时间',
        value: 0
      }, {
        label: '阅读',
        value: 1
      }, {
        label: '购买',
        value: 2
      }, {
        label: '销售额',
        value: 3
      }],
      // 操作的loading对象
      handleLoading: {}
    }
  },
  computed: {
    getQueryDate() {
      const {startTime, endTime} = this.queryParams
      return !startTime || !endTime
        ? null
        : [startTime, endTime]
    }
  },
  beforeMount() {
    this.getExpertId().then(() => {
      this.getPageData()
    })
  },
  mounted() {
    this.$watch('queryParams.sportType', () => {
      this.getPageData()
    })
  },
  methods: {
    $judgeCode(code) {
      return HttpCode.SUCCESS === code
    },
    //预览
    async preview(row) {
      let data = await this.getDetail(row.planId)

      return PreviewUtil(data)
    },
    // 获取方案详情
    async getDetail(planId) {
      const {$judgeCode, userId} = this
      let params = {
        userId,
        planId
      }
      let {data: {code, msg, data}} = await ProfessorService.getArticleDetail(params).toPromise()
      if (!$judgeCode(code)) return $warning(msg)
      return data
    },
    //修改文章状态
    async updateArticleStatus(planId, updateStatus, loadingField) {
      const {$judgeCode, getPageData, queryParams, userId} = this
      if (!planId) return false
      if (loadingField) this.$set(this.handleLoading, loadingField, true)
      let params = {
        expertId: queryParams.expertId,
        userId: userId,
        planId: planId,
        status: updateStatus
      }
      try {
        const {data: {code, msg}} = await ProfessorService.updatePlanStatus(params).toPromise()
        if (!$judgeCode(code)) $warning(msg)

        getPageData()
      } catch (e) {
        $warning(e)
        console.log(e)
      } finally {
        this.$delete(this.handleLoading, loadingField)
      }
    },
    // 撤回
    onRollback(row) {
      Modal.confirm({
        text: '文章正在审核中，确定要撤回吗？',
        onConfirm: () => {
          this.updateArticleStatus(row.planId, -4, 'rollbackLoading')
        }
      })
    },
    //编辑
    onEditor(row) {
      this.history.push(`/professor/home/publish?articleId=${row.planId}`)
    },
    //删除
    onDelete(row) {
      Modal.confirm({
        text: '确定要删除该文章吗？',
        onConfirm: () => {
          this.updateArticleStatus(row.planId, -2, 'deleteLoading')
        }
      })
    },
    // 设置排序
    onSetOrder(row, order) {
      const {onSearch, queryParams} = this
      const {sortType2, sortType} = queryParams
      const setData = (f, v) => this.$set(this.queryParams, f, v)
      const isEmpty = val => typeof val === 'undefined' || val === null

      if (sortType === row.value && sortType2 === order) return false

      if (isEmpty(order)) {
        // 没有指定就按照顺序来，1-0-undefined
        if (row.value === sortType && sortType2 === 0) {
          this.$delete(this.queryParams, 'sortType')
          this.$delete(this.queryParams, 'sortType2')
        } else if (row.value === sortType && sortType2 === DEFAULT_ORDER_TYPE) {
          setData('sortType2', +!DEFAULT_ORDER_TYPE)
          setData('sortType', row.value)
        } else {
          setData('sortType2', DEFAULT_ORDER_TYPE)
          setData('sortType', row.value)
        }
      } else {
        // 如果指定了排序就直接赋值了
        setData('sortType', row.value)
        setData('sortType2', order)
      }

      onSearch()
    },
    // 获取排序选中状态
    getOrderActive(row, order) {
      const {sortType, sortType2} = this.queryParams
      if (row.value === sortType && sortType2 === order) return true
      return false
    },
    // 根据userId 获取 专家ID
    async getExpertId() {
      let timer = null
      await new Promise((resolve) => {
        timer = setInterval(() => {
          if (this.userId) {
            clearInterval(timer)
            resolve()
          }
        }, 100)
      })
      const {$judgeCode, userId} = this
      let {data: {code, msg, data}} = await ProfessorService.getUserInfos(userId).toPromise()
      if (!$judgeCode(code)) return $warning(msg)
      this.queryParams.expertId = data.expertId
    },
    //获取数据
    async getPageData() {
      const {queryParams, $judgeCode} = this

      this.data.loading = true
      try {
        // queryParams.exStatus === 6表示草稿
        const {data: {code, msg, data, total}} = await ProfessorService.getProfessorPlans(queryParams).toPromise()
        if (!$judgeCode(code)) return $warning(msg)
        this.data.total = total || data.length
        // 草稿的数据需要转换一下
        if (queryParams.exStatus === 6) {
          this.data.list = data.map(item => {
            return {
              planId: item.planId,
              guarantee: 0,
              title: item.title,
              lotteryClassName: item.playTypeName,
              expertTeams: item.trades.map(item => {
                return {
                  leagueName: item.leagueName,
                  homeTeamName: item.homeName,
                  guestTeamName: item.guestName,
                  matchTime: item.matchTime
                }
              }),
              price: 0,
              hitsNum: 0,
              purchaseNum: 0,
              saleVolume: 0
            }
          })
        } else {
          this.data.list = data
        }
      } catch (e) {
        $warning(e)
      } finally {
        this.data.loading = false
      }
    },
    //时间选择回调
    onDateChange(dateArr) {
      const setQueryData = (f, v) => this.$set(this.queryParams, f, v)
      dateArr = dateArr || []
      setQueryData('startTime', dateArr[0])
      setQueryData('endTime', dateArr[1])
    },
    //tabs点击回调
    onTabsHandler(name) {
      const exStatus = this.queryParams.exStatus
      if (exStatus === name) return false
      this.$set(this.queryParams, 'exStatus', name)
      this.onSearch()
    },
    // 每页显示数量改变的时候
    onPageSizeChange() {
      this.resetPage()
      this.getPageData()
    },
    // 搜索
    onSearch() {
      this.onPageSizeChange()
    },
    // 设置当前页
    resetPage(page = 1) {
      this.$set(this.queryParams, 'page', page)
    }
  }
}
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>
@import '../style/iview';

.fl {
  float: left;
}

.fr {
  float: right;
}

.content-container {
  margin-top: 4px;

  .query-form {
    position: relative;
    padding: 14px 0;
    margin: 0 43px;
    display: flex;
    height: 32px;
    align-items: center;
    justify-content: space-between;
    box-sizing: content-box;
    border-bottom: 1px solid #D8DCE7;

    .form-item {
      display: flex;
      align-items: center;
    }

    .form-label {
      font-size: 14px;
      color: #434A66;
    }

    .form-content {
      display: flex;
      align-items: center;
    }

    .type-item {
      position: relative;
      margin-left: 66px;
      padding: 0 8px;
      height: 22px;
      line-height: 22px;
      font-size: 18px;
      color: #363636;
      box-sizing: content-box;
      cursor: pointer;

      &:first-child {
        margin-left: 0;
      }

      &.active, &:hover {
        color: $textColor;

        &:before {
          content: '';
          position: absolute;
          left: 0;
          bottom: -20px;
          width: 100%;
          height: 1px;
          background-color: $textColor;
        }
      }
    }

    /deep/ {
      .query-form-date {
        width: 240px;

        .ivu-input-suffix > i {
          line-height: 26px;
        }

        .ivu-input {
          cursor: pointer;
          height: 26px !important;
          border-color: #D3D8E4 !important;
        }
      }

      .query-form-channel {
        width: 200px;
        height: 32px;
      }

      .query-form-date .ivu-input, .query-form-channel .ivu-input {
        padding-left: 10px;
        height: 32px;
        color: #434A66;
        font-size: 14px;
        border: 1px solid #E6EAF3;
        border-radius: 6px;
      }
    }

    .query-button {
      margin-left: 10px;
      font-size: 12px;
      color: $textColor;
      text-align: center;
      width: 48px;
      height: 26px;
      line-height: 26px;
      border: 1px solid $textColor;
      border-radius: 6px;
      box-sizing: border-box;
      cursor: pointer;
    }
  }

  .query-inline {
    margin: 0 43px;
    height: 43px;
    line-height: 43px;
    border-bottom: 1px solid #EBF0FB;
    overflow: hidden;

    .inline-tab {
      overflow: hidden;

      .tab-item {
        position: relative;
        float: left;
        margin-right: 28px;
        color: #76809C;
        font-size: 14px;
        cursor: pointer;

        &:hover {
          color: #434A66;
        }

        &.active {
          color: #434A66;
          font-size: 15px;
          font-weight: 600;
        }
      }
    }
  }

  .order-right {
    overflow: hidden;

    .order-item {
      margin-left: 25px;
      font-size: 12px;
      color: #73809F;
      cursor: pointer;
    }

    .caret-wrapper {
      margin-left: 5px;
      margin-top: 1px;
      position: relative;
      height: 40px;
      width: 16px;
    }

    .caret-icon {
      position: absolute;
      left: 0;
      border: 4px solid transparent;

      &.top {
        top: 10px;
        border-bottom-color: $textColor;

        &.active {
          border-bottom-color: $textColor;
        }
      }

      &.bottom {
        bottom: 11px;
        border-top-color: #A4ABBF;

        &.active {
          border-top-color: $textColor;
        }
      }
    }
  }

  .content-box {
    margin: 0 43px;
    position: relative;
    min-height: 350px;

    .content-item {
      display: flex;
      padding: 18px 0 20px 0;
      border-bottom: 1px solid #F1F1F1;
      overflow: hidden;
      align-items: center;
      position: relative;
      cursor: pointer;

      .result-logo {
        position: absolute;
        right: 4px;
        top: 6px;
        width: 45px;

        &.is-cancel {
          top: -2px;
        }
      }
    }

    .row-contributor {
      flex: 1;
      overflow: hidden;
    }

    .row-title {
      font-size: 17px;
      font-weight: 600;
      color: #434A66;
      margin-bottom: 15px;

      img {
        width: 50px;
      }
    }

    .row-meta {
      display: flex;
      margin-bottom: 7px;
      font-size: 14px;
      padding: 0 25px;
      height: 38px;
      background: rgba(244, 245, 247, 1);
      border-radius: 2px;
      align-items: center;
      justify-content: space-between;

      .row-channel,
      .row-teamname {
        color: #6D6F89;
      }

      .row-time {
        color: #949BB1;
      }
    }

    .row-count {
      margin-top: 15px;
      font-size: 14px;
      color: #434A66;
      overflow: hidden;

      .count-item {
        margin-right: 40px;
      }

      .publish-time {
        margin-right: 0px !important;
        color: #949BB1;
        font-size: 12px;
      }

      .diamond {
        color: $textColor;
        font-weight: 600;
      }
    }

    .row-buttons {
      position: absolute;
      right: 0;
      top: 20px;

      .ivu-btn {
        padding: 0 5px;
        color: #6d6f97;
        font-size: 14px;
        border: none;

        &:hover {
          background: none;
          color: #d09d60;
        }
      }
    }

    .no-data {
      width: 100%;
      min-height: 350px;
      position: relative;

      p {
        width: 60px;
        height: 30px;
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        top: 0;
        margin: auto;
        color: #c5c8ce;
        font-size: 14px;
      }
    }
  }
}

.pro-iview .ivu-date-picker {
  border: 0px solid #E6EAF3 !important;
}
</style>