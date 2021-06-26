import { post } from '@/utils/require';

const baseApi = process.env.DATA_COLLECTION;

/**
 * 数据上报接口
 * @doc http://yapi.qihang2021.cn:3000/project/72/interface/api/948
 */
export const dataActionReport = (data) => post(`${baseApi}/v1/action/report`, data);
