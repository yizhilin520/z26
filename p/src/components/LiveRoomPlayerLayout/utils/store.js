import { createContext, useContext } from 'react';
import { empty } from '@/utils/common';

const defaultStore = {
  // 原数据
  data: {},
  // 组件
  components: {
    // 主播
    anchor: null,
    // 消息
    message: null,
    // 播放器
    player: null,
    // 礼物
    gift: null,
    // 动画
    animation: null,
    // 榜单
    billboard: null,
    // 公告
    notice: null
  },
  // 一些数据存储
  state: {
    // 消息连接id
    chatId: null,
    // 消息列表
    message: [],
    // 在线人数
    online: 0,
    // 踢出房间
    kickOut: false,
    // 禁言
    mute: false,
    // 关注
    follow: false,
    // 屏蔽列表
    shield: [],
    // 错误消息
    errMessage: []
  },
  // 一些方法
  methods: {
    // 设置在线人数
    online: empty,
    // 关注
    follow: empty,
    // 送礼
    giveGift: empty,
    // 发送消息
    sendMessage: empty,
    // 设置消息
    setMessage: empty,
    // 添加消息
    addMessage: empty,
    // 踢人
    kickOut: empty,
    // 禁言
    mute: empty,
    // 解禁
    unMute: empty,
    // 屏蔽/解除屏蔽
    shield: empty,
    // 发送弹幕
    pushDanmaku: empty,
    // 发送动画
    pushAnimation: empty,
    // 设置错误消息
    setErrMessage: empty
  }
};

export const Context = createContext(defaultStore);

export const useStores = () => useContext(Context);
