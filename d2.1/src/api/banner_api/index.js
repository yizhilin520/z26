import request from "@/utils/request";

//banner列表
export function bannerList(params) {
  return request({
    url: "/communityBanner/list",
    method: "get",
    params
  });
}

//banner添加
export function addBanner(data) {
  return request({
    url: "/communityBanner/addBanner",
    method: "post",
    dataType: "formData",
    data
  });
}

//图片上传
export function uploadImage(data) {
  return request({
    url: "/communityBanner/uploadImage",
    method: "post",
    data
  });
}

//删除
export function deleteItem(data) {
  return request({
    url: "/communityBanner/remove",
    method: "post",
    dataType: "formData",
    data
  });
}

//修改上架状态
export function updateStatus(data) {
  return request({
    url: "/communityBanner/updateStatus",
    method: "post",
    dataType: "formData",
    data
  });
}

//banner编辑
export function editBanner(data) {
  return request({
    url: "/communityBanner/updateBanner",
    method: "post",
    dataType: "formData",
    data
  });
}

//addSpread添加广告
export function addSpread(data) {
  return request({
    url: "/adInfo/addSpread",
    method: "post",
    dataType: "formData",
    data
  });
}

//删除广告
export function deleteAd(data) {
  return request({
    url: "/adInfo/delete",
    method: "post",
    dataType: "formData",
    data
  });
}

//广告列表
export function adList(params) {
  return request({
    url: "/adInfo/list",
    method: "get",
    params
  });
}

//编辑广告
export function editSpread(data) {
  return request({
    url: "/adInfo/updateSpread",
    method: "post",
    dataType: "formData",
    data
  });
}

//修改上下架状态
export function updateAdStatus(data) {
  return request({
    url: "/adInfo/updateStatus",
    method: "post",
    dataType: "formData",
    data
  });
}
//广告图片上传
export function uploadAdImage(data) {
  return request({
    url: "/adInfo/uploadImage",
    method: "post",
    data
  });
}

// communityBanner/updateTimes 修改播放频率
export function updateTimes(data) {
  return request({
    url: "/communityBanner/updateTimes",
    method: "post",
    dataType: "formData",
    data
  });
}
// GET /back/adInfo/channelDownList 渠道下拉列表
export function adChannelDownList(params) {
  return request({
    url: "/adInfo/channelDownList",
    method: "get",
    params
  });
}
