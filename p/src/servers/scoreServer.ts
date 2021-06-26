import { get, post } from '@/utils/require';

const sportsApi = process.env.SPORTS_API;
const liveApi = process.env.LIVE_API;
const livePassportApi = process.env.LIVE_PASSPORT_API;

/**
 * 获取赛事预告
 */
export const getNotice = (data: any) => get(`${sportsApi}/v1/pc/matchNotice`, data);

/**
 * 获取赛事
 */
export const getMatch = (data: any) => get(`${sportsApi}/v1/pc/matchList`, data);

/**
 * 指数走势2s
 */
export const getExponentTrend = (data: any) => get(`${sportsApi}/v1/pc/matchOddsList`, data);
/**
 * 赛事详情
 */
export const getMatchDetails = (data: any) => get(`${sportsApi}/v1/getMatchOdds`, data);

/**
 * 单场PC赛事详情
 */
export const getMatchInfo = (data: any) => get(`${sportsApi}/v1/pc/matchInfo`, data);

/**
 * app实时统计
 */
export const getAppRealtime = (data: any) => get(`${sportsApi}/v1/app/realtime/${data.match_id}`, data);

/**
 * 获取足球技术统计
 * @doc http://yapi.qihang2021.cn:3000/project/35/interface/api/431
 */
export const getFootballRealtime = (data) => get(`${sportsApi}/v1/app/realtime/${data.matchId}`, data);

/**
 * 获取篮球技术统计
 * @doc http://yapi.qihang2021.cn:3000/project/35/interface/api/425
 */
export const getBasketballRealtime = (data) => get(`${sportsApi}/v1/app/realtime/basketball/${data.matchId}`, data);

/**
 * 事件统计
 */
export const getEventStatistics = (data: any) => get(`${sportsApi}/v1/ftrend`, data);

/**
 * 根据赛事id查询直播信息
 */
export const getLiveInfoById = (data: any) => post(`${liveApi}/v0.2/rooms/getRoomsByMatchId`, data);
/**
 * 根据room id查询直播详情
 */
export const getLiveDetailsByRoom = (data: any) => get(`${liveApi}/v0.1/room/detail`, data);

/**
 * 获取比赛用户关注列表
 * @doc http://yapi.qihang2021.cn:3000/project/35/interface/api/465
 */
export const getMatchFollowList = (data) => get(`${sportsApi}/v3/followed-match/getFollowPc`, data);

/**
 * 用户关注赛事
 * @doc http://yapi.qihang2021.cn:3000/project/35/interface/api/461
 */
export const addMatchFollow = (data) => post(`${sportsApi}/v3/followed-match/add`, data);

/**
 * 用户取消赛事关注
 * @doc http://yapi.qihang2021.cn:3000/project/35/interface/api/463
 */
export const cancelMatchFollow = (data) => post(`${sportsApi}/v3/followed-match/cancel`, data);

/**
 * 获取某场比赛的365视频源列表
 * @doc http://yapi.qihang2021.cn:3000/project/35/interface/api/441
 */
export const getLive365 = (data) => get(`${sportsApi}/v1/getLive365`, data);

/**
 * 推荐专家
 * @doc http://yapi.qihang2021.cn:3000/project/23/interface/api/491
 */
export const getExpertRecommend = (data) => get(`${sportsApi}/v4/expert/top`, data);

/**
 * 方案推荐
 * @doc http://yapi.qihang2021.cn:3000/project/23/interface/api/493
 */
export const getExpertPlan = (data) => get(`${sportsApi}/v4/expert/plan`, data);

/**
 * 方案市场
 * @doc http://yapi.qihang2021.cn:3000/project/23/interface/api/507
 */
export const getExpertPlanMarket = (data) => get(`${sportsApi}/v4/es/expert/plan`, data);

/**
 * 方案详情
 * @doc http://yapi.qihang2021.cn:3000/project/23/interface/api/495
 */
export const getExpertPlanDetail = (data) => get(`${sportsApi}/v4/obs/plan_detail/${data.planId}`, data);

/**
 * 专家主页明细
 * @doc http://yapi.qihang2021.cn:3000/project/23/interface/api/509
 */
export const getExpertPlanInfo = (data) => get(`${sportsApi}/v4/plan/planInfo`, data);

/**
 * 专家信息及专家方案近期战绩统计
 * @doc http://yapi.qihang2021.cn:3000/project/23/interface/api/513
 */
export const getExpertPlanStat = (data) => get(`${sportsApi}/v4/plan/expert/stat`, data);

/**
 * 红单方案支付
 * @doc http://yapi.qihang2021.cn:3000/project/23/interface/api/505
 */
export const goldFlowPurchasePlan = (data) => post(`${livePassportApi}/goldFlow/purchase/plan`, data);

/**
 * 获取用户购买方案记录
 * @doc http://yapi.qihang2021.cn:3000/project/23/interface/api/499
 */
export const getExpertPurchaseList = (data) => get(`${sportsApi}/v4/expert/purchase/list`, data);

/**
 * 专家在售和历史方案列表接口
 * @doc http://yapi.qihang2021.cn:3000/project/23/interface/api/631
 */
export const getPlanExpertList = (data) => get(`${sportsApi}/v4/plan/expert/list`, data);

/**
 * 获取热门比赛
 */
export const getHotScoreList = () => get(`${sportsApi}/v1/pc/hotList`);
