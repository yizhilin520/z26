import { get, post, put, deleted } from '@/utils/require';

const liveApi = process.env.LIVE_API
const livePassportApi = process.env.LIVE_PASSPORT_API


/**
 * 获取preinfo信息接口
 */
export const getLiveList = (data: any) => {
  return get(`${liveApi}/v1.2/rooms/pc`, data)
}


/**
 * 获取preinfo信息接口
 */
export const getInterestingAnchor = (data: any) => {
  return get(`${liveApi}/v0.1/anchors/mostFans`, data)
}


// 直播订阅的比赛
export const getSubscripGame = (data: any) => {
  return post(`${liveApi}/v1.0/reserves`, data)
}

/**
 * 直播订阅 关注主播--关注列表
 */
export const getFocusAnchor = (data: any) => {
  return get(`${liveApi}/v1.1/concerned`, data)
}

/**
 * 榜单
 */
export const getBillboard = (data: any) => {
  return get(`${liveApi}/gift/queryAnchorGiftList`, data)
}
/**
 * 房间详情
 */
export const getRoomDetail = (data: any) => {
  return get(`${liveApi}/v0.1/room/detail`, data)
}
/**
 * 关注主播接口
 */
export const getFollow = (data: any) => {
  return put(`${liveApi}/v1.1/attentions`, data)
}

/**
 * 取消关注主播接口
 */
export const cancelFollow = (data: any) => {
  return post(`${liveApi}/v1.1/attentions`, data)
}


/**
 * 获取聊天室禁言字典
 */
export const getDictionary = (data: any) => {
  return get(`${liveApi}/v0.1/anchors/forbidOptionalList`, data)
}

/**
 * 查询是否是房管或者主播
 */
export const getChatUserState = (data: any) => {
  console.log('请求了')
  return post(`${liveApi}/v1.1/room/getUserRelationship`, data)
}
/**
 * 获取直播间礼物列表
 */
export const getGiftList = (data: any) => {
  return get(`${liveApi}/gift/queryGiftList`, data)
}
/**
 * 赠送礼物前查询钱包
 */
export const queryUserBalance = (data: any) => {
  return get(`${liveApi}/gift/queryUserBalance`, data)
}
/**
 * 赠送礼物
 */
export const userGiveGifts = (data: any) => {
  return post(`${liveApi}/gift/userGivesGifts`, data)
}
/**
 * 用户预约(订阅)
 */
export const userReserves = (data: any) => {
  return post(`${liveApi}/v2.0/reserves`, data)
}
/**
 * 热门搜索词列表
 */
 export const getSearchHotKey = (data: any) => {
  return get(`${livePassportApi}/v6/getHotKeyByPage`, data)
}
/**
 * 主播搜索
 */
 export const searchAnchor = (data: any) => {
  return get(`${liveApi}/v0.4/anchor/search`, data)
}
/**
 * 直播间搜索
 */
 export const searchRoom = (data: any) => {
  return get(`${liveApi}/v0.4/rooms/search`, data)
}
