import request from "@/utils/request";

//消息列表
export function messageList(params) {
  return request({
    url: "/messageInfo/messageList",
    dataType: "formData",
    method: "get",
    params
  });
}
//删除消息
export function messageDelete(data) {
  return request({
    url: "/messageInfo/delete",
    dataType: "formData",
    method: "post",
    data
  });
}
//发布消息
export function publishMessage(data) {
  return request({
    url: "/messageInfo/publishMessage",
    dataType: "formData",
    method: "post",
    data
  });
}
