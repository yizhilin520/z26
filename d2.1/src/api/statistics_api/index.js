import request from "@/utils/request";

//   用户统计
export function getUserStatistics(data) {
  return request({
    url: "/statistics/userStatistics",
    method: "get",
    params: data
  });
}
// 折现统计
export function getDiscountStatistics(data) {
  return request({
    url: "/statistics/discountStatistics",
    method: "get",
    params: data
  });
}
export function newDiscountStatistics(data) {
  return request({
    url: "/statistics/newDiscountStatistics",
    method: "get",
    params: data
  });
}

// top 统计
export function getAnnularStatistics(data) {
  return request({
    url: "/statistics/annularStatistics",
    method: "get",
    params: data
  });
}
export function newAnnularStatistics(data) {
  return request({
    url: "/statistics/newAnnularStatistics",
    method: "get",
    params: data
  });
}
// 在线用户统计
export function onlineStatistics(params) {
  return request({
    url: "/statistics/onlineStatistics",
    method: "get",
    params
  });
}
// GET /back/statistics/userChannelCount 用户渠道统计
export function userChannelCount(params) {
  return request({
    url: "/statistics/userChannelCount",
    method: "get",
    params
  });
}
// 渠道统计
export function getNewChannelList(data) {
  return request({
    url: "/statistics/newChannelList",
    method: "post",
    dataType: "formData",
    data
  });
}
// 渠道下拉列表
export function channelDownList() {
  return request({
    url: "/channel/channelDownList",
    method: "get"
  });
}

// 渠道详情
export function getNewChannelDetails(params) {
  return request({
    url: "/statistics/newChannelDetails",
    method: "get",
    params
  });
}

// 留存统计详情
export function remainDetailList(data) {
  return request({
    url: "/statistics/remainDetailList",
    method: "post",
    dataType: "formData",
    data
  });
}

// 新渠道统计导出
export function newChannelExport(data) {
  return request({
    url: "/statistics/newChannelExport",
    method: "post",
    data
  });
}

// POST /back/statistics/userRemainList 用户留存统计
export function userRemainList(data) {
  return request({
    url: "/statistics/userRemainList",
    method: "post",
    dataType: "formData",
    data
  });
}
// POST /back/statistics/remainList 留存统计
export function channelRemainList(data) {
  return request({
    url: "/statistics/remainList",
    method: "post",
    dataType: "formData",
    data
  });
}

// GET /back/statistics/userRetentionPolyline 用户留存率折线统计
export function userRetentionPolyline(params) {
  return request({
    url: "/statistics/userRetentionPolyline",
    method: "get",
    params
  });
}

// GET /back/statistics/channelRetentionPolyline 渠道留存率折线统计
export function channelRetentionPolyline(params) {
  return request({
    url: "/statistics/channelRetentionPolyline",
    method: "get",
    params
  });
}

// GET /back/statistics/playCount 二期播放统计
export function playCount(params) {
  return request({
    url: "/statistics/playCount",
    method: "get",
    params
  });
}

//GET /back/statistics/playTimeCount 播放时段统计
export function playTimeCount(params) {
  return request({
    url: "/statistics/playTimeCount",
    method: "get",
    params
  });
}
// GET /back/statistics/channelCount 渠道数据统计
export function channelCount(params) {
  return request({
    url: "/statistics/channelCount",
    method: "get",
    params
  });
}
// GET /back/statistics/BasicsChannelList 渠道基础数据统计
export function BasicsChannelList(params) {
  return request({
    url: "/statistics/BasicsChannelList",
    method: "get",
    params
  });
}
// GET /back/statistics/BasicsChannelRemain 基础渠道留存数据
export function BasicsChannelRemain(params) {
  return request({
    url: "/statistics/BasicsChannelRemain",
    method: "get",
    params
  });
}




