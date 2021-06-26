import http from '@/common/fetch';
import Store from '@/store';

const LivePassportApi = process.env.LIVE_PASSPORT_API;

/**
 * 获取渠道版本配置
 * @doc http://yapi.qihang2021.cn:3000/project/47/interface/api/936
 */
export const getChannelVersionConfig = () => http.get(`${LivePassportApi}/version/v1.0/getChannelVersionConfig`, { headers: { 'hq-source': `3;${process.env.VERSION};${Store.getState()?.router.channel};` } });
