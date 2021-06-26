import { get, getDeviceId } from '@/utils/require';

const livePassportApi = process.env.LIVE_PASSPORT_API;
const liveApi = process.env.LIVE_API;

export const getAdvertConfig = () => get(`${livePassportApi}/v5/getAdvertConfig`, {
  hq_source: 2,
  hq_deviceId: getDeviceId()
});

/**
 * 直播分类列表接口
 * @doc http://yapi.qihang2021.cn:3000/project/47/interface/api/825
 */
export const getLiveCategoryList = () => get(`${liveApi}/v0.8/columnType`);

/**
 * 获取主播等级信息
 * @doc http://yapi.qihang2021.cn:3000/project/47/interface/api/906
 */
export const getAnchorLevelInfo = (data) => get(`${liveApi}/v1.0/getMyLevelByUserId`, data);
