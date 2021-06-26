import request from "@/utils/request";

// /back/feedBack/list  列表
export function feedBackList(params) {
  return request({
    url: "/feedBack/list",
    method: "get",
    params
  });
}