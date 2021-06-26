import request from "@/utils/request";

// GET /back/member/memberUserList会员用户时长列表
export function memberUserList(params) {
  return request({
    url: "/member/memberUserList",
    method: "get",
    params
  });
}

// GET /back/member/vipList vip套餐列表
export function vipList(params) {
  return request({
    url: "/member/vipList",
    method: "get",
    params
  });
}

// POST /back/member/vipRightAdd vip权益添加
export function vipRightAdd(data) {
  return request({
    url: "/member/vipRightAdd",
    method: "post",
    dataType: "formData",
    data
  });
}

// GET /back/member/vipRightList vip权益列表
export function vipRightList(params) {
  return request({
    url: "/member/vipRightList",
    method: "get",
    params
  });
}

// post /back/member/vipRightReset vip权益重置
export function vipRightReset(data) {
  return request({
    url: "/member/vipRightReset",
    method: "post",
    dataType: "formData",
    data
  });
}

// post /back/member/vipUpdatePlan vip套餐修改
export function vipUpdatePlan(data) {
  return request({
    url: "/member/vipUpdatePlan",
    method: "post",
    dataType: "formData",
    data
  });
}

// post /back/member/vipUpdateStatus vip修改上下架
export function vipUpdateStatus(data) {
  return request({
    url: "/member/vipUpdateStatus",
    method: "post",
    dataType: "formData",
    data
  });
}

//POST /back/member/uploadImage vip权益图标上传
export function uploadImage(data) {
  return request({
    url: "/member/uploadImage",
    method: "post",
    data
  });
}
//POST /back/member/addVip vip套餐新增
export function addVip(data) {
  return request({
    url: "/member/addVip",
    method: "post",
    data
  });
}

//GET /back/member/memberUserExport会员订单导出
export function memberUserExport(params) {
  return request({
    url: "/member/memberUserExport",
    method: "get",
    params
  });
}


