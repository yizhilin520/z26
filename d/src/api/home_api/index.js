import request from "@/utils/request";

// category/list首页影片分类列表
export function categoryList(params) {
  return request({
    url: "/category/list",
    method: "get",
    params
  });
}

// category/addMove新增影片分类
export function addMove(data) {
  return request({
    url: "/category/addMove",
    method: "post",
    dataType: "formData",
    data
  });
}

// category/deleteCategory 删除影片分类
export function deleteCategory(data) {
  return request({
    url: "/category/deleteCategory",
    method: "post",
    dataType: "formData",
    data
  });
}

// category/RelatedList 影片关联列表
export function RelatedList(params) {
  return request({
    url: "/category/RelatedList",
    method: "get",
    params
  });
}

// category/updateStatus 修改上下架
export function updateStatus(data) {
  return request({
    url: "/category/updateStatus",
    method: "post",
    dataType: "formData",
    data
  });
}



// recommend/list 推荐管理列表
export function recommendList(params) {
  return request({
    url: "/recommend/list",
    method: "get",
    params
  });
}

// recommend/addMove 新增分类 
export function recommendAdd(data) {
  return request({
    url: "/recommend/addMove",
    method: "post",
    dataType: "formData",
    data
  });
}

// POST /back/recommend/deleteCategory删除分类
export function deleteRecommend(data) {
  return request({
    url: "/recommend/deleteCategory",
    method: "post",
    dataType: "formData",
    data
  });
}

// POST /back/recommend/updateStatus 修改上下架
export function recommendUpdate(data) {
  return request({
    url: "/recommend/updateStatus",
    method: "post",
    dataType: "formData",
    data
  });
}

// GET /back/category/optionList 影片分类下拉列表
export function optionList(params) {
  return request({
    url: "/category/optionList",
    method: "get",
    params
  });
}

// GET /back/category/categoryList 分类下拉列表
export function getOptionList(params) {
  return request({
    url: "/category/categoryList",
    method: "get",
    params
  });
}

// move/updateMoveRelated 修改影片关联
export function updateMoveRelated(data) {
  return request({
    url: "/move/updateMoveRelated",
    method: "post",
    dataType: "formData",
    data
  });
}






















