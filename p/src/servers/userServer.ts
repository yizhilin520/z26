import { deleted, get, post, put } from '@/utils/require';

const livePassportApi = process.env.LIVE_PASSPORT_API;
const liveApi = process.env.LIVE_API;
const SportsApi = process.env.SPORTS_API;

/**
 * 获取login信息接口
 */
export const getLogin = (data: any) => post(`${livePassportApi}/user/login`, data);

/**
 * 获取注册时图形验证码
 */
export const getRandCode = () => get(`${livePassportApi}/user/randCode`);

/**
 * 获取注册时图形验证码
 */
export const getRegister = (data: any) => post(`${livePassportApi}/user/register`, data);

/**
 * 获取注册code信息接口
 */
export const getCode = (data: any) => post(`${livePassportApi}/user/sendSmsCode`, data);
/**
 * 查询聊天室用户信息接口
 */
export const getChatUserInfo = (data: any) => get(`${livePassportApi}/user/queryChatUserInfo`, data);

/**
 * 查询用户信息接口
 */
export const getUserInfo = (data: any) => get(`${livePassportApi}/user/getUserInfoById`, data);

/**
 * 绑定手机号接口
 */
export const bindPhone = (data: any) => post(`${livePassportApi}/user/bindPhone`, data);

/**
 * 修改手机号接口
 */
export const changePhone = (data: any) => post(`${livePassportApi}/user/changeMobile`, data);

/**
 * 修改密码接口
 */
export const changePassword = (data: any) => post(`${livePassportApi}/user/changePassword`, data);

/**
 * 用户关注主播列表
 */
export const getUserCareList = (data: any) => get(`${liveApi}/v1.1/concerned`, data);

/**
 * 更新用户字段接口
 */
export const updatePublicField = (data: any) => put(`${livePassportApi}/user/updatePublicField`, data);

/**
 * 退出登入接口
 */
export const getLoginOut = (data: any) => post(`${livePassportApi}/user/loginOut`, data);

/**
 * 获取改名卡数量
 */
export const getNickCardNum = (data: any) => get(`${livePassportApi}/user/getNameCardNumByUserId`, data);

/**
 * 修改用户昵称
 */
export const changeNickName = (data: any) => post(`${livePassportApi}/user/updateNickName`, data);

/**
 * 修改昵称
 */
export const getNickname = (data: any) => put(`${livePassportApi}/user/updatePublicField`, data);

/**
 * 取消关注
 */
export const getAttentionsAid = (data: any) => post(`${liveApi}/v1.1/attentions`, data);

/**
 * 充值客服列表
 */
export const getCustomerService = (data: any) => get(`${livePassportApi}/customerService/list`, data);

// 获取订阅赛事列表6条
export const getSubscribe = (data: any) => get(`${liveApi}/v1.0/reserves/starting`, data);

/**
 * 金币充值记录 列表
 */
export const getQueryUGoldRecharge = (data: any) => get(`${livePassportApi}/user/query/queryUGoldRecharge/PC`, data);
/**
 * 支出记录
 */
export const getExpenditureRecord = (data: any) => get(`${livePassportApi}/user/query/queryUGoldOut/PC`, data);
/**
 * 房管查询列表
 */
export const getRoomManageQueryList = (data: any) => post(`${liveApi}/anchor/roomManage/queryList`, data);
/**
 * 房管撤销
 */
export const getRoomManageRevoke = (data: any) => deleted(`${liveApi}/anchor/roomManage/revoke`, data);
/**
 * 房管添加
 */
export const getRoomManageAdd = (data: any) => post(`${liveApi}/anchor/roomManage/add`, data);
/**
 * 禁言用户列表
 */
export const getUserShutUpTime = (data: any) => get(`${liveApi}/v0.1/anchors/getUserShutUpTime`, data);
/**
 * 主播解除禁言
 */
export const getUnmuteForbidTalk = (data: any) => post(`${liveApi}/v0.1/anchors/forbidSendMsg/unmuteForbidTalk`, data);
/**
 * 新增禁言
 */
export const getShutUpForbidSendMsg = (data: any) => post(`${liveApi}/v0.1/anchors/forbidSendMsg`, data);

/**
 * 解除禁言
 * @doc http://yapi.qihang2021.cn:3000/project/47/interface/api/221
 */
export const unForbidSendMsg = (data) => post(`${liveApi}/v0.1/anchors/unforbidSendMsg`, data);
/**
 * 关联赛事
 */
export const getRoomsQueryMatchListInfo = (data: any) => get(`${liveApi}/v0.2/rooms/queryMatchListInfo`, data);
/**
 * 设置房间信息
 */
export const getStreamsLiveSetting = (data: any) => post(`${liveApi}/v0.1/streams/liveSetting`, data);
/**
 * 修改密码接口
 */
export const getChangePassword = (data: any) => post(`${livePassportApi}/user/changePassword`, data);
/**
 * 获取推流地址
 */
export const getStreamsPublishAddr = (data: any) => post(`${liveApi}/v0.1/streams/publishAddr`, data);
/**
 * 查询用户钱包
 */
export const getUserQueryWallet = (data: any) => get(`${livePassportApi}/user/query/wallet`, data);
/**
 * 登录日志列表
 */
export const getQueryLoginLog = (data: any) => get(`${livePassportApi}/user/queryLoginLog`, data);
/**
 * 更新用户基础设置
 */
export const updateOpensNotification = (data: any) => post(`${livePassportApi}/user/opensNotification`, data);
/**
 * 用户打开基础设置
 */
export const getOpensNotification = () => get(`${livePassportApi}/user/getOpensNotification`);
/**
 * 找回密码接口-身份验证
 */
export const getCheckIdentity = (data: any) => post(`${livePassportApi}/user/findPwdOneStep`, data);
/**
 * 找回密码接口-重置密码
 */
export const getResetPassword = (data: any) => post(`${livePassportApi}/user/resetPassword`, data);

/**
 * 用户头像图片上传
 * @doc http://yapi.qihang2021.cn:3000/project/29/interface/api/45
 */
export const updateUserImage = (data) => post(`${livePassportApi}/user/app/headImage`, data);

/**
 * 金豆_获取记录接口
 * @doc http://yapi.qihang2021.cn:3000/project/29/interface/api/487
 */
export const getUBeanFlowsDetail = (params) => get(`${livePassportApi}/user/v1/uBeanFlows`, params);

/**
 * 图片上传
 * @doc http://yapi.qihang2021.cn:3000/project/29/interface/api/101
 */
export const imageUpload = (data) => post(`${livePassportApi}/upload/image`, data);

/**
 * 获取宝箱
 * @doc http://yapi.qihang2021.cn:3000/project/29/interface/api/475
 */
export const getTreasureChestList = (data) => get(`${livePassportApi}/wallet/queryTreasurechest`, data);

/**
 * 打开宝箱
 * @doc http://yapi.qihang2021.cn:3000/project/29/interface/api/477
 */
export const openTreasureChest = (data) => get(`${livePassportApi}/wallet/openTreasurechest`, data);

/**
 * 用户未登录时，获取宝箱列表数据
 * @doc http://yapi.qihang2021.cn:3000/project/29/interface/api/497
 */
export const getInitTreasureChestList = () => get(`${livePassportApi}/wallet/getInitTreasurechest`);

/**
 * 踢人
 */
export const getkickOutUser = (data: any) => post(`${liveApi}/v0.5/anchors/kickOutUser`, data);

/**
 * 主播解除踢人
 */
export const getUnkickOutUser = (data: any) => post(`${liveApi}/v0.5/anchors/unkickOutUser`, data);
/**
 * 踢人列表
 */
export const getUserKickOutTime = (data: any) => get(`${liveApi}/v0.5/anchors/getUserKickOutTime`, data);

/**
 * 主播预约获取赛事列表
 * @doc http://yapi.qihang2021.cn:3000/project/47/interface/api/519
 */
export const getAnchorMatchList = (params: any) => get(`${liveApi}/v5/matchList`, params);

/**
 * 主播预约赛事列表
 * @doc http://yapi.qihang2021.cn:3000/project/47/interface/api/519
 */
export const getAnchorMatchApply = (data: any) => post(`${liveApi}/v5/matchApply`, data);

/**
 * 主播卖料-添加商品页面_获取自己的/平台的方案
 * @doc http://yapi.qihang2021.cn:3000/project/47/interface/api/699
 */
export const getPlanListForForecast = (params: any) => get(`${SportsApi}/v7/forecast/getPlansForForecast`, params);

/**
  * 主播卖料-设置推荐预测_主播已添加的推荐接口
  * @doc http://yapi.qihang2021.cn:3000/project/47/interface/api/703
  */
export const getMyPlanForecast = (params: any) => get(`${SportsApi}/v7/forecast/mySetPlansForForecasts`, params);

/**
  * 主播卖料-设置推荐预测_设置商品上架/下架接口
  * @doc http://yapi.qihang2021.cn:3000/project/47/interface/api/707
  */
export const setForecastStatus = (data: any) => post(`${SportsApi}/v7/forecast/setForecastStatus?planId=${data.planId}&userId=${data.userId}&status=${data.status}`, data);

/**
  * 主播卖料-设置推荐预测_设置商品置顶/取消置顶接口
  * @doc http://yapi.qihang2021.cn:3000/project/47/interface/api/711
  */
export const setForecastTop = (data: any) => post(`${SportsApi}/v7/forecast/setForecastTop?planId=${data.planId}&userId=${data.userId}&top=${data.top}`, data);

/**
  * 主播卖料-web直播--主播预测列表接口
  * @doc http://yapi.qihang2021.cn:3000/project/47/interface/api/719
  */
export const getAnchorOnSalePlan = (params: any) => get(`${SportsApi}/v7/forecast/getSalePlanForWeb`, params);

/**
 * 主播获取自己已经预约的赛事列表
 * @doc http://yapi.qihang2021.cn:3000/project/47/interface/api/543
 */
export const getAnchorMatchApplyList = (params: any) => get(`${liveApi}/v5/matchApplyList`, params);

/**
 * 验证用户是否是U球号专家
 */
export const getExpertExamineStatus = (data: any) => get(`${SportsApi}/v6/expertExamine/status`, data);
/**
 * U球号_专家申请提交
 */
export const getExpertExamineSubmit = (data: any) => post(`${SportsApi}/v6/expertExamine/submit`, data);

/**
 * 主播的礼物收益记录
 * @doc http://yapi.qihang2021.cn:3000/project/47/interface/api/727
 */
export const getGiftRevenueRecord = (data) => get(`${liveApi}/v0.7/anchor/getAnchorGifts`, data);
/**
 * 主播的带货收益
 * @doc http://yapi.qihang2021.cn:3000/project/47/interface/api/731
 */
export const getCommerceIncome = (data) => get(`${SportsApi}/v7/forecast/anchorCommerceIncome`, data);

/**
 * 获取web的配置
 * @doc http://yapi.qihang2021.cn:3000/project/29/interface/api/780
 */
export const getWebConfig = () => get(`${livePassportApi}/v6/getWebConfig`);

/**
 * 手机验证码登录接口
 * @doc http://yapi.qihang2021.cn:3000/project/29/interface/api/783
 */
export const mobileCodeLogin = (data) => post(`${livePassportApi}/user/codeLogin`, data);

/**
 * 查询主播用户的其他收益列表
 * @doc http://yapi.qihang2021.cn:3000/project/29/interface/api/798
 */
export const getAnchorOtherIncome = (data) => get(`${livePassportApi}/user/query/queryAnchorOtherIncome/PC`, data);

/**
 * 设置用户的银行卡信息
 * @doc http://yapi.qihang2021.cn:3000/project/29/interface/api/873
 */
export const setBindBankCardInfo = (data) => post(`${livePassportApi}/user/setBindCardInfo`, data);

/**
 * 用户申请提现
 * @doc http://yapi.qihang2021.cn:3000/project/29/interface/api/870
 */
export const applyWithdraw = (data) => post(`${livePassportApi}/user/applyWithdraw`, data);

/**
 * 查询用户兑换记录
 * @doc http://yapi.qihang2021.cn:3000/project/29/interface/api/876
 */
export const getUserWithdraw = (data) => get(`${livePassportApi}/user/query/userWithdraw`, data);

/**
 * 我的粉丝列表
 * @doc http://yapi.qihang2021.cn:3000/project/47/interface/api/882
 */
export const getMyFansList = (data) => get(`${liveApi}/v0.9/myFans`, data);

/**
 * 主播开播记录
 * @doc http://yapi.qihang2021.cn:3000/project/47/interface/api/891
 */
export const getMyTvHistory = (data) => get(`${liveApi}/v0.8/anchor/getTvHis`, data);

/**
 * 个人中心-我的消息列表
 * @doc http://yapi.qihang2021.cn:3000/project/29/interface/api/849
 */
 export const getMyNews = (data) => get(`${livePassportApi}/user/query/message`, data);

 /**
 * 个人中心-根据消息ID查询某个消息详情
 * @doc http://yapi.qihang2021.cn:3000/project/29/interface/api/849
 */
export const getNewsDetails = (data) => get(`${livePassportApi}/message/queryMessageById`, data);
