<template>
  <div
    v-if="visible"
    class="ui-widget-preview"
  >
    <transition name="fade">
      <div
        class="ivu-drawer-mask v-modal"
        :style="{zIndex}"
        @click="onCloseHandler"
      />
    </transition>
    <div
      class="preview-main"
      :style="{zIndex}"
    >
      <div class="header">
        <p>文章预览</p>
        <span class="preview-close ivu-icon ivu-icon-ios-close" @click="onCloseHandler"/>
      </div>
      <div class="content">
        <div class="content-inner">
          <div class="title">
            {{ data.title }}
          </div>
          <div
            v-for="(plan, index) in (data || {}).trades"
            :key="index"
            class="data-view"
          >
            <img
              v-if="plan.isWalking === 1"
              walk
              :src="require('../images/walk.png').default"
              class="resultLogo"
            >
            <img
              v-else-if="plan.matchHitStatus === 1"
              win
              :src="require('../images/win.png').default"
              class="resultLogo"
            >
            <img
              v-else-if="plan.matchHitStatus === 2"
              loss
              :src="require('../images/loss.png').default"
              class="resultLogo"
            >
            <div class="match-name">
              <span :class="getStatusClass(index)">{{ getStatusName(index) }}</span>
              <span>{{ `${data.playTypeName} | ${plan.leagueName} | ` }} {{ plan.matchTime | dateFormatter }}</span>
            </div>
            <div class="team-name">
              <div class="left-name">
                <span v-if="data.sportId === 1">(主)</span>
                {{ data.sportId === 1 ? plan.homeName : plan.guestName }}
              </div>
              <div class="logos">
                <v-image
                  :src="(data.sportId === 1 ? plan.homeLogo : plan.guestLogo)"
                  :default-image="defaultImg[data.sportId]"
                />
                <span
                  v-if="plan.matchStatus != 3"
                  class="vs"
                >VS</span>
                <span
                  v-else
                  class="score"
                >
                  {{
                    data.sportId === 1 ? plan.matchScore.split(':').join(' : ') : plan.matchScore.split(':').reverse().join(' : ')
                  }}
                </span>
                <v-image
                  :src="(data.sportId === 2 ? plan.homeLogo : plan.guestLogo)"
                  :default-image="defaultImg[data.sportId]"
                />
              </div>
              <div class="right-name">
                {{ data.sportId === 2 ? plan.homeName : plan.guestName }}
                <span
                  v-if="data.sportId === 2"
                >(主)</span>
              </div>
            </div>
            <div
              v-if="beforePlan(plan, index)"
              class="match-result"
            >
              <!-- <div
                v-if="(data.playTypeId === 1 || data.playTypeId === 4)"
                class="giveup"
                :class="[Number(beforePlan(plan, index).index) > 0 ? 'positive' : (Number(beforePlan(plan, index).index) < 0 ? 'negative' : 'zero')]"
              >
                {{ onFormatIndex(beforePlan(plan, index).index) }}
              </div> -->

              <div
                class="loss-percent"
                :class="[isRecommend(1, beforePlan(plan, index).recommendIndex, data.playTypeId, data.sportId) ? 'recommend' : '']"
              >
                <span v-if="data.playTypeId === 1 || data.playTypeId === 2">主胜</span>
                <span v-else-if="data.playTypeId === 4 || data.playTypeId === 5">客胜</span>
                <span v-else-if="data.playTypeId === 3">大</span>
                <span v-else-if="data.playTypeId === 6">小</span>
                <span>{{
                    data.sportId === 1 ? beforePlan(plan, index).ratios[0] : beforePlan(plan, index).ratios[plan.ratios.length - 1]
                  }}</span>
                <i
                  v-if="isMatchResult(1, beforePlan(plan, index).redIndex, data.playTypeId, data.sportId)"
                  class="red"
                  :class="[styles['iconfont'], styles['iconcorrect_tc']]"
                />
              </div>

              <div
                v-if="data.playTypeId !== 4"
                class="loss-percent"
                :class="[isRecommend(2, beforePlan(plan, index).recommendIndex, data.playTypeId, data.sportId) ? 'recommend' : '']"
              >
                <template v-if="data.playTypeId === 1">
                  <span>平局</span>
                  <span>{{ beforePlan(plan, index).ratios[1] }}</span>
                </template>
                <template v-else-if="data.playTypeId === 2">
                  <span v-if="+beforePlan(plan, index).index > 0">主让</span>
                  <span v-else>客让</span>
                  <span>{{ Math.abs(Number(beforePlan(plan, index).index)) | removeZero }}</span>
                </template>
                <template v-else-if="data.playTypeId === 3 || data.playTypeId === 6">
                  <span>大小</span>
                  <span>{{ beforePlan(plan, index).index | removeZero }}</span>
                </template>
                <template v-else-if="data.playTypeId === 5">
                  <span v-if="+beforePlan(plan, index).index > 0">客让</span>
                  <span v-else>主让</span>
                  <span>{{ Math.abs(Number(beforePlan(plan, index).index)) | removeZero }}</span>
                </template>
                <i
                  v-if="isMatchResult(2, beforePlan(plan, index).redIndex, data.playTypeId, data.sportId)"
                  class="red"
                  :class="[styles['iconfont'], styles['iconcorrect_tc']]"
                />
              </div>

              <div
                class="loss-percent"
                :class="[isRecommend(3, beforePlan(plan, index).recommendIndex, data.playTypeId, data.sportId) ? 'recommend' : '']"
              >
                <span v-if="data.playTypeId === 1 || data.playTypeId === 2">客胜</span>
                <span v-else-if="data.playTypeId === 4 || data.playTypeId === 5">主胜</span>
                <span v-else-if="data.playTypeId === 3">小</span>
                <span v-else-if="data.playTypeId === 6">大</span>
                <span>{{
                    data.sportId === 2 ? beforePlan(plan, index).ratios[0] : beforePlan(plan, index).ratios[beforePlan(plan, index).ratios.length - 1]
                  }}</span>
                <i
                  v-if="isMatchResult(3, beforePlan(plan, index).redIndex, data.playTypeId, data.sportId)"
                  class="icon red"
                  :class="[styles['iconfont'], styles['iconcorrect_tc']]"
                />
              </div>
            </div>

            <div class="match-result">
              <!-- <div
                v-if="(data.playTypeId === 1 || data.playTypeId === 4)"
                class="giveup"
                :class="[Number(plan.index) > 0 ? 'positive' : (Number(plan.index) < 0 ? 'negative' : 'zero')]"
              >
                {{ onFormatIndex(plan.index) }}
              </div> -->

              <div
                class="loss-percent"
                :class="[isRecommend(1, plan.recommendIndex, data.playTypeId, data.sportId) ? 'recommend' : '']"
              >
                <span v-if="data.playTypeId === 1 || data.playTypeId === 2">主胜</span>
                <span v-else-if="data.playTypeId === 4 || data.playTypeId === 5">客胜</span>
                <span v-else-if="data.playTypeId === 3">大</span>
                <span v-else-if="data.playTypeId === 6">小</span>
                <span>{{ data.sportId === 1 ? plan.ratios[0] : plan.ratios[plan.ratios.length - 1] }}</span>
                <i
                  v-if="isMatchResult(1, plan.redIndex, data.playTypeId, data.sportId)"
                  class="red"
                  :class="[styles['iconfont'], styles['iconcorrect_tc']]"
                />
              </div>

              <div
                v-if="data.playTypeId !== 4"
                class="loss-percent"
                :class="[isRecommend(2, plan.recommendIndex, data.playTypeId, data.sportId) ? 'recommend' : '']"
              >
                <template v-if="data.playTypeId === 1">
                  <span>平局</span>
                  <span>{{ plan.ratios[1] }}</span>
                </template>
                <template v-else-if="data.playTypeId === 2">
                  <span v-if="+plan.index > 0">主让</span>
                  <span v-else>客让</span>
                  <span>{{ Math.abs(Number(plan.index)) | removeZero }}</span>
                </template>
                <template v-else-if="data.playTypeId === 3 || data.playTypeId === 6">
                  <span>大小</span>
                  <span>{{ plan.index | removeZero }}</span>
                </template>
                <template v-else-if="data.playTypeId === 5">
                  <span v-if="+plan.index > 0">客让</span>
                  <span v-else>主让</span>
                  <span>{{ Math.abs(Number(plan.index)) | removeZero }}</span>
                </template>
                <i
                  v-if="isMatchResult(2, plan.redIndex, data.playTypeId, data.sportId)"
                  class="icon red"
                  :class="[styles['iconfont'], styles['iconcorrect_tc']]"
                />
              </div>

              <div
                class="loss-percent"
                :class="[isRecommend(3, plan.recommendIndex, data.playTypeId, data.sportId) ? 'recommend' : '']"
              >
                <span v-if="data.playTypeId === 1 || data.playTypeId === 2">客胜</span>
                <span v-else-if="data.playTypeId === 4 || data.playTypeId === 5">主胜</span>
                <span v-else-if="data.playTypeId === 3">小</span>
                <span v-else-if="data.playTypeId === 6">大</span>
                <span>{{ data.sportId === 2 ? plan.ratios[0] : plan.ratios[plan.ratios.length - 1] }}</span>
                <i
                  v-if="isMatchResult(3, plan.redIndex, data.playTypeId, data.sportId)"
                  class="icon red"
                  :class="[styles['iconfont'], styles['iconcorrect_tc']]"
                />
              </div>
            </div>

            <div
              v-if="afterPlan(plan, index)"
              class="match-result"
            >
              <div
                v-if="(data.playTypeId === 1 || data.playTypeId === 4)"
                class="giveup"
                :class="[Number(afterPlan(plan, index).index) > 0 ? 'positive' : (Number(afterPlan(plan, index).index) < 0 ? 'negative' : 'zero')]"
              >
                {{ onFormatIndex(afterPlan(plan, index).index) }}
              </div>

              <div
                class="loss-percent"
                :class="[isRecommend(1, afterPlan(plan, index).recommendIndex, data.playTypeId, data.sportId) ? 'recommend' : '']"
              >
                <span v-if="data.playTypeId === 1 || data.playTypeId === 2">主胜</span>
                <span v-else-if="data.playTypeId === 4 || data.playTypeId === 5">客胜</span>
                <span v-else-if="data.playTypeId === 3">大</span>
                <span v-else-if="data.playTypeId === 6">小</span>
                <span>{{
                    data.sportId === 1 ? afterPlan(plan, index).ratios[0] : afterPlan(plan, index).ratios[plan.ratios.length - 1]
                  }}</span>
                <i
                  v-if="isMatchResult(1, afterPlan(plan, index).redIndex, data.playTypeId, data.sportId)"
                  class="red"
                  :class="[styles['iconfont'], styles['iconcorrect_tc']]"
                />
              </div>

              <div
                v-if="data.playTypeId !== 4"
                class="loss-percent"
                :class="[isRecommend(2, afterPlan(plan, index).recommendIndex, data.playTypeId, data.sportId) ? 'recommend' : '']"
              >
                <template v-if="data.playTypeId === 1">
                  <span>平局</span>
                  <span>{{ afterPlan(plan, index).ratios[1] }}</span>
                </template>
                <template v-else-if="data.playTypeId === 2">
                  <span v-if="+afterPlan(plan, index).index > 0">主让</span>
                  <span v-else>客让</span>
                  <span>{{ Math.abs(Number(afterPlan(plan, index).index)) | removeZero }}</span>
                </template>
                <template v-else-if="data.playTypeId === 3 || data.playTypeId === 6">
                  <span>大小</span>
                  <span>{{ afterPlan(plan, index).index | removeZero }}</span>
                </template>
                <template v-else-if="data.playTypeId === 5">
                  <span v-if="+afterPlan(plan, index).index > 0">客让</span>
                  <span v-else>主让</span>
                  <span>{{ Math.abs(Number(afterPlan(plan, index).index)) | removeZero }}</span>
                </template>
                <i
                  v-if="isMatchResult(2, afterPlan(plan, index).redIndex, data.playTypeId, data.sportId)"
                  class="icon red"
                  :class="[styles['iconfont'], styles['iconcorrect_tc']]"
                />
              </div>

              <div
                class="loss-percent"
                :class="[isRecommend(3, afterPlan(plan, index).recommendIndex, data.playTypeId, data.sportId) ? 'recommend' : '']"
              >
                <span v-if="data.playTypeId === 1 || data.playTypeId === 2">客胜</span>
                <span v-else-if="data.playTypeId === 4 || data.playTypeId === 5">主胜</span>
                <span v-else-if="data.playTypeId === 3">小</span>
                <span v-else-if="data.playTypeId === 6">大</span>
                <span>{{
                    data.sportId === 2 ? afterPlan(plan, index).ratios[0] : afterPlan(plan, index).ratios[afterPlan(plan, index).ratios.length - 1]
                  }}</span>
                <i
                  v-if="isMatchResult(3, afterPlan(plan, index).redIndex, data.playTypeId, data.sportId)"
                  class="icon red"
                  :class="[styles['iconfont'], styles['iconcorrect_tc']]"
                />
              </div>
            </div>
          </div>
          <div
            class="text"
            v-html="data.content"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import dayJs from 'dayjs'
import Image from './Image'
import styles from '@/components/Iconfont/style.scss'
import DefaultFootballMatchImage from '@/assets/images/default_football_match_image.png';
import DefaultBasketballMatchImage from '@/assets/images/default_basketball_match_image.png';

export default {
  filters: {
    dateFormatter(dataStr) {
      const diffDate = dayJs(dataStr)
      const formatDate = diffDate.format('MM-DD HH:mm')
      return formatDate
    },
    removeZero(playIndex) {
      return Number.parseFloat(playIndex)
    }
  },
  data() {
    return {
      data: null,
      visible: false,
      zIndex: 0,
      onClose: null,
      defaultImg: {
        '1': DefaultFootballMatchImage,
        '2': DefaultBasketballMatchImage
      },
      styles
    }
  },
  components: {
    VImage: Image
  },
  watch: {
    data(val) {
      if (val) {
        this.data.trades = val.trades.map((item) => {
          item.ratios = this.getRatios(item.ratios)
          return item
        })
      }
    },
  },
  methods: {
    onFormatIndex(indexVal) {
      // 保险起见将值化为字符串
      const numStr = String(Number.parseFloat(indexVal))
      const minusReg = /^-/

      // 负数
      if (minusReg.test(numStr)) return numStr
      if (+indexVal == 0) {
        return 0
      }
      // 正数
      return `+${numStr}`
    },
    onCloseHandler() {
      const {onClose} = this
      if (onClose) onClose()
    },
    getStatusClass(index) {
      return {
        notstart: this.data && this.data.trades[index].matchStatus === 1,
        going: this.data && this.data.trades[index].matchStatus === 2,
        end: this.data && this.data.trades[index].matchStatus === 3,
      }
    },
    getStatusName(index) {
      let name = ''
      if (this.data && this.data.trades[index].matchStatus === 1) {
        name = '未开始'
      } else if (this.data && this.data.trades[index].matchStatus === 2) {
        name = '进行中'
      } else if (this.data && this.data.trades[index].matchStatus === 3) {
        name = '已结束'
      }
      return name
    },
    getRatios(ratiosStr) {
      return ratiosStr.split(';')
    },

    isRecommend(index, recommendIndex, type, sportId) {
      recommendIndex = recommendIndex ? recommendIndex + '' : ''
      // 足球
      if (sportId == 1) {
        return recommendIndex.lastIndexOf(index) != -1
      } else {
        // 篮球 只存在 12（精彩篮球）  13（篮球让分大小分）
        recommendIndex = Array.from(recommendIndex, (item) => {
          return item === '1' ? '3' : '1'
        }).join('')
        return recommendIndex.lastIndexOf(index) != -1
      }
    },
    isMatchResult(index, redIndex, type, sportId) {
      redIndex = redIndex ? '' + redIndex : ''
      // 足球
      if (sportId == 1) {
        return redIndex.lastIndexOf(index) != -1
      } else {
        // 篮球 只存在 12（精彩篮球）  13（篮球让分大小分）
        redIndex = Array.from(redIndex, (item) => {
          return item === '1' ? '3' : '1'
        }).join('')
        return redIndex.lastIndexOf(index) != -1
      }
    },
    //获取未选取的数据，并确定展示在主数据前面还是后面，beforePlan,afterPlan来区分
    beforePlan(plan, index) {
      if (!plan.games || plan.games.length < 2 || plan.index == '0') return null
      return plan.games.filter(game => game.index == '0').map(game => ({index: game.index, ratios: game.ratios}))[0]
    },
    afterPlan(plan, index) {
      if (!plan.games || plan.games.length < 2 || plan.index != '0') return null
      return plan.games.filter(game => game.index != '0').map(game => ({index: game.index, ratios: game.ratios}))[0]
    }
  },
}
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>
.ui-widget-preview {
  .preview-main {
    width: 902px;
    height: 604px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;

    .header {
      height: 60px;
      padding: 0 25px;
      background-color: #eaf1ff;
      display: flex;
      justify-content: space-between;
      align-items: center;

      p {
        color: #434a66;
        font-size: 18px;
        font-weight: 600;
      }

      .preview-close {
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

    .content {
      // position: absolute;
      // top: 60px;
      // left: 0;
      // right: 0;
      // bottom: 0;
      box-sizing: border-box;
      height: 544px;
      padding: 0px 0 25px 0;
      overflow: hidden;

      .content-inner {
        width: 100%;
        height: 100%;
        padding: 0 27px 0 27px;
        overflow: auto;
        position: relative;
      }

      .title {
        margin-top: 20px;
        width: 800px;
        height: 24px;
        font-size: 18px;
        font-weight: 600;
        color: rgba(67, 74, 102, 1);
        line-height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .data-view {
        position: relative;
        min-height: 205px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 1px 1px 5px 3px rgba(244, 245, 247, 0.48);
        border-radius: 10px;
        margin-top: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        padding: 10px 20px;

        & > * {
          margin: 5px 0;
        }

        .resultLogo {
          position: absolute;
          top: 15px;
          right: 21px;
          z-index: 2;
        }

        .match-name {
          align-self: flex-start;
          height: 27;
          font-size: 14px;

          span:nth-child(1) {
            display: inline-block;
            width: 52px;
            height: 27px;
            text-align: center;
            line-height: 27px;
            margin-right: 10px;
            border-radius: 2px;
            color: #fff;
          }

          span:nth-child(2) {
            color: #6d6f89;
          }

          .notstart {
            background-color: #ff5338;
          }

          .going {
            background-color: #fe550e;
          }

          .end {
            background-color: #d3d8e4;
          }
        }

        .team-name {
          min-width: 452px;
          height: 40px;
          display: flex;
          align-items: center;

          .left-name {
            width: 0;
            flex: 1;

            text-align: right;
            padding-right: 10px;
            color: #434a66;
            font-size: 14px;
            font-weight: 600;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .right-name {
            width: 0;
            flex: 1;

            padding-left: 10px;
            color: #434a66;
            font-size: 14px;
            font-weight: 600;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .logos {
            min-width: 142px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            img {
              width: 38px;
              height: 38px;
            }

            .vs {
              display: inline-block;
              width: 24px;
              height: 24px;
              color: #14162c;
              font-size: 18px;
              text-align: center;
              line-height: 24px;
              font-weight: 600;
            }

            .score {
              display: inline-block;
              color: #14162c;
              font-size: 18px;
              text-align: center;
              line-height: 24px;
              font-weight: 600;
              width: 85px !important;
            }
          }
        }

        .match-result {
          width: 452px;
          height: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .giveup {
            width: 66px;
            font-size: 20px;
            color: white;
            border-radius: 2px;
            text-align: center;
            line-height: 60px;
            margin-right: 8px;
          }

          .positive {
            background: rgba(255, 83, 56, 1);
          }

          .negative {
            background-color: rgb(101, 210, 117);
          }

          .zero {
            background-color: #f4f5f7;
            color: #434a66;
          }

          .recommend {
            position: relative;
            // background-image: url("~@src/assets/professor/recommend.png");
            // background-position: top left;
            // background-size: 24px 20px;
            // background-repeat: no-repeat;
            background-color: rgba(255, 150, 38, 0.2);

            &::after {
              position: absolute;
              content: '荐';
              display: inline-block;
              text-align: center;
              line-height: 20px;
              border-top-right-radius: 10px;
              border-bottom-right-radius: 10px;
              top: 0;
              left: 0;
              font-size: 12px;
              color: white;
              background: linear-gradient(45deg, #FF5A23, #FF9638);
              width: 24px;
              height: 20px;
            }
          }

          .loss-percent {
            height: 60px;
            border-radius: 2px;
            width: 0px;
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-right: 4px;
            background: rgba(244, 245, 247, 1);
            position: relative;

            span {
              font-size: 16px;
              color: #434a66;
              padding: 2px 0;
            }

            .red {
              position: absolute;
              right: 0;
              bottom: 0;
              font-size: 20px;
              color: #ff5338;
              width: 19px;
              height: 24px;
            }
          }

          .matchResult {
            background: url("../images/matchResult.png") right bottom no-repeat;
          }

          .recommend {
            position: relative;
            //background-image: url("../images/recommend.png");
            //background-position: top left;
            //background-size: 24px 20px;
            //background-repeat: no-repeat;
            color: #fff;
            background-color: $textColor;

            span {
              color: #fff;
            }
          }
        }
      }

      .text {
        color: #6d6f89;
        font-size: 14px;
        margin-top: 28px;
        word-break: break-all;
      }
    }
  }
}

::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 6px !important; /*高宽分别对应横竖滚动条的尺寸*/
  height: 6px !important;
  background: #ffffff !important;
  cursor: pointer !important;
}

::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px !important;
  -webkit-box-shadow: inset 0 0 5px rgba(240, 240, 240, 0.5) !important;
  background: #f1f1f1 !important;
  cursor: pointer !important;
}

::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(240, 240, 240, 0.5) !important;
  border-radius: 0 !important;
  background: #fff !important;
  cursor: pointer !important;
}
</style>
