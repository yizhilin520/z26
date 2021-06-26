import request from "@/utils/request";

// 帖子图片上传
export function uploadImage(data) {
  return request({
    url: "/post/uploadImage",
    method: "post",
    data
  });
}

// 帖子列表 /back/post/list
export function postList(params) {
  return request({
    url: "/post/list",
    method: "get",
    dataType: "formData",
    params
  });
}

// 官方账号下拉框 back/post/optionList
export function optionList() {
  return request({
    url: "/post/optionList",
    method: "get",
    dataType: "formData"
  });
}

// 帖子视频上传 back/post/uploadVideo
export function uploadVideo(data) {
  return request({
    url: "/post/uploadVideo",
    method: "post",
    // dataType: "formData",
    data
  });
}

// 发帖 back/post/uploadVideo
export function addPost(data) {
  return request({
    url: "/post/addPost",
    method: "post",
    dataType: "formData",
    data
  });
}

// 删除 back/post/remove
export function remove(data) {
  return request({
    url: "/post/remove",
    method: "post",
    dataType: "formData",
    data
  });
}

// 帖子详情 back/post/postInfo
export function postInfo(data) {
  return request({
    url: "/post/postInfo",
    method: "post",
    dataType: "formData",
    data
  });
}

// 帖子审核
export function postCheck(data) {
  return request({
    url: "/post/postCheck",
    method: "post",
    dataType: "formData",
    data
  });
}
// 帖子审核列表
export function checkList(params) {
  return request({
    url: "/post/checkList",
    method: "get",
    dataType: "formData",
    params
  });
}

