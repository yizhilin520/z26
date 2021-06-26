import request from "@/utils/request";
//版本列表
export function versionList(params) {
  return request({
    url: "/version/list",
    method: "get",
    dataType: "formData",
    params
  });
}
//版本删除
export function versionDelete(data) {
  return request({
    url: "/version/remove",
    method: "post",
    dataType: "formData",
    data
  });
}
//版本详情
export function versionInfo(params) {
  return request({
    url: "/version/versionInfo",
    method: "get",
    params
  });
}
//版本发布
export function updatePublish(data) {
  return request({
    url: "/version/updatePublish",
    method: "post",
    dataType: "formData",
    data
  });
}
//添加发布
export function addChannel(data) {
  return request({
    url: "/version/addChannel",
    method: "post",
    dataType: "formData",
    data
  });
}
//修改版本
export function updateChannel(data) {
  return request({
    url: "/version/updateChannel",
    method: "post",
    dataType: "formData",
    data
  });
}
//版本下拉列表
export function getVersionList(data) {
  return request({
    url: "/version/versionList",
    method: "get",
    dataType: "formData",
    data
  });
}
