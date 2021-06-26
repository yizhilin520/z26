import { homeAction } from '@/actions'
import { Action } from '@/types'
import { deepCopy, generateMsgId } from '@/utils/common'

interface Data {
  page: string | number
  pages: string | number
  rows: []
  size: string | number
  total: string | number
}

export interface UGlod {
  hqBalance: number
  nuggetsNum: number
  ubeanNum: number
  ugoldNum: number
  userId: string
}

export interface HomeStore {
  data: any,
  bottomData: any,
  interestingAnchor: any,
  focusAnchor: any,
  reserves: any
  billboard: any[]
  giftList: any[]
  reuseLiveList: any[]
  controlLogin: { [name: string]: any },
  basketBall: any[],
  djMatch:any[],
  djLive: any[],
  footBallLive: any[],
  uGlod: UGlod
}

const initStore: HomeStore = {
  data: [],
  bottomData: [],
  interestingAnchor: [],
  focusAnchor: [],
  reserves: [],
  billboard: [], //榜单
  giftList: [], // 直播间礼物列表
  reuseLiveList: [], //顶部正在热播下拉列表
  controlLogin: {
    open: false,
    activeIndex: 0
  },
  basketBall: [],
  djMatch:[],
  djLive: [],
  footBallLive: [],
  uGlod: { // 金币金豆数据
    hqBalance: 0,
    nuggetsNum: 0,
    ubeanNum: 0,
    ugoldNum: 0,
    userId: ''
  }
}

export default function HomeReducer(
  state: HomeStore = initStore,
  action: Action
): HomeStore {
  try {
    const copyState = deepCopy(state)
    switch (action.type) {
      // 开启和关闭login
      case `home/${homeAction.UPDATE_OPEN_LOGIN}`: {
        // debugger
        return Object.assign(copyState, {
          ...copyState,
          controlLogin: {
            ...copyState.controlLogin,
            open: !copyState.controlLogin.open,
            activeIndex: action.payload.activeIndex || 0
          }
        })
      }
      // 更新6条数据
      case `home/${homeAction.UPDATE_LIVE_LIST_REDUCER}`: {
        return Object.assign(copyState, {
          ...copyState,
          data: action.payload.data
        })
      }
      // 更新8条数据
      case `home/${homeAction.UPDATE_HOT_NOW_LIVE_LIST_REDUCER}`: {
        return Object.assign(copyState, {
          ...copyState,
          bottomData: action.payload.data
        })
      }
      // header复用接口
      case `home/${homeAction.REUSE_UPDATE_HOT_NOW_LIVE_LIST_REDUCER}`: {
        return Object.assign(copyState, {
          ...copyState,
          reuseLiveList: action.payload.data
        })
      }
      // 足球接口
      case `home/${homeAction.UPDATE_HOT_NOW_LIVE_F_BALL}`: {
        return Object.assign(copyState, {
          ...copyState,
          footBallLive: action.payload.data
        })
      }
      // 篮球接口
      case `home/${homeAction.UPDATE_HOT_NOW_LIVE_BASKET_BALL}`: {
        return Object.assign(copyState, {
          ...copyState,
          basketBall: action.payload.data
        })
      }
      // 电竞接口
      case `home/${homeAction.UPDATE_HOT_NOW_LIVE_DJ}`: {
        return Object.assign(copyState, {
          ...copyState,
          djLive: action.payload.data
        })
      }
      // 有趣直播列表
      case `home/${homeAction.UPDATE_INTERESTING_ANCHOR_REDUCER}`: {
        return Object.assign(copyState, {
          ...copyState,
          interestingAnchor: action.payload.data
        })
      }
      // 直播订阅的比赛
      case `home/${homeAction.UPDATE_SUBSCRIP_GAME_REDUCER}`: {
        // console.log(copyState)
        return Object.assign(copyState, {
          ...copyState,
          reserves: action.payload.data.rows
        })
      }
      // 直播订阅 关注主播--关注列表
      case `home/${homeAction.UPDATE_FOCUS_ANCHOR_REDUCER}`: {
        // console.log(copyState)

        return Object.assign(copyState, {
          ...copyState,
          focusAnchor: action.payload.data
        })
      }
      // 榜单
      case `home/${homeAction.UPDATE_BILLBOARD}`: {
        return Object.assign(copyState, {
          ...copyState,
          billboard: action.payload.data
        })
      }
      // 直播间礼物列表
      case `home/${homeAction.UPDATE_GIFT_LIST}`: {
        return Object.assign(copyState, {
          ...copyState,
          giftList: action.payload.data
        })
      }
      // 金币所有数据
      case `home/${homeAction.UPDATE_USER_UGLODNUM}`: {
        return Object.assign(copyState, {
          ...copyState,
          uGlod: { ...copyState?.uGlod, ...action?.payload?.data }
        })
      }
      default: {
        return copyState
      }
    }
  } catch (error) {
    return state
  }
}
