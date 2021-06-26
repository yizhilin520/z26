import request from "@/utils/request";

// 斗币设置列表
export function setDoubiList(data) {
  return request({
    url: "/activity/setList?" + data,
    method: "get"
  });
}

// 斗币修改
export function setUpdate(data) {
  return request({
    url: "/activity/setUpdate",
    method: "post",
    dataType: "formData",
    data
  });
}

// GET /back/task/list邀请任务奖励列表
export function taskList(params) {
  return request({
    url: "/task/list",
    method: "get",
    params
  });
}

// GET /back/task/setVipListVIP用户邀请奖励列表
export function taskVipList(params) {
  return request({
    url: "/task/setVipList",
    method: "get",
    params
  });
}

// POST /back/task/addTask 添加邀请任务
export function addTask(data) {
  return request({
    url: "/task/addTask",
    method: "post",
    dataType: "formData",
    data
  });
}

// POST /back/task/updateTask 修改邀请任务
export function editTask(data) {
  return request({
    url: "/task/updateTask",
    method: "post",
    dataType: "formData",
    data
  });
}

// POST /back/task/deleteTask 删除邀请任务
export function deleteTask(data) {
  return request({
    url: "/task/deleteTask",
    method: "post",
    dataType: "formData",
    data
  });
}

// POST /back/task/drawSetUpdate VIP用户邀请奖励修改
export function drawSetUpdate(data) {
  return request({
    url: "/task/drawSetUpdate",
    method: "post",
    dataType: "formData",
    data
  });
}

















