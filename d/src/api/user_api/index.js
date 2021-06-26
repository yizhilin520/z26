import request from "@/utils/request";

//用户管理列表
export function getQueryUserList(params) {
  return request({
    url: "/userList/queryUserList",
    method: "get",
    dataType: "formData",
    params
  });
}

// 删除用户
export function deleteUser(data) {
  return request({
    url: "/userList/delete",
    method: "post",
    dataType: "formData",
    data
  });
}

// 修改解、封杀
export function editUpdateStatus(data) {
  return request({
    url: "/userList/updateStatus",
    method: "post",
    dataType: "formData",
    data
  });
}
// 获取用户详情
export function userDetailsInfo(params) {
  return request({
    url: "/userList/UserInfo",
    method: "get",
    dataType: "formData",
    params
  });
}
// 获取权限详情
export function userPermissionList(params) {
  return request({
    url: "/userList/PermissionInfo",
    method: "get",
    dataType: "formData",
    params
  });
}
//用户视频列表
export function userVideoList(params) {
  return request({
    url: "/userList/UserVideoList",
    method: "get",
    dataType: "formData",
    params
  });
}
//登录日志列表
export function userLoginLog(params) {
  return request({
    url: "/userList/queryLoginLog",
    method: "get",
    dataType: "formData",
    params
  });
}

// GET /back/userList/isHaveExportPower 判断用户是否有权限导出
export function isHaveExportPower(params) {
  return request({
    url: "/userList/isHaveExportPower",
    method: "get",
    dataType: "formData",
    params
  });
}

// GET /back/userList/queryExportList 用户管理列表导出
export function queryExportList(params) {
  return request({
    url: "/userList/queryExportList",
    method: "get",
    dataType: "formData",
    params
  });
}

// POST /back/appRole/setValue权限启用关闭
export function changeSwitch(data) {
  return request({
    url: '/appRole/setValue',
    method: 'post',
    dataType: 'formData',
    data
  })
}

// GET /back/userList/abnormalList 异常用户列表
export function abnormalList(params) {
  return request({
    url: '/userList/abnormalList',
    method: 'get',
    params
  })
}
// POST /back/userList/changePassword 找回密码接口-重置密码
export function changePassword(data) {
  return request({
    url: '/userList/changePassword',
    method: 'post',
    dataType: 'formData',
    data
  })
}
// POST /back/userList/update 编辑用户信息
export function updateUserInfo(data) {
  return request({
    url: '/userList/update',
    method: 'post',
    dataType: 'formData',
    data
  })
}
// POST /back/userList/uploadImage 上传头像
export function uploadImage(data) {
  return request({
    url: '/userList/uploadImage',
    method: 'post',
    // dataType: 'formData',
    data
  })
}
















