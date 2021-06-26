import { createContext, useContext } from 'react';
import { empty } from '@/utils/common';

const emptySet = new Set();

const defaultStore = {
  // 一些状态
  status: {
    // 加载中
    loading: true,
    // 排序方式
    sortType: 'time',
    // 比分开关
    scoreSwitch: { asia: true, size: true, europe: false }
  },
  // 一些数据
  state: {
    // 请求的数据列表
    list: [],
    // 请求参数
    query: {},
    // 关注数据列表
    keepList: [],
    // 置顶的对象
    topObject: emptySet,
    // 隐藏的对象
    hiddenObject: emptySet,
    // 关注对象
    keepObject: emptySet,
    // checkbox选择
    selectObject: emptySet
  },
  // 一些方法
  methods: {
    // 设置数据
    setList: empty,
    // 获取列表数据
    getListData: empty,
    // 获取关注数据
    getFollowData: empty,
    // 添加隐藏
    addHidden: empty,
    // 移除隐藏
    removeHidden: empty,
    // 清空隐藏
    emptyHidden: empty,
    // 添加置顶
    addTop: empty,
    // 移除置顶
    removeTop: empty,
    // 清空置顶
    emptyTop: empty,
    // 设置关注
    setKeep: empty,
    // 取消关注
    cancelKeep: empty,
    // 设置选择
    setSelect: empty,
    // 清空选中
    emptySelect: empty,
    // 设置排序方式
    setSortType: empty,
    // 设置比分开关
    setScoreSwitch: empty
  }
};

export const Context = createContext(defaultStore);

export const useStores = () => useContext(Context);
