import { userAction } from '@/actions';
import { Action } from '@/types';
import { localStorageGet, localStoragePut } from '@/utils/regular';

export interface UserInfo {
  account?: string
  headImage?: string
  mobilePhone?: string | number | null
  nickName?: string
  sex?: number
  token?: string
  uid?: string
  level?: null
  roomId?: null
  isVip?: null
}
export interface UserStore {
  randCode: any
  userInfo: UserInfo
  userCenter: any
  careList: Array<any>
  cancelMsg: any,
  subscribeEvents: Array<any>
  kefuList: any,
  uBRecharge: any,
  ExpRecord: any,
  roomManage: any,
  roomManageAdd: any,
  ShutUpList:any,
  associateGame:any,
  nicknameMsg:any,
  roomAddMsg:any,
  shutMsg:any,
  liveSetMsg:any,
  ChangePasswMsg:any,
  publishAddr:any,
  wallet:any,
  LoginLog:any,
  openBasicS:any,
  concerned:any
}

const initStore: UserStore = {
  randCode: {},
  userInfo:
    localStorageGet('userInfo')
    ||
    {
      account: null,
      headImage: null,
      mobilePhone: null,
      nickName: null,
      sex: null,
      token: null,
      uid: null,
      level: null,
      roomId: null,
      isVip: null
    },
  userCenter: {},
  careList: [], // 关注的主播列表
  cancelMsg: '',
  subscribeEvents: [], // 获取订阅赛事列表6条
  kefuList: {},
  uBRecharge: {},  //金币充值记录
  ExpRecord: {},  // 支出记录
  roomManage: [],
  // roomManage: [1,2,3,4,5,6],
  roomManageAdd: {},
  ShutUpList:[],
  associateGame:[],
  nicknameMsg:'',
  roomAddMsg:'',
  shutMsg:'',
  liveSetMsg:'',
  ChangePasswMsg:'',
  publishAddr:{},
  wallet:{},
  LoginLog:{},
  openBasicS:{},
  concerned:[]
}
// 图形验证码
export default function userReducer(
  state: UserStore = initStore,
  action: Action
): UserStore {
  const data = {...state}
  try {
    switch (action.type) {
      // 更新randCode数据
      case `user/${userAction.UPDATE_RAND_CODE_REDUCER}`: {
        return Object.assign(data, {
          ...data,
          randCode: action.payload.data
        })
      }
      // 登陆
      case `user/${userAction.UPDATE_LOGIN_REDUCER}`: {
        localStoragePut('userInfo', action.payload.data)
        return Object.assign(data, {
          ...data,
          userInfo: action.payload.data
        })
      }
      case `user/${userAction.UPDATE_USER_INFO_REDUCER}`: {
        // console.log('用户信息', data)
        return Object.assign(data, {
          ...data,
          userCenter: action.payload.data
        })
      }
      case `user/${userAction.UPDATE_USER_CARE_LIST_REDUCER}`: {
        return Object.assign(data, {
          ...data,
          careList: action.payload.data
        })
      }
      case `user/${userAction.UPDATE_USERCARE_LIST_REDUCER}`: {
        return Object.assign(data, {
          ...data,
          concerned: action.payload.data
        })
      }
      // 退出登入
      case `user/${userAction.UPDATE_LoginOut_REDUCER}`: {
        localStorageGet('userInfo', true)
        return Object.assign(data, {
          ...action.payload || {},
        })
      }
      // 修改昵称
      case `user/${userAction.UPDATE_Nickname_REDUCER}`: {
        // console.log('nc',action.payload.code)
        // console.log('nc',action.payload.params)
        // 更改页面
        let ncName = data.userCenter
        if (action.payload.code === 200) {
          ncName.nickname = action.payload.params.nickname
        }
        return Object.assign(data, {
          ...data,
          nicknameMsg: action.payload.msg,
          userCenter: ncName
        })
      }
      // 取消关注
      case `user/${userAction.UPDATE_ATTENTIONSAID_REDUCER}`: {
        // 筛除
        const careList = data.careList.filter((item: any) => item.id !== action.payload.params.attention_uid)
        return Object.assign(data, {
          ...data,
          cancelMsg: action.payload.msg,
          careList: careList
        })
      }
      // 充值客服列表
      case `user/${userAction.UPDATE_CUSTOMERSERVICE_REDUCER}`: {
        return Object.assign(data, {
          ...data,
          kefuList: [...action.payload.data.qqList, ...action.payload.data.weList]
        })
      }
      // 获取订阅赛事列表6条
      case `user/${userAction.UPDATE_SUBSCRIBE}`: {
        return Object.assign(data, {
          ...data,
          subscribeEvents: action.payload.data
        })
      }
      // 金币充值记录
      case `user/${userAction.UPDATE_QUERYUGOLDRECHARGE_REDUCER}`: {
        return Object.assign(data, {
          ...data,
          msg: action.payload.msg,
          uBRecharge: action.payload.data
        })
      }
      // 支出记录
      case `user/${userAction.UPDATE_EXPENDITURERECORD_REDUCER}`: {
        return Object.assign(data, {
          ...data,
          ExpRecord: action.payload.data
        })
      }
      // 房管查询列表
      case `user/${userAction.UPDATE_ROOMMANAGE_REDUCER}`: {
        return Object.assign(data, {
          ...data,
          roomManage: action.payload.data.rows
        })
      }
      // 房管撤销
      case `user/${userAction.UPDATE_ROOMMANAGErevoke_REDUCER}`: {
        let roomManage2 = data.roomManage.filter((item: any) => item.id !== action.payload.params.id)
        // console.log('roomManage2',roomManage2)
        return Object.assign(data, {
          ...data,
          roomAddMsg: action.payload.msg,
          roomManage: roomManage2
        })
      }
      // 房管添加
      case `user/${userAction.UPDATE_ROOMMANAGEadd_REDUCER}`: {
        return Object.assign(data, {
          ...data,
          roomAddMsg: action.payload.msg
        })
      }
      // 禁言用户列表
      case `user/${userAction.UPDATE_GETUSERSHUTUPTIME_REDUCER}`: {
        return Object.assign(data, {
          ...data,
          ShutUpList: action.payload.data.rows
        })
      }
      case `user/${userAction.UPDATE_UNMUTEFORBIDTALK_REDUCER}`: {
        let shutuplist2 = data.ShutUpList.filter((item: any) => item.id !== action.payload.params.id)
        return Object.assign(data, {
          ...data,
          shutMsg: action.payload.msg,
          ShutUpList: shutuplist2
        })
      }
      case `user/${userAction.UPDATE_SHUTUPFORBIDSENDMSG_REDUCER}`: {
        return Object.assign(data, {
          ...data,
          shutMsg: action.payload.msg
        })
      }
      // 直播设置-关联赛事
      case `user/${userAction.UPDATE_ROOMSQUERYMATCHLISTINFO_REDUCER}`: {
        return Object.assign(data, {
          ...data,
          msg: action.payload.msg,
          associateGame: action.payload.data,
        })
      }
      // 设置房间信息
      case `user/${userAction.UPDATE_LIVESETTING_REDUCER}`: {
        return Object.assign(data, {
          ...data,
          liveSetMsg: action.payload.msg
        })
      }
      // 修改密码接口
      case `user/${userAction.UPDATE_CHANGEPASSWORD_REDUCER}`: {
        return Object.assign(data, {
          ...data,
          ChangePasswMsg: action.payload.msg
        })
      }
      // 获取推流地址
      case `user/${userAction.UPDATE_STREAMSPUBLISHADDR_REDUCER}`: {
        // console.log('推流地址', action.payload.data)
        return Object.assign(data, {
          ...data,
          publishAddr: action.payload.data
        })
      }
       // 查询用户钱包
       case `user/${userAction.UPDATE_USERQUERYWALLET_REDUCER}`: {
        return Object.assign(data, {
          ...data,
          wallet: action.payload.data
        })
      }
       // 登录日志
       case `user/${userAction.UPDATE_QUERYLOGINLOG_REDUCER}`: {
        return Object.assign(data, {
          ...data,
          LoginLog: action.payload.data
        })
      }
       // 用户打开基础设置
       case `user/${userAction.UPDATE_OPENSNOTIFICATION_REDUCER}`: {
        return Object.assign(data, {
          ...data,
          openBasicS: action.payload.data
        })
      }
      case `user/${userAction.UPDATE_USER_HEAD_IMAGE}`:{
        const userInfo = {
          ...data.userInfo||{},
          headImage: action.payload.data
        }
        sessionStoragePut('userInfo', userInfo)
        return Object.assign(data,{
          ...data,
          userCenter:{
            ...data.userCenter||{},
            headImage: action.payload.data
          },
          userInfo
        })
      }

      default: {
        return data;
      }
    }
  } catch (error) {
    return data;
  }
}
