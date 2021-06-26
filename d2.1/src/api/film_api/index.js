import request from "@/utils/request";

// GET /back/move/list影片管理列表
export function moveList(params) {
  return request({
    url: "/move/list",
    method: "get",
    params
  });
}

// POST /back/move/postInfo 影片详情
export function postInfo(data) {
  return request({
    url: "/move/postInfo",
    method: "post",
    dataType: "formData",
    data
  });
}

// POST /back/move/updateStatus 修改是否推荐
export function updateStatus(data) {
  return request({
    url: "/move/updateStatus",
    method: "post",
    dataType: "formData",
    data
  });
}

//POST /back/move/uploadVideo 上传
export function uploadVideo(data) {
  return request({
    url: "/move/uploadVideo",
    method: "post",
    data
  });
}

//POST /back/move/addMove 影片上传
export function addMove(data) {
  return request({
    url: "/move/addMove",
    method: "post",
    dataType: "formData",
    data
  });
}

//POST /back/move/delMove 影片删除
export function deleteMove(data) {
  return request({
    url: "/move/delMove",
    method: "post",
    dataType: "formData",
    data
  });
}

//POST /back/move/uploadVideo 影片上传
export function uploadLongVideo(data) {
  return request({
    url: "/move/uploadMove",
    method: "post",
    data
  });
}

export function putVideo(url, headers, data) {
  return request({
    url: url,
    method: "put",
    headers: headers,
    timeout: 300000,
    data
  });
}

//POST /back/videoManage/generateUploadUrl 生成长视频上传链接
export function getNewVideoUrl(data) {
  return request({
    url: "/videoManage/generateUploadUrl",
    method: "post",
    data
  });
}

// POST /back/videoManage/generateUpload 续传
export function getResumeVideoUrl(data) {
  return request({
    url: "/videoManage/generateUpload",
    method: "post",
    data
  });
}

// POST /back/videoManage/uploadOrUpdateLong 长视频上传完之后保存信息
export function uploadOrUpdateLong(data) {
  //上传或更新视频
  return request({
    url: "/move/uploadOrUpdateLong",
    method: "post",
    timeout: 300000,
    data
  });
}

// 封面图片上传
export function uploadImage(data) {
  return request({
    url: "/post/uploadImage",
    method: "post",
    data
  });
}

// POST /back/move/updateMove 长影片编辑影片信息
export function updateFilmEdit(data) {
  return request({
    url: "/move/updateMove",
    method: "post",
    dataType: "formData",
    data
  });
}
// POST /back/move/updateRecommend 批量推荐
export function updateRecommend(data) {
  return request({
    url: "/move/updateRecommend",
    method: "post",
    dataType: "formData",
    data
  });
}
// GET /back/move/recommendList 抖动推荐列表
export function recommendList(params) {
  return request({
    url: "/move/recommendList",
    method: "get",
    params
  });
}
// POST /back/move/updateStatus 取消推荐
export function updateUnRecommend(data) {
  return request({
    url: "/move/updateStatus",
    method: "post",
    dataType: "formData",
    data
  });
}















