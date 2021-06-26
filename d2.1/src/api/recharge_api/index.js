import request from "@/utils/request";

// POST /back/recharge/userRecharge用户充值
export function userRecharge(data) {
  return request({
    url: "/recharge/userRecharge",
    method: "post",
    dataType: "formData",
    data
  });
}

// GET /back/recharge/list充值订单列表
export function rechargeList(params) {
  return request({
    url: "/recharge/list",
    method: "get",
    params
  });
}

// GET /back/recharge/exportlist 充值订单列表导出
export function exportlist(params) {
  return request({
    url: "/recharge/exportlist",
    method: "get",
    params
  });
}

// POST /back/recharge/updateQQ qq号设置修改
export function updateQQ(data) {
  return request({
    url: "recharge/updateQQ",
    method: "post",
    dataType: "formData",
    data
  });
}

// GET /back/recharge/selectQQ qq号查询
export function getSelectQQ(params) {
  return request({
    url: "/recharge/selectQQ",
    method: "get",
    params
  });
}
//GET /back/rechargeConfig/configList 充值设置列表
export function getRechargeList(params) {
  return request({
    url: "/rechargeConfig/configList",
    method: "get",
    params
  });
}

// POST /back/rechargeConfig/addConfig 新增充值配置
export function addRechargeConfig(data) {
  return request({
    url: "/rechargeConfig/addConfig",
    method: "post",
    dataType: "formData",
    data
  });
}
// POST /back/rechargeConfig/uploadImage 支付图标上传
export function uploadImage(data) {
  return request({
    url: "/rechargeConfig/uploadImage",
    method: "post",
    // dataType: "formData",
    data
  });
}

// POST /back/rechargeConfig/updateConfig 编辑充值配置
export function editRechargeConfig(data) {
  return request({
    url: "/rechargeConfig/updateConfig",
    method: "post",
    // dataType: "formData",
    data
  });
}

// POST /back/rechargeConfig/updateStatus 修改状态
export function updateStatus(data) {
  return request({
    url: "/rechargeConfig/updateStatus",
    method: "post",
    dataType: "formData",
    data
  });
}

// POST /back/rechargeConfig/deleteConfig 删除配置
export function deleteConfig(data) {
  return request({
    url: "/rechargeConfig/deleteConfig",
    method: "post",
    dataType: "formData",
    data
  });
}

// GET /back/recharge/orderList 充值订单列表
export function getOrderList(params) {
  return request({
    url: "/recharge/orderList",
    method: "get",
    params
  });
}
// GET /back/recharge/orderExportList 充值订单列表导出
export function orderExportList(params) {
  return request({
    url: "/recharge/orderExportList",
    method: "get",
    params
  });
}

// GET /back/recharge/callList 回调记录列表
export function callList(params) {
  return request({
    url: "/recharge/callList",
    method: "get",
    params
  });
}
// GET /back/recharge/callExportList 回调记录列表导出
export function callExportList(params) {
  return request({
    url: "/recharge/callExportList",
    method: "get",
    params
  });
}

//GET /back/qqSetting/list 客服设置列表
export function getQQList(params) {
  return request({
    url: "/qqSetting/list",
    method: "get",
    params
  });
}

// POST /back/qqSetting/addQQ 添加qq客服
export function addQQ(data) {
  return request({
    url: "/qqSetting/addQQ",
    method: "post",
    dataType: "formData",
    data
  });
}

// POST /back/qqSetting/deleteQQ 删除qq客服
export function deleteQQ(data) {
  return request({
    url: "/qqSetting/deleteQQ",
    method: "post",
    dataType: "formData",
    data
  });
}

// POST /back/qqSetting/updateQQ 修改qq客服
export function editQQ(data) {
  return request({
    url: "/qqSetting/updateQQ",
    method: "post",
    dataType: "formData",
    data
  });
}

// POST /back/rechargeConfig/delete 删除金额
export function deleteAmount(data) {
  return request({
    url: "/rechargeConfig/delete",
    method: "post",
    dataType: "formData",
    data
  });
}

// GET /back/rechargeConfig/list 充值方式列表
export function rechargePayList(params) {
  return request({
    url: "/rechargeConfig/list",
    method: "get",
    params
  });
}






