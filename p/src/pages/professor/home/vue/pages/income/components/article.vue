<template>
  <div class="pro-iview">
    <div class="date-picker-content">
      <span class="picker-label">日期：</span>
      <DatePicker
        v-model="date"
        type="daterange"
        :clearable="false"
        size="small"
        format="yyyy-MM-dd"
        placeholder="请选择日期"
        style="width: 230px"
        placement="bottom-end"
        @on-change="changeDate"
      />
      <span
        type="primary"
        class="query-button"
        @click="changePage(1)"
      >
        查询
      </span>
    </div>
    <div class="income-content">
      <div class="income-item sale">
        <div class="income-inner">
          <div class="income-value" v-text="incomeData.totalActualPrice"/>
          <div class="income-label">销售额（金币）</div>
        </div>
      </div>
      <div class="income-item predict">
        <div class="income-inner">
          <div class="income-value" v-text="incomeData.totalProfitPrice"/>
          <div class="income-label">预计收益（金币）</div>
        </div>
      </div>
    </div>
    <Table
      :data="incomeData.list"
      :columns="tableConfig"
      style="width: 100%;margin-top: 30px;"
      @on-row-click="openDialog"
    >
      <template
        slot="createTimeString"
        slot-scope="{ row: { createTimeString } }"
      >
        <div v-if="createTimeString">
          {{ dayjs(createTimeString).format("YYYY-MM-DD") }}
        </div>
        <div v-if="createTimeString">
          {{ dayjs(createTimeString).format("HH:mm") }}
        </div>
        <span v-else>-</span>
      </template>
      <!--        <template-->
      <!--          slot="matchTimeStringInfo"-->
      <!--          slot-scope="{row:{matchTimeStringInfo}}"-->
      <!--        >-->
      <!--          <div v-if="matchTimeStringInfo">-->
      <!--            <p-->
      <!--              v-for="(time, index) in matchTimeStringInfo.split(';')"-->
      <!--              :key="index"-->
      <!--            >-->
      <!--              {{ dayjs(time).format('YYYY-MM-DD HH:mm') }}-->
      <!--            </p>-->
      <!--          </div>-->
      <!--          <div v-else>-->
      <!--            - -->
      <!--          </div>-->
      <!--        </template>-->
      <template
        slot="guarantee"
        slot-scope="{ row }"
      >
        <span v-if="row.guarantee">不中包退</span>
      </template>
      <template
        slot="hitStatus"
        slot-scope="{ row }"
      >
          <span
            :style="{
              color: ['#ED4113', '#434A66', '#434A66', '#3E7BFF', '#434A66'][
                row.hitStatus
              ],
            }"
            v-text="['未确认', '红', '黑', '比赛取消', '走'][row.hitStatus]"
          />
      </template>
      <template
        slot="caozuo"
        slot-scope="{ row }"
      >
          <span
            class="view"
            @click="openDialog(row)"
          >查看</span>
      </template>
    </Table>
    <Page
      v-if="pages.total > pages.size"
      align="center"
      :total="pages.total"
      :page-size="pages.size"
      :current="pages.page"
      @on-change="changePage"
    />
    <Modal
      v-model="dialogVisible"
      title="收入明细"
      width="902px"
      :footer-hide="true"
      @on-cancel="cancel"
    >
      <div class="pro-iview">
        <div class="dialog-header">
          <div class="header-desc">
            <div class="title">
              {{ dialogData.summary || "-" }}
            </div>
            <div class="match-desc">
              <span>比赛：{{ dialogData.matchHomeAwayInfo || "-" }}</span>
              <span>时间：{{ dialogData.matchTimeStringInfo || "-" }}</span>
              <span>价格：{{ dialogData.price || "0" }}元</span>
              <span>购买数：{{ dialogData.buyCount || "0" }}人</span>
            </div>
          </div>
          <div
            class="status"
            :class="statusImg[dialogData.hitStatus]"
          >
            <img
              :src="
                dialogData.hitStatus
                  ? require(`../../../images/${
                    statusImg[dialogData.hitStatus]
                  }.png`).default
                  : ''
              "
              alt=""
            >
          </div>
        </div>
        <Table
          :data="dialogData.list"
          :columns="detailConfig"
          style="width: 100%"
        >
          <template
            slot="dealTimeString"
            slot-scope="{ row: { dealTimeString } }"
          >
            <span class="deal-time">{{
                dealTimeString
                  ? dayjs(dealTimeString).format("YYYY-MM-DD HH:mm:ss")
                  : "-"
              }}</span>
          </template>
          <template
            slot="hasYhj"
            slot-scope="{ row }"
          >
            <span>{{ ["否", "是"][row.hasYhj] }}</span>
          </template>
          <template
            slot="expertDivide"
            slot-scope="{ row }"
          >
            <span>{{ `${row.expertDivide || 0}%` }}</span>
          </template>
        </Table>
        <Page
          v-if="detailPages.total > detailPages.size"
          class="page pt"
          :total="detailPages.total"
          :page-size="detailPages.size"
          :current="detailPages.page"
          show-total
          show-elevator
          @on-change="changeDetailPage"
        />
      </div>
    </Modal>
  </div>
</template>
<script type="text/javascript">
import {DatePicker, Modal, Table, Tooltip} from 'iview'
import dayjs from 'dayjs'
import Page from '../../../components/page'
import * as ProfessorService from '@/servers/professor'
import {HttpCode} from "@/enums";

export default {
  components: {
    DatePicker,
    Table,
    Page,
    Modal,
    Tooltip,
  },
  props: {
    userId: null
  },
  data() {
    return {
      date: [new Date(dayjs(new Date()).date(1)), new Date()],
      pages: {
        page: 1,
        size: 15,
        total: 0,
      },
      incomeData: {
        list: [],
        totalProfitPrice: '',
        totalActualPrice: '',
      },
      tableConfig: [
        {
          title: '发布时间',
          slot: 'createTimeString',
          width: '97px',
          align: 'center',
        },
        {
          title: '文章标题',
          key: 'summary',
          align: 'center',
        },
        {
          title: '比赛',
          key: 'matchHomeAwayInfo',
          align: 'center',
          width: '110px',
        },
        {
          title: '比赛时间',
          slot: 'matchTimeStringInfo',
          width: '110px',
          align: 'center',
          render(createElement, {row: {matchTimeStringInfo}}) {
            if (!matchTimeStringInfo) return '-'

            let timeArr = []
            const matchTimeArr = matchTimeStringInfo.split(';')
            if (matchTimeArr.length > 1) {
              timeArr = matchTimeArr.map((row) => {
                return createElement(
                  'div',
                  null,
                  dayjs(row).format('YYYY-MM-DD HH:mm')
                )
              })
            } else {
              const dayTime = dayjs(matchTimeStringInfo)
              timeArr = [
                createElement('div', null, dayTime.format('YYYY-MM-DD')),
                createElement('div', null, dayTime.format('HH:mm')),
              ]
            }

            return createElement(
              'div',
              {style: {margin: '0 -10px'}},
              timeArr
            )
          },
        },
        {
          title: '价格',
          key: 'price',
          width: '50px',
          align: 'center',
        },
        {
          title: '购买人数',
          key: 'buyCount',
          width: '68px',
          align: 'center',
        },
        {
          title: '不中包退',
          slot: 'guarantee',
          width: '72px',
          align: 'center',
        },
        {
          title: '推荐结果',
          slot: 'hitStatus',
          width: '72px',
          align: 'center',
        },
        {
          title: '主播佣金',
          key: 'anchorCommission',
          width: '70px',
          align: 'center',
        },
        {
          title: '收益',
          key: 'profitPrice',
          width: '70px',
          align: 'center',
          render(createElement, {row: {profitPrice}}) {
            const price = profitPrice || 0
            const priceStr = price > 0 ? `+${price}` : price

            return createElement(
              'span',
              {style: {color: '#EF4E23'}},
              priceStr
            )
          },
        },
        {
          title: '操作',
          width: '60px',
          slot: 'caozuo',
          align: 'center',
        },
      ],

      statusImg: ['not_sure', 'win', 'loss', 'match_cancel', 'walk'],
      dialogVisible: false,
      dialogData: {
        planId: '',
        list: [],
      },
      detailPages: {
        page: 1,
        size: 20,
        total: 0,
      },
      detailConfig: [
        {
          type: 'index',
          align: 'center',
          title: '序号',
          width: '45px',
        },
        {
          title: '购买时间',
          slot: 'dealTimeString',
          align: 'center',
          width: '142px',
        },
        {
          title: '购买人',
          key: 'userName',
          align: 'center',
        },
        {
          title: '支付状态',
          key: 'payStateText',
          align: 'center',
        },
        {
          title: '购买渠道',
          key: 'channelName',
          align: 'center',
        },
        {
          title: '优惠券',
          slot: 'hasYhj',
          align: 'center',
        },
        {
          title: '主播佣金',
          key: 'anchorCommission',
          width: '70px',
          align: 'center',
        },
        {
          title: '平台可分成收入',
          key: 'actualPrice',
          width: '110px',
          align: 'center',
        },
        {
          title: '分成比例',
          slot: 'expertDivide',
          align: 'center',
        },
        {
          title: '收益(元)',
          key: 'profitPrice',
          width: '70px',
          align: 'center',
          render(createElement, {row: {profitPrice}}) {
            const price = profitPrice || 0
            const priceStr = price > 0 ? `+${price}` : price

            return createElement(
              'span',
              {style: {color: '#CE995B'}},
              priceStr
            )
          },
        },
      ],
      dayjs
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    $judgeCode(code) {
      return HttpCode.SUCCESS === code
    },
    async getTableData() {
      // TODO
      const postData = {
        userId: this.userId,
        pageNo: this.pages.page,
        pageSize: this.pages.size,
        sdate: dayjs(this.date[0]).format('YYYY-MM-DD'),
        // sdate: '2020-04-01',
        edate: dayjs(this.date[1]).format('YYYY-MM-DD'),
        // edate: '2021-04-01',
      }
      const {data: {code, data}} = await ProfessorService.getArticleIncome(postData).toPromise()
      if (this.$judgeCode(code)) {
        this.incomeData.list = data.list || []
        // this.incomeData.list=[{userName:'123'}]
        this.pages.total = data.total
        this.incomeData.totalActualPrice = data.totalActualPrice
        this.incomeData.totalProfitPrice = data.totalProfitPrice
      }
    },
    changePage(val) {
      this.pages.page = val
      this.getTableData()
    },
    changeDate(date) {
      this.date = date
    },
    openDialog(row) {
      this.dialogVisible = true
      this.dialogData.planId = Number(row.planId)
      this.queryDetail()
    },
    cancel() {
      this.dialogVisible = false
      this.dialogData = {
        planId: '',
        list: [],
      }
    },
    async queryDetail() {
      const postData = {
        planId: this.dialogData.planId,
        pageNo: this.detailPages.page,
        pageSize: this.detailPages.size,
      }
      const {data: {code, data}} = await ProfessorService.getArticleIncomeDetail(postData).toPromise()
      if (this.$judgeCode(code)) {
        this.dialogData = {
          ...this.dialogData,
          ...data.article,
        }
        this.dialogData.list = data.list || []
        this.detailPages.total = data.total
      }
    },
    changeDetailPage(val) {
      this.detailPages.page = val
      this.queryDetail()
    },
  },
}
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>
@import "../../../style/iview";

$color-theme: #ce995b;
/deep/ {
  .ivu-table-row-hover {
    cursor: pointer;
  }

  .ivu-table-cell {
    padding: 0 10px;
  }

  .ivu-modal-content {
    min-height: 669px;
  }
}

.date-picker-content {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;

  .picker-label {
    color: #14162C;
    font-size: 12px;
  }

  /deep/ .ivu-date-picker {
    .ivu-input {
      border: none;
    }
  }

  .query-button {
    margin-left: 10px;
    width: 48px;
    height: 26px;
    line-height: 26px;
    font-size: 12px;
    color: $textColor;
    text-align: center;
    border-radius: 6px;
    border: 1px solid $textColor;
    box-sizing: border-box;
    cursor: pointer;
  }
}

.income-content {
  display: flex;

  .income-item {
    margin-right: 30px;
    width: 300px;
    height: 108px;
    display: flex;
    align-items: center;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;

    &.sale {
      background-image: url("../../../images/income_bg_sale.png");
    }

    &.predict {
      background-image: url("../../../images/income_bg_predict.png");
    }
  }

  .income-inner {
    margin: 0 24px;
  }

  .income-value {
    height: 42px;
    line-height: 42px;
    font-size: 30px;
    color: #fff;
    text-shadow: 0 2px 4px $textColor;
  }

  .income-label {
    margin-top: 10px;
    height: 16px;
    line-height: 16px;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    text-shadow: 0px 2px 4px $textColor;
  }
}

.view {
  color: $textColor;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
}

.dialog-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    color: #14162c;
    font-size: 16px;
    font-weight: 600;
  }

  .match-desc {
    margin: 5px 0 20px;

    & > span {
      color: #434a66;
      font-size: 14px;
      margin-right: 30px;
    }
  }

  .status {
    position: absolute;
    right: 0;
    top: -6px;
    width: 44px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    /*&.match_cancel{*/
    /*  width: 72px;*/
    /*}*/
    &.not_sure {
      width: 63px;
    }

    > img {
      width: 100%;
    }
  }
}

.deal-time {
  display: inline-block;
  white-space: nowrap;
}

/deep/ {
  .ivu-tooltip-inner {
    background: #f4f5f7;
    color: #14162c;
    box-shadow: none;
    font-size: 12px;
  }

  .ivu-tooltip-arrow {
    border-top-color: #f4f5f7 !important;
  }
}
</style>