/**
 * @intro: 球会号专家接口.
 */
import { get, post } from '@/utils/require';

const baseUrl = process.env.SPORTS_API;
const BaseV6Url = `${baseUrl}/v6`;
/**
 * 申请提交
 * @doc https://yapi.xiaomingsport.com/project/59/interface/api/21272
 */
export const applySubmit = (data) => post(`${BaseV6Url}/expertExamine/submit`, data);

/**
 * 获取用户状态
 * @doc https://yapi.xiaomingsport.com/project/59/interface/api/21282
 * @return {data:{status: 审核状态 0:待审核 1:审核通过 2:退回 null:未申请过球会号专家}}
 */
export const getUserStatus = (userId) => get(`${BaseV6Url}/expertExamine/status`, { userId });

/**
 * @doc: https://yapi.xiaomingsport.com/project/59/interface/api/21307
 * @description:获取账户信息
 */
export const getClubAccount = (userId) => get(`${BaseV6Url}/expertExamine/userExpertInfo`, { userId });

/**
 * 专家号修改简介
 * @doc https://yapi.xiaomingsport.com/project/59/interface/api/21727
 */
export const editIntroduction = (params) => post(`${BaseV6Url}/expert/sz_introduction`, params);

/**
 * 获取赛事列表
 * @doc https://yapi.xiaomingsport.com/project/59/interface/api/21332
 */
export const getExpertMatches = (params) => get(`${BaseV6Url}/expert_plan/matches`, params);

/**
 * 文章列表
 * @doc https://yapi.xiaomingsport.com/project/59/interface/api/21472
 */
export const getProfessorPlans = (params) => get(`${BaseV6Url}/expert/myPlan`, params);

/**
 * 撤回，删除
 * @doc https://yapi.xiaomingsport.com/project/59/interface/api/21762
 */
export const updatePlanStatus = (params) => get(`${BaseV6Url}/expert/delMyPlan`, params);

/**
 * 获取方案详情
 * @doc https://yapi.xiaomingsport.com/project/59/interface/api/21767
 */
export const getDetail = (params) => get(`${BaseV6Url}/expert_plan/detail`, params);

/**
 * 专家号我的通知
 * @doc https://yapi.xiaomingsport.com/project/59/interface/api/21477
 */
export const getMessageList = (params) => get(`${BaseV6Url}/notice/info`, params);

/**
 * 文章收益
 * @doc https://yapi.xiaomingsport.com/project/59/interface/api/21712
 */
export const getArticleIncome = (params) => get(`${BaseV6Url}/expert_plan/income`, params);

/**
 * 收益详情
 * @doc https://yapi.xiaomingsport.com/project/59/interface/api/21717
 */
export const getArticleIncomeDetail = (params) => get(`${BaseV6Url}/expert_plan/incomeDetail`, params);

/**
 * 获取玩法类型
 * @doc https://yapi.xiaomingsport.com/project/59/interface/api/21607
 */
export const getPlayTypes = () => get(`${BaseV6Url}/expert_plan/play_types`);

/**
 * 获取用户数据，包括今天还能发多少篇文章、以及收费文章的数量、方案的价格区间
 * @doc https://yapi.xiaomingsport.com/project/59/interface/api/21342
 */
export const getUserInfos = (userId) => get(`${BaseV6Url}/expert_plan/user_data`, { userId });

/**
 * 获取赔率单选和双选的限制
 * @doc https://yapi.xiaomingsport.com/project/59/interface/api/21337
 */
export const getPlanRatioLimit = () => get(`${BaseV6Url}/expert_plan/ratio_limit`);

/**
 * 发布文章
 * @doc https://yapi.xiaomingsport.com/project/59/interface/api/21347
 */
export const publishArticle = (data) => post(`${BaseV6Url}/expert_plan/publish`, data);

/**
 * 获取文章详情
 * @doc https://yapi.xiaomingsport.com/project/59/interface/api/21767
 */
export const getArticleDetail = (params) => get(`${BaseV6Url}/expert_plan/detail`, params);

/**
 * 获取专家已发布的方案赛事id
 * @doc https://yapi.xiaomingsport.com/project/59/interface/api/26814
 */
export const getPublishedMatchesId = (params) => get(`${BaseV6Url}/expert_plan/published/matches`, params);
