import { createContext, useContext } from 'react';

const defaultStore = {
  // 一些数据存储
  state: {
    // 主题
    theme: null,
    // 是否固定
    isFixed: true,
    // 是否是首页
    isHome: false,
    // 是否是直播
    isLive: false,
    // 是否是比分
    isScore: false,
    // 是否是预测
    isForecast: false
  }
};

export const Context = createContext(defaultStore);

export const useStores = () => useContext(Context);
