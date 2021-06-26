import request from "@/utils/request";

export function addChannel(data) {
  //添加渠道
  return request({
    url: "/channel/addChannel",
    method: "post",
    dataType: "formData",
    data
  });
}

export function channelList(params) {
  //渠道列表
  return request({
    url: "/channel/channelList",
    method: "get",
    dataType: "formData",
    params
  });
}

export function channelDownList(params) {
  //渠道下拉列表
  return request({
    url: "/channel/channelDownList",
    method: "get",
    params
  });
}

// 删除渠道
export function deleteChannel(data) {
  return request({
    url: "/channel/deleteChannel",
    method: "post",
    dataType: "formData",
    data
  });
}
// 修改渠道
export function updateChannel(data) {
  return request({
    url: "/channel/updateChannel",
    method: "post",
    dataType: "formData",
    data
  });
}
// 修改状态
export function updateStatus(data) {
  return request({
    url: "/channel/updateStatus",
    method: "post",
    dataType: "formData",
    data
  });
}
