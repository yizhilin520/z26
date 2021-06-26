import request from '@/utils/request'

export function saveNotice(data) {//新增或者编辑公告
  return request({
    url: '/sysNotice/saveNotice',
    method: 'post',
    dataType: 'formData',
    data
  })
}

export function setStatus(data) {//设置是否上下架
  return request({
    url: '/sysNotice/setStatus',
    method: 'post',
    dataType: 'formData',
    data
  })
}

export function queryList(params) { //公告管理列表
  return request({
    url: '/sysNotice/queryList',
    method: 'get',
    dataType: 'formData',
    params
  })
}
export function deleteNotice(params) { //删除公告
  return request({
    url: '/sysNotice/delNotice',
    method: 'post',
    // dataType: 'formData',
    params
  })
}