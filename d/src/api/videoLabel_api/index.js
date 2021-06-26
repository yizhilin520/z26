import request from "@/utils/request";

// 视频标签统计排名
export function videoTagCount(params) {
  return request({
    url: "/statistics/videoTagCount",
    method: "get",
    params
  });
}
// 视频标签统计
export function videoSearchCount(params) {
  return request({
    url: "/statistics/videoSearchCount",
    method: "get",
    params
  });
}
