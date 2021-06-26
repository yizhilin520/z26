import request from "@/utils/request";

//官方昵称设置列表
export function getList(params) {
  return request({
    url: "/activity/nickname/getList",
    method: "get",
    dataType: "formData",
    params
  });
}
//图片上传
export function adevImg(data) {
  return request({
    url: "/adInfo/uploadImage",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data
  });
}
// 修改官方昵称
export function update(data) {
  return request({
    url: "/activity/nickname/update",
    method: "post",
    dataType: "formData",
    data
  });
}
// 新增官方昵称
export function add(data) {
  return request({
    url: "/activity/nickname/add",
    method: "post",
    dataType: "formData",
    data
  });
}
// 删除官方昵称
export function deles(data) {
  return request({
    url: "/activity/nickname/del",
    method: "post",
    dataType: "formData",
    data
  });
}
// GET /back/setting/list   headList
export function avatarList(params) {
  return request({
    url: "/setting/list",
    method: "get",
    params
  });
}
// POST /back/setting/delHeadImage 删除系统头像
export function delHeadImage(data) {
  return request({
    url: "/setting/delHeadImage",
    method: "post",
    dataType: "formData",
    data
  });
}
// POST /back/setting/addHeadImage 新增系统头像
export function addHeadImage(data) {
  return request({
    url: "/setting/addHeadImage",
    method: "post",
    dataType: "formData",
    data
  });
}
// POST /back/setting/uploadImage 系统头像上传
export function uploadImage(data) {
  return request({
    url: "/setting/uploadImage",
    method: "post",
    data
  });
}
// GET /back/setting/sensitiveWordList 敏感词列表
export function sensitiveWordList(params) {
  return request({
    url: "/setting/sensitiveWordList",
    method: "get",
    params
  });
}
// POST /back/setting/addSensitiveWord 新增敏感词
export function addSensitiveWord(data) {
  return request({
    url: "/setting/addSensitiveWord",
    method: "post",
    dataType: "formData",
    data
  });
}
// POST /back/setting/delSensitiveWord 敏感词删除
export function delSensitiveWord(data) {
  return request({
    url: "/setting/delSensitiveWord",
    method: "post",
    dataType: "formData",
    data
  });
}

// GET /back/downdSetting/list 查询环体下载地址
export function downdSettingList(params) {
  return request({
    url: "/downdSetting/list",
    method: "get",
    params
  });
}

// POST /back/downdSetting/updateDowndSetting 环体下载地址编辑
export function updateDowndSetting(data) {
  return request({
    url: "/downdSetting/updateDowndSetting",
    method: "post",
    dataType: "formData",
    data
  });
}
// POST /back/downdSetting/addDowndSetting 环体下载地址添加
export function addDowndSetting(data) {
  return request({
    url: "/downdSetting/addDowndSetting",
    method: "post",
    dataType: "formData",
    data
  });
}
// POST /back/downdSetting/delDowndSetting 环体下载地址删除
export function delDowndSetting(data) {
  return request({
    url: "/downdSetting/delDowndSetting",
    method: "post",
    dataType: "formData",
    data
  });
}
/*****  水印 ****/
// POST /back/waterMark/addWaterMark 添加水印
export function addWaterMark(data) {
  return request({
    url: "/waterMark/addWaterMark",
    method: "post",
    dataType: "formData",
    data
  });
}
// POST /back/waterMark/deleteWaterMark 删除水印
export function deleteWaterMark(data) {
  return request({
    url: "/waterMark/deleteWaterMark",
    method: "post",
    dataType: "formData",
    data
  });
}
// GET /back/waterMark/list 水印设置列表
export function getWatermaskList(params) {
  return request({
    url: "/waterMark/list",
    method: "get",
    params
  });
}
// POST /back/waterMark/updateStatus 修改状态
export function updateMaskStatus(data) {
  return request({
    url: "/waterMark/updateStatus",
    method: "post",
    dataType: "formData",
    data
  });
}
// POST /back/waterMark/updateWaterMark 修改水印
export function updateWaterMark(data) {
  return request({
    url: "/waterMark/updateWaterMark",
    method: "post",
    dataType: "formData",
    data
  });
}
// POST /back/waterMark/uploadImage 水印图片上传
export function uploadMaskImage(data) {
  return request({
    url: "/waterMark/uploadImage",
    method: "post",
    data
  });
}
// GET /back/downdSetting/channelDownList 环体下载下拉渠道
export function channelDownList(params) {
  return request({
    url: "/downdSetting/channelDownList",
    method: "get",
    params
  });
}
