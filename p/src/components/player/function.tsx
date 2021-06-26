import Flvjs from 'flv.js';

// 弹幕透明度
export const updateDmkOpacity = (dp: any, value: any) => {
  dp.danmaku.opacity(value);
};
// 弹幕显示区域
const dmkViewTypes = [
  { id: 1, label: '无' },
  { id: 2, label: '半屏弹幕' },
  { id: 3, label: '全屏弹幕' }
];
export const dmkAreaType = (dp: any, value: any) => {
  if (value === 1) {
    dp.danmaku.hide();
  }
};

// 数据设置
export const setStateArrayOfActive = (array: any, key: any, value: any, setter: any) => {
  array = array.map((item) => {
    if (item[key] === value) return Object.assign(item, { active: true });
    return Object.assign(item, { active: false });
  });

  console.log('array', array);
  setter([...array]);
};

// 随机数
export const getRandom = () => Math.ceil(Math.random() * 3);

// 销毁实例
export const destoryPlayer = (dp, flvPlayer) => {
  try {
    if (flvPlayer) {
      flvPlayer.unload && flvPlayer.unload();
      flvPlayer.detachMediaElement && flvPlayer.detachMediaElement();
      flvPlayer.destroy && flvPlayer.destroy();
      flvPlayer = null;
    }
    if (dp) {
      dp.destroy();
    }
  } catch (e) {
  }
};
// initFlv
export const initFlvType = (video: any, player: any) => {
  const flvPlayer = Flvjs.createPlayer({
    type: 'flv',
    url: video.src
  });
  flvPlayer.attachMediaElement(video);
  flvPlayer.load();
  flvPlayer.play();
  return flvPlayer;
};

// 设置音量
export const updateVolume = (dp: any, value: any) => {
  dp.volume(value, true, false);
};

// 发送弹幕和接收弹幕
export const sendDmk = (dp: any, value: string, format = {}) => {
  if (!value) return;
  return dp?.danmaku?.draw({
    text: value,
    color: '#ffffff',
    type: 'right',
    border: 'solid 2px #0289fa',
    ...format
  });
};
