import http from '@/common/fetch';

const baseUrl = process.env.LIVE_API;

/**
 * 获取房间详情
 * @doc http://yapi.qihang2021.cn:3000/project/47/interface/api/259
 */
export const getRoomDetail = (params) => http.get(`${baseUrl}/v0.1/room/detail`, { params });

/**
 * 获取直播间列表
 * @doc http://yapi.qihang2021.cn:3000/project/47/interface/api/271
 */
export const getRoomList = (params) => http.get(`${baseUrl}/v1.2/rooms/pc`, { params });
