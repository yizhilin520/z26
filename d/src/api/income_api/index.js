import request from "@/utils/request";

// GET /back/statistics/incomeAmountCount 收入金额统计
export function incomeAmountCount(params) {
  return request({
    url: "/statistics/incomeAmountCount",
    method: "get",
    params
  });
}

// GET /back/statistics/userUpload 用户上传统计
export function userUpload(params) {
  return request({
    url: "/statistics/userUpload",
    method: "get",
    params
  });
}

// GET /back/statistics/incomeAmountCountSomeDay 收入金额统计-查询某一天时段收入
export function incomeAmountCountSomeDay(params) {
  return request({
    url: "/statistics/incomeAmountCountSomeDay",
    method: "get",
    params
  });
}

// GET /back/statistics/incomeAmountCountSection 收入金额统计-查询一段时间收入趋势
export function incomeAmountCountSection(params) {
  return request({
    url: "/statistics/incomeAmountCountSection",
    method: "get",
    params
  });
}

// GET /back/statistics/userPayCount 付费用户统计
export function userPayCount(params) {
  return request({
    url: "/statistics/userPayCount",
    method: "get",
    params
  });
}

//GET /back/statistics/userPayPolyline 付费用户折现统计
export function userPayPolyline(params) {
  return request({
    url: "/statistics/userPayPolyline",
    method: "get",
    params
  });
}


























