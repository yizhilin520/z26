import { createContext, useContext } from 'react';
import { empty } from '@/common/utils';

const defaultStore = {
  // 实例 video dom
  instance: null,
  // 数据
  data: {
    // 当前选择的索引
    index: 0,
    // 数据列表
    list: [],
    // 设置索引
    setIndex: empty
  },
  // 一些状态
  status: {
    // 是否创建
    create: false,
    // 是否销毁
    destroy: false,
    // 是否正在播放
    played: false,
    // 是否暂停
    paused: true,
    // 音量
    volume: 1,
    // 是否静音
    muted: false,
    // 是否全屏
    fullScreen: false,
    // loading
    loading: true,
    // buffer loading
    bufferLoading: false,
    // ctrl显隐
    ctrlVisible: true,
    // 点击播放显隐
    clickPlayVisible: false,
    // 静音播放显隐
    mutedPlayVisible: false
  },
  // 一些方法
  methods: {
    // 销毁
    destroy: empty,
    // 创建
    create: empty,
    // 刷新
    refresh: empty,
    // 播放
    play: empty,
    // 暂停
    pause: empty,
    // 声音设置
    volume: empty,
    // 声音开关
    switchVolume: empty,
    // 全屏
    fullScreen: empty,
    // 退出全屏
    exitScreen: empty
  }
};

export const Context = createContext(defaultStore);

export const useStores = () => useContext(Context);
