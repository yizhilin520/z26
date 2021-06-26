import request from "@/utils/request";

//视频列表
export function videoList(data) {
  return request({
    url: "/videoManage/videoList",
    method: "post",
    dataType: "formData",
    data
  });
}
//视频列表删除
export function delVideo(data) {
  return request({
    url: "/videoManage/delVideo",
    method: "post",
    dataType: "formData",
    data
  });
}
export function uploadVideoList(data) {
  //视频审核列表
  return request({
    url: "/videoManage/uploadVideoList",
    method: "post",
    dataType: "formData",
    data
  });
}
//获取视频类型
export function getVideoMetaInfo(params) {
  return request({
    url: "/videoManage/selectVideoMetaInfo",
    method: "post",
    // dataType: 'formData',
    params
  });
}
//获取视频时间类型
export function getTimeValue(params) {
  return request({
    url: "/videoManage/getTimeValue",
    method: "get",
    dataType: "formData",
    params
  });
}
//官方昵称下拉框
export function optionList(params) {
  return request({
    url: "/activity/nickname/optionList",
    method: "get",
    dataType: "formData",
    params
  });
}
//转码数量
export function getTransCodeNum() {
  return request({
    url: "/videoManage/transcoderCount",
    method: "get"
  });
}
//转码
export function setTranscoder(data) {
  return request({
    url: "/videoManage/transcoder",
    method: "post",
    dataType: "formData",
    data
  });
}
//视频审核
export function checkVideo(data) {
  return request({
    url: "/videoManage/checkVideo",
    method: "post",
    dataType: "formData",
    data
  });
}

//生成上传链接
export function getNewVideoUrl(data) {
  return request({
    url: "/videoManage/presignedUploadUrl",
    method: "post",
    dataType: "formData",
    data
  });
}
//生成上传sign
export function putVideo(url, headers, data) {
  return request({
    url: url,
    method: "put",
    headers: headers,
    timeout: 300000,
    data
  });
}
export function uploadOrUpdate(data) {
  //上传或更新视频
  return request({
    url: "/videoManage/uploadOrUpdate",
    method: "post",
    timeout: 300000,
    data
  });
}
