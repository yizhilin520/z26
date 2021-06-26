import { createContext, useContext } from 'react';
import { empty } from '@/utils/common';

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
    volume: 0.7,
    // 是否静音
    muted: false,
    // 是否全屏
    fullScreen: false,
    // loading
    loading: true,
    // buffer loading
    bufferLoading: false,
    // ctrl显隐
    ctrlVisible: false,
    // 点击播放显隐
    clickPlayVisible: false,
    // 静音播放显隐
    mutedPlayVisible: false,
    // 画中画开启状态
    pictureInPicture: false,
    // 弹幕(0：关闭弹幕，1全屏弹幕，2弹幕显示上方，3弹幕显示在下方)
    danmakuDisplay: 1,
    // 弹幕不透明度(0-100)
    danmakuOpacity: 100
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
    exitScreen: empty,
    // 开启画中画
    openPictureInPicture: empty,
    // 关闭画中画
    closePictureInPicture: empty,
    // 设置弹幕显示(0：关闭弹幕，1全屏弹幕，2弹幕显示上方，3弹幕显示在下方)
    danmakuDisplay: empty,
    // 设置弹幕不透明度(0-100)
    danmakuOpacity: empty
  }
};

export const Context = createContext(defaultStore);

export const useStores = () => useContext(Context);
