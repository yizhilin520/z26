import { createContext, useContext } from 'react';
import { empty } from '@/utils/common';

const defaultStore = {
  // 加载中
  loading: false,
  // 请求的原数据列表
  list: [],
  // 设置数据
  setList: empty,
  // 获取列表数据
  getMatch: empty,
  // 关注数据列表
  keepList: [],
  // 获取关注数据
  getMatchFollow: empty,
  // 隐藏的对象
  hiddenObject: {},
  // 设置隐藏
  setHidden: empty,
  // 置顶的对象
  topObject: {},
  // 设置置顶
  setTop: empty,
  // 关注对象
  keepObject: {},
  // 设置关注
  setKeep: empty,
  // 取消关注
  cancelKeep: empty,
  // checkbox选择
  selectObject: {},
  // 设置选择
  setSelect: empty,
  // 清空选中
  setEmptySelect: empty,
  // 请求参数
  query: {},
  // 排序方式
  sortType: 'time',
  // 设置排序方式
  setSortType: empty
};

export const Context = createContext(defaultStore);

export const useStores = () => useContext(Context);
