import request from "@/utils/request";

//标签列表
export function videoLabelList(params) {
  return request({
    url: "/videoLabel/videoLabelList",
    method: "get",
    dataType: "formdata",
    params
  });
}
//删除标签
export function delLabel(data) {
  return request({
    url: "/videoLabel/delLabel",
    method: "post",
    dataType: "formData",
    data
  });
}
//新増标签
export function addVideoLabel(data) {
  return request({
    url: "/videoLabel/addVideoLabel",
    method: "post",
    dataType: "formData",
    data
  });
}

//修改标签
export function modifyLabel(data) {
  return request({
    url: "/videoLabel/modifyLabel",
    method: "post",
    dataType: "formData",
    data
  });
}
