import http from '@/common/fetch';

const baseUrl = process.env.SPORTS_API;

/**
 * 推荐专家
 * @doc http://yapi.qihang2021.cn:3000/project/23/interface/api/491
 */
export const getExpertRecommend = (params) => http.get(`${baseUrl}/v4/expert/top`, { params });
/**
 * 方案推荐
 * @doc http://yapi.qihang2021.cn:3000/project/23/interface/api/493
 */
export const getExpertPlan = (params) => http.get(`${baseUrl}/v4/expert/plan`, { params });

/**
 * 赛事列表
 * @doc http://yapi.qihang2021.cn:3000/project/35/interface/api/409
 */
export const getMatchList = (params) => http.get(`${baseUrl}/v1/app/matchList`, { params });
/**
 * 热门赛事列表
 * @doc http://yapi.qihang2021.cn:3000/project/35/interface/api/411
 */
export const getHotMatchList = (params) => http.get(`${baseUrl}/v1/app/hotList`, { params });
/**
 * 赛事详情
 * @doc http://yapi.qihang2021.cn:3000/project/35/interface/api/413
 */
export const getMatchInfo = (params) => http.get(`${baseUrl}/v1/app/matchInfo`, { params });

/**
 * 获取某场比赛的365视频源列表
 * @doc http://yapi.qihang2021.cn:3000/project/35/interface/api/441
 */
export const getLive365List = (params) => http.get(`${baseUrl}/v1/getLive365`, { params });

/**
 * 足球技术统计
 * @doc http://yapi.qihang2021.cn:3000/project/35/interface/api/431
 */
export const getFootballRealtime = (matchId) => http.get(`${baseUrl}/v1/app/realtime/${matchId}`);

/**
 * 获取篮球赛况
 * @doc http://yapi.qihang2021.cn:3000/project/23/interface/api/19
 */
export const getBasketballMatchDetail = (params) => http.get(`${baseUrl}/v3/app/bmatchDetail`, { params });

/**
 * 获取某场比赛的指数数据
 * @doc http://yapi.qihang2021.cn:3000/project/35/interface/api/443
 */
export const getMatchOdds = (params) => http.get(`${baseUrl}/v1/getMatchOdds`, { params });
