import request from "@/utils/request";

// GET /back/account/countList 用户交易统计
export function accountCountList(params) {
  return request({
    url: "/account/countList",
    method: "get",
    params
  });
}

// GET /back/account/countList 用户交易明细列表
export function accountDetailList(params) {
  return request({
    url: "/account/detailList",
    method: "get",
    params
  });
}

// GET /back/account/exportDetailList 用户交易明细列表导出
export function exportDetailList(params) {
  return request({
    url: "/account/exportDetailList",
    method: "get",
    params
  });
}

// GET /back/account/exportCountList 用户交易统计列表导出
export function exportCountList(params) {
  return request({
    url: "/account/exportCountList",
    method: "get",
    params
  });
}

