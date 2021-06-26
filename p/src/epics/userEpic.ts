import { ofType, Epic } from 'redux-observable'
import { mergeMap, map } from 'rxjs/operators'
import { PayloadIn, PayloadOut } from '@/types'
import { userApi } from '@/servers'
import { userAction } from '@/actions'
import { createAction } from '@/utils/helpers'
import { HttpCode } from '@/enums'
import { sessionStoragePut } from '@/utils/regular'

/**
 * 登录获取用户信息
 * @param $action
 */
export const getLogin: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_LOGIN_EPIC}`),
    mergeMap(action => {
      return userApi.getLogin(action.payload).pipe(
        map(res => {
          try {
            action?.callback(res?.data)
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}


/**
 * 获取图形验证码
 * @param $action
 */
export const getRandCode: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_RAND_CODE_EPIC}`),
    mergeMap(action => {
      return userApi.getRandCode().pipe(
        map(res => {
          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                `user/${userAction.UPDATE_RAND_CODE_REDUCER}`,
                {
                  data: res.data.data
                }
              )
            }
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}

/**
 * 注册
 * @param $action
 */
export const getRegister: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_REGISTER_EPIC}`),
    mergeMap(action => {
      return userApi.getRegister(action.payload).pipe(
        map(res => {
          try {
            action?.callback({ ...res?.data })
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}

/**
 * 获取找回、绑定验证码
 * @param $action
 */
export const getCode: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_CODE_EPIC}`),
    mergeMap(action => {
      return userApi.getCode(action.payload).pipe(
        map(res => {
          try {
            action?.callback({ ...res?.data })
            /* if (res.data.status_code === HttpCode.SUCCESS) {
              return createAction(
                `user/${userAction.UPDATE_CODE_REDUCER}`,
                {
                  data: res.data.data
                }
              )
            } */
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}
/**
 * 绑定手机号
 * @param $action
 */
export const bindPhone: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_BINDPHONE_EPIC}`),
    mergeMap(action => {
      return userApi.bindPhone(action.payload).pipe(
        map(res => {
          try {
            action?.callback({ ...res?.data })
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}

/**
 * 获取用户信息
 * @param $action
 */
export const getUserInfo: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_USER_INFO}`),
    mergeMap(action => {
      return userApi.getUserInfo(action.payload).pipe(
        map(res => {
          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                `user/${userAction.UPDATE_USER_INFO_REDUCER}`,
                {
                  data: res.data.data
                }
              )
            }
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}

/**
 * 查询聊天室用户信息接口
 * @param $action
 */
export const getChatUserInfo: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_CHAT_USER_INFO}`),
    mergeMap(action => {
      return userApi.getChatUserInfo(action.payload).pipe(
        map(res => {
          try {
            action?.callback({ ...res.data })
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}

/**
 * 获取用户关注列表
 * @param $action
 */
export const getUserCareList: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_USER_CARE_LIST}`),
    mergeMap(action => {
      return userApi.getUserCareList(action.payload).pipe(
        map(res => {
          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                `user/${userAction.UPDATE_USER_CARE_LIST_REDUCER}`,
                {
                  data: res.data.data
                }
              )
            }
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}
export const getUserCareList2: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_USERCARE_LIST}`),
    mergeMap(action => {
      return userApi.getUserCareList(action.payload).pipe(
        map(res => {
          try {
            action?.callback({ ...res.data })
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}

/**
 * 退出登入接口
 * @param $action
 */
export const getLoginOut: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_LoginOut}`),
    mergeMap(action => {
      return userApi.getLoginOut(action.payload).pipe(
        map(res => {
          try {
            if (res.data.code) {
              // console.log(res)
              return createAction(
                `user/${userAction.UPDATE_LoginOut_REDUCER}`,
                {
                  userInfo:{}
                }
              )
            }
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}

/**
 * 修改昵称
 * @param $action
 */
export const getNickname: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_Nickname_Epic}`),
    mergeMap(action => {
      return userApi.getNickname(action.payload).pipe(
        map(res => {
          try {
            if (res.data.code) {
              // console.log(res)
              return createAction(
                `user/${userAction.UPDATE_Nickname_REDUCER}`,
                {
                  code: res.data.code,
                  params: action.payload,
                  msg: res.data.msg
                }
              )
            }
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}

/**
 * 取消关注
 * @param $action
 */
export const getAttentionsAid: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_ATTENTIONSAID_EPIC}`),
    mergeMap(action => {
      return userApi.getAttentionsAid(action.payload).pipe(
        map(res => {
          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                `user/${userAction.UPDATE_ATTENTIONSAID_REDUCER}`,
                {
                  data: res.data.data,
                  msg: res.data.msg,
                  params: action.payload
                }
              )
            }
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}

/**
 * 充值客服列表
 * @param $action
 */
export const getCustomerService: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_CUSTOMERSERVICE_EPIC}`),
    mergeMap(action => {
      return userApi.getCustomerService(action.payload).pipe(
        map(res => {
          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                `user/${userAction.UPDATE_CUSTOMERSERVICE_REDUCER}`,
                {
                  data: res.data.data
                }
              )
            }
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}
/**
 * 金币充值记录
 * @param $action
 */
export const getQueryUGoldRecharge: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_QUERYUGOLDRECHARGE_EPIC}`),
    mergeMap(action => {
      return userApi.getQueryUGoldRecharge(action.payload).pipe(
        map(res => {
          // console.log(res)
          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                `user/${userAction.UPDATE_QUERYUGOLDRECHARGE_REDUCER}`,
                {
                  msg: res.data.msg,
                  data: res.data.data
                }
              )
            }
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}

/**
 * 获取订阅赛事列表6条
 * @param $action
 */
export const getSubscribe: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_SUBSCRIBE}`),
    mergeMap(action => {
      return userApi.getSubscribe(action.payload).pipe(
        map(res => {
          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                `user/${userAction.UPDATE_SUBSCRIBE}`,
                {
                  data: res.data.data
                }
              )
            }
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}

/**
 * 支出记录
 * @param $action
 */
export const getExpenditureRecord: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_EXPENDITURERECORD_EPIC}`),
    mergeMap(action => {
      return userApi.getExpenditureRecord(action.payload).pipe(
        map(res => {
          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                `user/${userAction.UPDATE_EXPENDITURERECORD_REDUCER}`,
                {
                  data: res.data.data
                }
              )
            }
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}
/**
 * 房管查询列表
 * @param $action
 */
export const getRoomManageQueryList: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_ROOMMANAGE_EPIC}`),
    mergeMap(action => {
      return userApi.getRoomManageQueryList(action.payload).pipe(
        map(res => {
          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                `user/${userAction.UPDATE_ROOMMANAGE_REDUCER}`,
                {
                  data: res.data.data
                }
              )
            }
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}

/**
 * 房管撤销
 * @param $action
 */
export const getRoomManageRevoke: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_ROOMMANAGErevoke_EPIC}`),
    mergeMap(action => {
      return userApi.getRoomManageRevoke(action.payload).pipe(
        map(res => {
          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                `user/${userAction.UPDATE_ROOMMANAGErevoke_REDUCER}`,
                {
                  msg: res.data.msg,
                  params: action.payload
                }
              )
            }
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}
/**
 * 房管添加
 * @param $action
 */
export const getRoomManageAdd: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_ROOMMANAGEadd_EPIC}`),
    mergeMap(action => {
      return userApi.getRoomManageAdd(action.payload).pipe(
        map(res => {
          try {
            if (res.data.code) {
              return createAction(
                `user/${userAction.UPDATE_ROOMMANAGEadd_REDUCER}`,
                {
                  msg: res.data.msg
                }
              )
            }
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}
/**
 * 禁言用户列表
 * @param $action
 */
export const getUserShutUpTime: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_GETUSERSHUTUPTIME_EPIC}`),
    mergeMap(action => {
      return userApi.getUserShutUpTime(action.payload).pipe(
        map(res => {
          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                `user/${userAction.UPDATE_GETUSERSHUTUPTIME_REDUCER}`,
                {
                  msg: res.data.msg,
                  data: res.data.data
                }
              )
            }
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}
/**
 * 主播解除禁言
 * @param $action
 */
export const getUnmuteForbidTalk: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_UNMUTEFORBIDTALK_EPIC}`),
    mergeMap(action => {
      return userApi.getUnmuteForbidTalk(action.payload).pipe(
        map(res => {
          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                `user/${userAction.UPDATE_UNMUTEFORBIDTALK_REDUCER}`,
                {
                  msg: res.data.msg,
                  params: action.payload
                }
              )
            }
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}
/**
 * 新增禁言
 * @param $action
 */
export const getShutUpForbidSendMsg: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_SHUTUPFORBIDSENDMSG_EPIC}`),
    mergeMap(action => {
      return userApi.getShutUpForbidSendMsg(action.payload).pipe(
        map(res => {
          try {
            action?.callback({...res.data})
            if (res.data.code) {
              return createAction(
                `user/${userAction.UPDATE_SHUTUPFORBIDSENDMSG_REDUCER}`,
                {
                  msg: res.data.msg
                }
              )
            }
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}
/**
 * 关联赛事
 * @param $action
 */
export const getRoomsQueryMatchListInfo: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_ROOMSQUERYMATCHLISTINFO_EPIC}`),
    mergeMap(action => {
      return userApi.getRoomsQueryMatchListInfo(action.payload).pipe(
        map(res => {
          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                `user/${userAction.UPDATE_ROOMSQUERYMATCHLISTINFO_REDUCER}`,
                {
                  msg: res.data.msg,
                  data: res.data.data
                }
              )
            }
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}
/**
 * 设置房间信息
 * @param $action
 */
export const getStreamsLiveSetting: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_LIVESETTING_EPIC}`),
    mergeMap(action => {
      return userApi.getStreamsLiveSetting(action.payload).pipe(
        map(res => {
          try {
            action?.callback({ ...res?.data })
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}
/**
 * 修改密码接口
 * @param $action
 */
export const getChangePassword: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_CHANGEPASSWORD_EPIC}`),
    mergeMap(action => {
      return userApi.getChangePassword(action.payload).pipe(
        map(res => {
          try {
            if (res.data.code) {
              return createAction(
                `user/${userAction.UPDATE_CHANGEPASSWORD_REDUCER}`,
                {
                  msg: res.data.msg
                }
              )
            }
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}
/**
 * 获取推流地址
 * @param $action
 */
export const getStreamsPublishAddr: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_STREAMSPUBLISHADDR_EPIC}`),
    mergeMap(action => {
      return userApi.getStreamsPublishAddr(action.payload).pipe(
        map(res => {
          try {
            action?.callback({ ...res?.data })
            // if (res.data.code === HttpCode.SUCCESS) {
            //   return createAction(
            //     `user/${userAction.UPDATE_STREAMSPUBLISHADDR_REDUCER}`,
            //     {
            //       msg: res.data.msg,
            //       data: res.data.data
            //     }
            //   )
            // }
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}
/**
 * 查询用户钱包
 * @param $action
 */
export const getUserQueryWallet: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_USERQUERYWALLET_EPIC}`),
    mergeMap(action => {
      return userApi.getUserQueryWallet(action.payload).pipe(
        map(res => {
          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                `user/${userAction.UPDATE_USERQUERYWALLET_REDUCER}`,
                {
                  data: res.data.data
                }
              )
            }
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}
/**
 * 登录日志列表
 * @param $action
 */
export const getQueryLoginLog: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_QUERYLOGINLOG_EPIC}`),
    mergeMap(action => {
      return userApi.getQueryLoginLog(action.payload).pipe(
        map(res => {
          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                `user/${userAction.UPDATE_QUERYLOGINLOG_REDUCER}`,
                {
                  data: res.data.data
                }
              )
            }
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}
/**
 * 用户打开基础设置
 * @param $action
 */
export const getOpensNotification: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_OPENSNOTIFICATION_EPIC}`),
    mergeMap(action => {
      return userApi.updateOpensNotification(action.payload).pipe(
        map(res => {
          try {
            action?.callback({ ...res?.data })
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}
/**
 * 找回密码接口-身份验证
 * @param $action
 */
export const getCheckIdentity: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_CHECKIDENTITY_EPIC}`),
    mergeMap(action => {
      return userApi.getCheckIdentity(action.payload).pipe(
        map(res => {
          try {
            action?.callback({ ...res?.data })
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}
/**
 * 找回密码接口-重置密码
 * @param $action
 */
export const getResetPassword: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`user/${userAction.GET_RESETPASSWORD_EPIC}`),
    mergeMap(action => {
      return userApi.getResetPassword(action.payload).pipe(
        map(res => {
          try {
            action?.callback({ ...res?.data })
            return createAction('app')
          } catch (error) {
            return createAction('app')
          }
        })
      )
    })
  )
}


