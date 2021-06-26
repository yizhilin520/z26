<template>
  <div class="account-content">
    <div class="header-content">
      <div class="userInfo">
        <div class="user-avatar">
          <v-image
            :src="headImage"
            class="user-head"
          />
          <!-- <div class="auth_mark"/> -->
        </div>
        <div class="user-content">
          <div>
            <div class="name">
              <span v-text="userInfo.nickName"/>
              <div class="detail">
                <span class="grade" :class="classArr[professorLevel]" v-text="nameArr[professorLevel]"/>
                <span v-if="hits" class="hits" v-text="hits"/>
                <span v-if="userInfo.redNum" class="continuous" v-text="`${userInfo.redNum}连红`"/>
              </div>
            </div>
            <p class="desc">
              <span class="desc-text" v-text="userInfo.introduction"/>
              <span
                class="edit"
                :class="[iconfontStyles['iconfont'], iconfontStyles['icon-bianji']]"
                @click="editIntroduction"
              />
            </p>
          </div>
        </div>
      </div>
      <div class="right-content">
        <div class="join-day" v-text="`已加入专家号${userInfo.dayNum}天`"/>
        <div class="big-data">
          <div class="continuous">
            <template v-if="+userInfo.n20M >= 4">
              <div class="continuous-inner">
                <span class="continuous-val" v-text="`${userInfo.n20Mn}%`"/>
              </div>
              <span class="continuous-des">命中率</span>
            </template>
          </div>

          <div class="continuous">
            <template v-if="userInfo.redNum">
              <div class="continuous-inner">
                <span class="continuous-val" v-text="userInfo.redNum"/>
                <span class="continuous-label">连红</span>
              </div>
              <span class="continuous-des">正在连红</span>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="number-square">
      <div class="square-item">
        <div class="square-inner">
          <p class="square-number ellipsis">
            {{ userInfo.planNum | numberFormatter }}
          </p>
          <p class="square-desc">
            方案
          </p>
        </div>
      </div>
      <div class="square-item">
        <div class="square-inner">
          <p class="square-number ellipsis">
            {{ userInfo.fansNum | numberFormatter }}
          </p>
          <p class="square-desc">
            粉丝
          </p>
        </div>
      </div>
      <div class="square-item">
        <div class="square-inner">
          <p class="square-number ellipsis">
            {{ userInfo.hitNum | numberFormatter }}
          </p>
          <p class="square-desc">
            阅读量
          </p>
        </div>
      </div>
      <div class="square-item">
        <div class="square-inner">
          <p class="square-number ellipsis">
            {{ userInfo.purchaseNum | numberFormatter }}
          </p>
          <p class="square-desc">
            购买人数
          </p>
        </div>
      </div>
      <div class="square-item">
        <div class="square-inner">
          <p class="square-number ellipsis">
            {{ userInfo.amount | numberFormatter }}
          </p>
          <p class="square-desc">
            销售额
          </p>
        </div>
      </div>
    </div>
    <div class="charts">
      <div class="title">
        <span
          class="button"
          @click="typeChange(1)"
          :class="{active: typeIndex === 1}"
        >足球</span>
        <span
          class="button"
          @click="typeChange(2)"
          :class="{active: typeIndex === 2}"
        >篮球</span>
      </div>
      <div class="detail">
        <div class="pie">
          <p>
            <span :class="[daysIndex === 1 ? 'active' : '']" @click="daysChange(1)">近7天</span>
            <span :class="[daysIndex === 2 ? 'active' : '']" @click="daysChange(2)">近30天</span>
            <span :class="[daysIndex === 3 ? 'active' : '']" @click="daysChange(3)">近90天</span>
          </p>
          <div
            id="piechart"
            style="width: 450px; height: 160px"
          />
          <p class="footer">
            <span class="win">
              <span>赢</span>
              <span>{{ pieTotal.win }} 场</span>
            </span>
            <span class="lost">
              <span>输</span>
              <span>{{ pieTotal.loss }} 场</span>
            </span>
          </p>
        </div>
        <div class="line">
          <p>
            <span :class="[numsIndex === 1 ? 'active' : '']" @click="numsChange(1)">近5场</span>
            <span :class="[numsIndex === 2 ? 'active' : '']" @click="numsChange(2)">近10场</span>
            <span :class="[numsIndex === 3 ? 'active' : '']" @click="numsChange(3)">近20场</span>
          </p>
          <div
            id="linechart"
            style="width: 450px; height: 160px"
          />
          <p class="footer">
            <span class="red-result">
              <span>红</span>
              <span>{{ lineTotal.win }} 场</span>
            </span>
            <span class="dis-result">
              <span>走</span>
              <span>{{ lineTotal.walk }} 场</span>
            </span>
            <span class="black-result">
              <span>黑</span>
              <span>{{ lineTotal.loss }} 场</span>
            </span>
          </p>
        </div>
      </div>
    </div>
    <Row
      :gutter="30"
      class="message-content"
    >
      <i-col :span="12" v-if="notifyInfo.length">
        <div class="message-inner">
          <div class="message-title">
            <h2 class="title-block fl">
              公告
            </h2>
            <div
              class="title-more fr"
            >
              <span style="vertical-align: middle">更多</span>
              <Icon
                type="ios-arrow-forward"
                size="18"
                style="margin-left: -2px;margin-right: -5px;"
              />
            </div>
          </div>
          <ul>
            <li
              v-for="(row, index) in notifyInfo"
              :key="`notify_item_${index}`"
              class="message-item pointer"
            >
              <div
                class="item-content ellipsis"
                v-text="row.text"
                @click="onJumpPage(row.url)"
              />
              <div class="item-time">
                {{ row.createTimeString | dateFormatter }}
              </div>
            </li>
          </ul>
        </div>
      </i-col>
      <i-col :span="notifyInfo.length ? 12 : 24">
        <div class="message-inner">
          <div class="message-title">
            <h2 class="title-block fl">
              消息
            </h2>
            <div
              class="title-more fr"
            >
              <span style="vertical-align: middle">更多</span>
              <Icon
                type="ios-arrow-forward"
                size="18"
                style="margin-left: -2px;margin-right: -5px;"
              />
            </div>
          </div>
          <ul>
            <li
              v-for="(row, index) in messageInfo"
              :key="`message_item_${index}`"
              class="message-item"
            >
              <div
                class="item-content ellipsis"
                v-text="row.content"
                @click="onJumpPage('/professor/home/message')"
              />
              <div class="item-time">
                {{ row.createTimeString | dateFormatter }}
              </div>
            </li>
          </ul>
        </div>
      </i-col>
    </Row>
    <Spin
      v-if="loading"
      size="large"
      fix
    />
  </div>
</template>
<script type="text/javascript">
import VImage from '../../components/Image'
import {Col, Icon, Row, Spin} from 'iview'
import Button from '../../components/button'
import EditModal from './edit'
import * as ProfessorService from '@/servers/professor'
import {HttpCode} from "@/enums";
import $warning from '../../../plugins/toast'
import iconfontStyles from '@/components/Iconfont/style.scss'

export default {
  components: {
    VImage,
    Spin,
    Icon,
    Button,
    Row,
    ICol: Col,
  },
  filters: {
    numberFormatter(number) {
      if (number > 10000) return `${number / 10000}万`
      return number || 0
    },
    dateFormatter(dataStr) {
      return dataStr.replace(/:\d{2}$/g, '')
    },
  },
  props: {
    userId: null,
    history: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      loading: false,
      userInfo: {},
      //消息
      messageInfo: [],
      classArr: ['primary', 'intermediate', 'advanced', 'senior'],
      nameArr: ['初级', '中级', '高级', '资深'],
      notifyInfo: [{
        text: '《专家号入驻合作协议》',
        createTimeString: '2021-04-07 17:36:03',
        url: '/protocol/expert'
      }, {
        text: '专家号发文规范',
        createTimeString: '2021-04-07 17:36:03',
        url: '/protocol/expert/article'
      }],
      //足球篮球切换
      typeIndex: 1,
      // 按天切换
      daysIndex: 1,
      // 按场次切换
      numsIndex: 1,
      // 保存表格实例
      pieChart: null,
      lineChart: null,
      iconfontStyles
    }
  },
  computed: {
    // 头像
    headImage() {
      return this.userInfo.headPic
    },
    //专家等级
    professorLevel() {
      return (+this.userInfo.level - 1)
    },
    // 近m中n
    hits() {
      let {n20M, n20N} = this.userInfo
      if (!n20M || !n20N) {
        return ''
      }
      return `近${n20M}中${n20N}`
    },
    // 饼图数据
    pieData() {
      let {typeIndex, daysIndex, userInfo} = this
      let days = ['7', '30', '90']
      let key_win = 'n' + days[daysIndex - 1] + 'dHit' + typeIndex
      let key_lose = 'n' + days[daysIndex - 1] + 'dLoss' + typeIndex
      let obj = [
        {
          name: '红单',
          value: userInfo[key_win] || 0,
        },
        {
          name: '黑单',
          value: userInfo[key_lose] || 0,
        },
      ]
      return obj
    },
    // 折线图数据
    lineData() {
      let {typeIndex, numsIndex, userInfo} = this
      let key = 'n20Status' + typeIndex
      let num = numsIndex === 1 ? 5 : numsIndex === 2 ? 10 : 20
      let data = userInfo[key]

      if (data && data.length) {
        return data.replace(/3/g, '2').split('').map(Number).slice(0, num)
      }
      return []
    },
    // 输赢/红走黑数据
    pieTotal() {
      let {pieData} = this
      let obj = {}
      obj.win = pieData[0].value
      obj.loss = pieData[1].value
      return obj
    },
    lineTotal() {
      let {lineData} = this
      let obj = {}
      obj.win = lineData.reduce((acc, cur) => {
        return cur === 2 ? ++acc : acc
      }, 0)
      obj.walk = lineData.reduce((acc, cur) => {
        return cur === 1 ? ++acc : acc
      }, 0)
      obj.loss = lineData.reduce((acc, cur) => {
        return cur === 0 ? ++acc : acc
      }, 0)
      return obj
    },
    // 饼图的胜率
    pieRate() {
      let {typeIndex, daysIndex, userInfo} = this
      let days = ['7', '30', '90']
      let key = 'n' + days[daysIndex - 1] + 'dRate' + typeIndex
      return userInfo[key]
    },
  },
  beforeMount() {
    this.getPageData()
  },
  methods: {
    // 跳转页面
    onJumpPage(url) {
      this.history.push(url)
    },
    $judgeCode(code) {
      return HttpCode.SUCCESS === code
    },
    //绘制图表
    async drawChart() {
      const [echarts] = await Promise.all([
        import(/* webpackChunkName: "echarts" */'echarts/lib/echarts'),
        import(/* webpackChunkName: "echarts" */'echarts/lib/chart/line'),
        import(/* webpackChunkName: "echarts" */'echarts/lib/chart/pie'),
        import(/* webpackChunkName: "echarts" */'echarts/lib/component/tooltip'),
        import(/* webpackChunkName: "echarts" */'echarts/lib/component/title'),
        import(/* webpackChunkName: "echarts" */'echarts/lib/component/toolbox')
      ])

      this.pieChart = echarts.init(document.getElementById('piechart'))
      this.lineChart = echarts.init(document.getElementById('linechart'))
      //初始化
      this.pieChart.setOption({
        title: {
          text: '0%',
          left: 'center',
          top: '40%',
          subtext: '胜率',
          // padding:[24,0],
          textStyle: {
            color: '#FF5338',
            fontSize: 14,
            align: 'center',
          },
          subtextStyle: {
            color: '#434A66',
            fontSize: 12,
            align: 'center',
          },
        },
        color: ['#FF5338', '#E6EAF3'],
        series: [
          {
            type: 'pie',
            radius: ['55%', '70%'],
            hoverAnimation: false,
            label: {
              show: true,
              color: '#414A68',
              position: 'outside',
              formatter: '{b}   {c}',
              fontSize: 14,
            },
            labelLine: {
              show: true,
              length: 10,
              length2: 40,
              lineStyle: {
                color: '#414A68'
              },
            },
            emphasis: {
              itemStyle: {
                color: '#333333',
              },
            },
            data: [],
            // data: this.chartData.pie
          },
        ],
      })
      this.lineChart.setOption({
        grid: {
          top: 30,
          left: '10%',
          right: '10%',
          bottom: 30,
        },
        xAxis: {
          type: 'category',
          show: false,
          data: new Array(5).fill(''),
        },
        yAxis: {
          type: 'value',
          show: true,
          splitNumber: 2,
          splitLine: {
            lineStyle: {
              width: 1,
              type: 'dashed',
              color: ['#FF6700', '#409EFF', '#414A68'],
            },
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: '#76809C',
            fontSize: 14,
            formatter: (value) => {
              let label = ''
              switch (value) {
                case 0:
                  label = '黑'
                  break
                case 1:
                  label = '走'
                  break
                case 2:
                  label = '红'
                  break
                default:
                  break
              }
              return label
            },
          },
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
        },
        series: [
          {
            data: [],
            type: 'line',
            symbol: 'circle',
            symbolSize: 12,
            hoverAnimation: false,
            lineStyle: {
              color: '#76809C',
            },
            itemStyle: {
              borderWidth: 0,
              color: function (obj) {
                let color = '#000000'
                let data = Number(obj.data)
                switch (data) {
                  case 0:
                    color = '#434A66'
                    break
                  case 1:
                    color = '#2178D2'
                    break
                  case 2:
                    color = '#FF5338'
                    break
                  default:
                    break
                }
                return color
              },
            },
          },
        ],
      })
      //绑定数据
      this.bindPieData()
      this.bindLineData()
    },
    bindPieData() {
      this.pieChart.setOption({
        title: {
          text: `${(+this.pieRate).toFixed(1) || 0}%`,
        },
        series: [
          {
            data: this.pieData,
          },
        ],
      })
    },
    bindLineData() {
      this.lineChart.setOption({
        xAxis: {
          data: new Array(this.lineData.length || 5).fill(''),
        },
        series: [
          {
            data: this.lineData,
          },
        ],
      })
    },
    //获取账户信息
    async getAccountData() {
      const {$judgeCode, userId, $nextTick} = this
      const {data: {msg, code, data}} = await ProfessorService.getClubAccount(userId).toPromise()
      if (!$judgeCode(code)) return $warning(msg)
      this.userInfo = data || {}

      $nextTick(this.drawChart)
    },
    // 获取通知
    async getNotifyData() {
    },
    // 获取消息
    async getMessageData() {
      const {$judgeCode, userId} = this
      const params = {
        userId,
        pageNo: 1,
        pageSize: 4,
        type: 1
      }
      const {data: {msg, code, data: {list}}} = await ProfessorService.getMessageList(params).toPromise()
      if (!$judgeCode(code)) return $warning(msg)
      this.messageInfo = list || []
    },
    async getPageData() {
      const {getAccountData, getMessageData} = this

      this.loading = true
      try {
        await getAccountData()
        await getMessageData()
      } finally {
        this.loading = false
      }
    },
    typeChange(typeIndex) {
      this.typeIndex = typeIndex
      this.daysIndex = 1
      this.numsIndex = 1
      this.bindPieData()
      this.bindLineData()
    },
    daysChange(daysIndex) {
      this.daysIndex = daysIndex
      this.bindPieData()
    },
    numsChange(numsIndex) {
      this.numsIndex = numsIndex
      this.bindLineData()
    },
    editIntroduction() {
      EditModal.edit({
        title: '专家简介',
        text: this.userInfo.introduction,
        onConfirm: this.editConfirm
      })
    },
    editConfirm(text) {
      const {$judgeCode, $warning} = this
      let params = {
        expertId: this.userInfo.expertId,
        introduction: text
      }
      ProfessorService.editIntroduction(params).toPromise().then(res => {
        let {data: {code, msg}} = res
        if (!$judgeCode(code)) return $warning(msg)
        this.getAccountData()
      })
    }
  }
}
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>
.fl {
  float: left;
}

.fr {
  float: right;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.account-content {
  position: relative;
  padding: 30px;
  background: url("../../images/account_bg.jpg") no-repeat center top;
  background-size: 100% auto;

  .header-content {
    margin-top: 30px;
    display: flex;

    .userInfo {
      display: flex;
      width: 730px;
      align-items: center;
      overflow: hidden;
    }

    .user-avatar {
      position: relative;
      padding: 4px;
      width: 108px;
      height: 108px;
      border-radius: 54px;
      background: #fff;
      box-sizing: border-box;

      .user-head {
        width: 100px;
        height: 100px;
        border-radius: 50px;
        object-fit: cover;
      }

      .auth_mark {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 32px;
        height: 32px;
        background: url("../../images/auth_mark.png") center no-repeat;
        background-size: 100%;
      }
    }

    .user-content {
      width: 540px;
      display: flex;
      flex: 1;
      margin: 0 34px;

      .name {
        display: flex;
        color: #fff;
        font-size: 24px;
        height: 34px;
        align-items: center;

        .detail {
          font-size: 12px;
          display: flex;
          align-items: center;

          span {
            margin-left: 9px;
          }

          .grade {
            display: inline-block;
            width: 50px;
            height: 18px;
            font-size: 12px;
            text-align: center;
            line-height: 20px;
            background-position: top left;
            background-size: cover;
            background-repeat: no-repeat;
          }

          .primary {
            background-image: url("../../images/primary.png");
            color: #7B5C46;
          }

          .intermediate {
            background: #FFFFFF linear-gradient(157deg, #FFFFFF 0%, rgba(250, 218, 170, 0.85) 100%);
            color: #434A66;
            border-radius: 9px;
          }

          .advanced {
            background-image: url("../../images/advanced.png");
            color: #724203;
          }

          .senior {
            background-image: url("../../images/senior.png");
            color: #513997;
          }

          .hits {
            display: inline-block;
            padding: 0 5px;
            height: 18px;
            color: #ce6a00;
            background: #FFFFFF linear-gradient(90deg, #F1E2CC 0%, rgba(251, 209, 147, 0.87) 55%, #EFB560 100%);;
            text-align: center;
            line-height: 20px;
            border-radius: 9px;
          }

          .continuous {
            display: inline-block;
            padding: 0 5px;
            height: 18px;
            color: #fd3c05;
            background: #FFFFFF linear-gradient(90deg, #FFE5DD 0%, #FFB39D 100%);
            box-shadow: 0px 4px 12px 0px rgba(143, 73, 37, 0.04);
            text-align: center;
            line-height: 20px;
            border-radius: 9px;
          }
        }
      }

      .desc {
        margin-top: 12px;
        font-size: 13px;
        color: #D0D5E2;
        line-height: 24px;

        .edit {
          margin-left: 10px;
          display: inline-block;
          height: 12px;
          line-height: 12px;
          font-size: 16px;
          cursor: pointer;

          &:hover {
            color: #CE995B;
          }
        }
      }
    }

    .right-content {
      position: relative;
      text-align: right;
      flex: 1;

      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 1px;
        height: 100%;
        background: linear-gradient(180deg, rgba(58, 65, 84, 0) 0%, #61687D 50%, rgba(56, 62, 82, 0) 100%);
      }

      .join-day {
        padding-left: 10px;
        position: absolute;
        top: -40px;
        right: -30px;
        width: 140px;
        height: 40px;
        line-height: 40px;
        font-size: 12px;
        color: #D0D5E2;
        text-align: center;
        background: rgba(255, 255, 255, 0.06);
        border-radius: 20px 0px 0px 20px;
        box-sizing: border-box;
      }

      .big-data {
        width: 100%;
        padding-left: 30px;
        position: absolute;
        right: 0;
        top: 50%;
        display: flex;
        justify-content: space-between;
        transform: translateY(-50%);
        box-sizing: border-box;

        .continuous {
          text-align: center;

          .continuous-inner {
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            color: #FD8505;
            line-height: 42px;
          }

          .continuous-val {
            font-size: 30px;
          }

          .continuous-label {
            padding-top: 10px;
            padding-left: 10px;
            font-size: 16px;
          }

          .continuous-des {
            margin-top: 2px;
            font-size: 14px;
            color: #D0D5E2;
            line-height: 16px;
          }
        }
      }
    }
  }

  .number-square {
    margin: 60px 12px auto 12px;
    display: flex;
    align-items: center;
    height: 105px;
    background: #FFFFFF linear-gradient(135deg, #FEF3E2 0%, rgba(249, 211, 154, 0.85) 100%);
    box-shadow: 0px 6px 10px 6px rgba(0, 0, 0, 0.04);
    border-radius: 4px;

    .square-item {
      position: relative;
      display: flex;
      flex: 1;
      height: 46px;
      align-items: center;
      justify-content: center;

      &:before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 1px;
        height: 100%;
        background: rgba(105, 61, 18, 0.1);
      }

      &:last-child {
        &:before {
          content: none;
        }
      }
    }

    .square-inner {
      width: 100%;
      color: #693D12;
      text-align: center;
    }

    .square-number {
      font-size: 22px;
      font-weight: bold;
      line-height: 32px;
    }

    .square-desc {
      margin-top: 4px;
      font-size: 14px;
      line-height: 16px;
    }
  }

  .charts {
    position: relative;
    margin-top: 24px;
    margin-left: 12px;
    margin-right: 12px;

    .title {
      height: 52px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .button {
        margin-right: 46px;
        color: #363636;
        font-size: 20px;
        display: inline-block;
        width: 42px;
        height: 30px;
        text-align: center;
        cursor: pointer;
        box-sizing: border-box;

        &:hover, &.active {
          color: $textColor;
        }
      }
    }

    .detail {
      background-color: #fff;
      display: flex;
      flex-direction: row;
      align-items: stretch;
      border-radius: 6px;
      border: 1px solid rgba(230, 234, 243, 1);

      & > div {
        flex-grow: 1;
        overflow: hidden;

        p {
          &:nth-child(1) {
            display: flex;
            align-items: center;
            height: 52px;
            margin: 0 24px;
            color: #76809C;
            font-size: 14px;
            border-bottom: 1px solid #EBF0FB;

            span {
              color: #76809c;
              display: inline-block;
              width: 52px;
              font-size: 14px;
              margin-right: 20px;
              cursor: pointer;

              &:hover {
                color: #434A66;
                font-size: 15px;
                font-weight: 600;
              }
            }

            .active {
              color: #434A66;
              font-size: 15px;
              font-weight: 600;
            }
          }
        }

        .footer {
          margin: 24px auto;
          display: flex;
          justify-content: center;
          color: #434a66;
          font-size: 12px;

          & > span > span {
            &:nth-child(1) {
              display: inline-block;
              width: 16px;
              height: 16px;
              line-height: 16px;
              text-align: center;
              color: #ff5338;
              font-size: 10px;
              border-radius: 1px;
            }
          }

          .win {
            margin-right: 40px;

            span {
              &:nth-child(1) {
                width: 16px;
                height: 16px;
                line-height: 16px;
                text-align: center;
                background-color: rgba(253, 60, 5, .2);
                color: #FD3C05;
                border-radius: 1px;
              }
            }
          }

          .lost {
            margin-right: 40px;

            span {
              &:nth-child(1) {
                width: 16px;
                height: 16px;
                line-height: 16px;
                text-align: center;
                background-color: rgba(65, 74, 104, .2);
                color: #414A68;
                border-radius: 1px;
              }
            }
          }

          .red-result {
            margin-right: 30px;

            span {
              &:nth-child(1) {
                background: rgba(253, 60, 5, .2);
                color: #FD3C05;
              }
            }
          }

          .dis-result {
            margin-right: 30px;

            span {
              &:nth-child(1) {
                background: rgba(57, 119, 254, .2);
                color: #F44A4A;
              }
            }
          }

          .black-result {
            margin-right: 44px;

            span {
              &:nth-child(1) {
                background: rgba(65, 74, 104, .2);
                color: #414A68;
              }
            }
          }
        }

        & > div {
          margin-top: 10px;
        }
      }
    }
  }

  .message-content {
    padding: 18px 12px 50px 12px;

    .message-inner {
      overflow: hidden;
    }

    .message-title {
      height: 54px;
      line-height: 54px;
      overflow: hidden;

      .title-block {
        font-size: 18px;
        color: #363636;
        font-weight: 500;
      }

      .title-more {
        padding: 0;
        font-size: 14px;
        color: #76809C;
        line-height: inherit;
        cursor: pointer;

        &:hover {
          color: #ce995b;
        }
      }
    }

    ul {
      height: 228px;
      border-radius: 4px;
      border: 1px solid #E6EAF3;
    }

    .message-item {
      margin-top: 5px;
      display: flex;
      font-size: 14px;
      color: #14162C;
      padding: 0 24px;
      line-height: 40px;
      cursor: pointer;

      &.pointer {
        cursor: pointer;
      }

      &:hover {
        color: $textColor;
      }
    }

    .item-content {
      flex: 1;
    }

    .item-time {
      margin-left: 10px;
      color: #949BB1;
      font-size: 12px;
    }
  }
}
</style>