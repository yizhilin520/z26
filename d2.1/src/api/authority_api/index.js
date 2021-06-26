import request from "@/utils/request";

// GET /back/role/queryRoleList 角色查询列表
export function queryRoleList(params) {
  return request({
    url: "/role/queryRoleList",
    method: "get",
    params
  });
}

// POST /back/role/add 添加角色
export function addRoles(data) {
  return request({
    url: "/role/add",
    method: "post",
    data
  });
}

// DELETE /back/role/delete 删除角色
export function deleteRoles(params) {
  return request({
    url: "/role/delete",
    method: "delete",
    params
  });
}

// PUT /back/role/doValid 角色启用/封禁
export function doValid(data) {
  return request({
    url: "/role/doValid",
    method: "post",
    dataType: "formData",
    data
  });
}

// POST /back/role/editRoleMenu 权限新增或者修改
export function editRoleMenu(data) {
  return request({
    url: "/role/editRoleMenu",
    method: "post",
    data
  });
}
//PUT /back/role/modify 修改角色
export function modifyRoles(data) {
  return request({
    url: "/role/modify",
    method: "put",
    // dataType: "formData",
    data
  });
}
//GET /back/menu/queryAll 查询所有权限菜单列表
export function queryAllMenus(params) {
  return request({
    url: "/menu/queryAll",
    method: "get",
    params
  });
}

//GET /back/employee/queryEmployeeInfoList 员工查询列表
export function queryEmployeeInfoList(params) {
  return request({
    url: "/employee/queryEmployeeInfoList",
    method: "get",
    params
  });
}

//GET /back/role/selectRoleList 角色下拉框
export function selectRoleList(params) {
  return request({
    url: "/role/selectRoleList",
    method: "get",
    params
  });
}

//post /back/employee/doValid 员工启用接口
export function doValidEmployee(data) {
  return request({
    url: "/employee/doValid",
    method: "post",
    dataType: "formData",
    data
  });
}

//DELETE /back/employee/remove 删除员工
export function deleteEmployee(params) {
  return request({
    url: "/employee/remove",
    method: "delete",
    params
  });
}

//GET /back/role/queryExportRoleList 导出角色列表
export function queryExportRoleList(params) {
  return request({
    url: "/role/queryExportRoleList",
    method: "get",
    params
  });
}

//POST /back/employee/info 添加
export function addEmployee(data) {
  return request({
    url: "/employee/info",
    method: "post",
    dataType: "formData",
    data
  });
}

//post /back/employee/update 修改
export function updateEmployee(data) {
  return request({
    url: "/employee/update",
    method: "post",
    dataType: "formData",
    data
  });
}

//GET /back/employee/exportEmployeeInfoList 员工查询导出列表
export function exportEmployeeInfoList(params) {
  return request({
    url: "/employee/exportEmployeeInfoList",
    method: "get",
    params
  });
}
