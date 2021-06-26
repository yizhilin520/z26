import React, { useEffect, useRef } from 'react';
import FlvJs from 'flv.js';
import { usePersistFn, useSafeState, useSetState } from '@/utils/hooks';
import { addOnceEventListener } from '@/utils/common';
import { Context } from '../utils/store';

import styles from '../style/Provider.scss';

// 判断是否支持画中画
const supportsWebKitPresentationMode = (video) => {
  // Check if Safari supports PiP, and is not on mobile (other than iPad)
  // iPhone safari appears to "support" PiP through the check, however PiP does not function
  const notMobile = /iPhone|iPod/.test(navigator.userAgent) === false;
  return video.webkitSupportsPresentationMode && typeof video.webkitSetPresentationMode === 'function' && notMobile;
};

// 设置弹幕显示存储key
const DANMAKU_DISPLAY_KEY = 'danmaku_display';
// 设置弹幕不透明度key
const DANMAKU_OPACITY_KEY = 'danmaku_opacity';

const Provider = ({ data, status: statusProps, methods: methodsProps, volume: defaultVolume, children }) => {
  const [flvInstance, setFlvInstance] = useSafeState(null);
  const [dataIndex, setIndex] = useSafeState(0);
  const [status, setStatus] = useSetState({
    // 是否正在播放
    played: false,
    // 是否暂停
    paused: true,
    loading: true,
    volume: defaultVolume,
    pictureInPicture: false,
    // eslint-disable-next-line radix
    danmakuDisplay: Number.parseInt(localStorage.getItem(DANMAKU_DISPLAY_KEY)) || 1,
    // eslint-disable-next-line radix
    danmakuOpacity: Number.parseInt(localStorage.getItem(DANMAKU_OPACITY_KEY)) || 100
  });

  const videoRef = useRef();
  const videoDom = videoRef.current;

  // video 开启画中画回调
  const onVideoOpenPictureInPictureHandle = usePersistFn(() => setStatus({ pictureInPicture: true }));
  // video 关闭画中画回调
  const onVideoClosePictureInPictureHandle = usePersistFn(() => {
    if (!status.destroy) {
      const timer = setTimeout(async () => {
        clearTimeout(timer);
        try {
          await videoDom.play();
        } catch (e) {
        }
      }, 10);
    }

    return setStatus({ pictureInPicture: false });
  });

  const openPictureInPictureHandle = usePersistFn(async () => {
    if (videoDom.requestPictureInPicture && document.pictureInPictureElement !== videoDom) {
      await videoDom.requestPictureInPicture();
    } else if (supportsWebKitPresentationMode(videoDom) && videoDom.webkitPresentationMode !== 'picture-in-picture') {
      await videoDom.webkitSetPresentationMode('picture-in-picture');
    }
  });
  const closePictureInPictureHandle = usePersistFn(async () => {
    if (document.exitPictureInPicture && document.pictureInPictureElement === videoDom) {
      await document.exitPictureInPicture();
    } else if (supportsWebKitPresentationMode(videoDom) && videoDom.webkitPresentationMode !== 'inline') {
      await videoDom.webkitSetPresentationMode('inline');
    }
  });
  // 销毁
  const destroyHandle = usePersistFn(() => {
    if (!flvInstance) return;
    if (videoDom) {
      if (status.pictureInPicture) closePictureInPictureHandle();
      videoDom.pause();
    }

    flvInstance.off(FlvJs.Events.ERROR, destroyHandle);
    flvInstance.unload();
    flvInstance.detachMediaElement();
    flvInstance.destroy();

    setFlvInstance(null);
  });

  // 错误回调
  const onErrorHandle = () => {
    setStatus({ loading: false, bufferLoading: false, create: false, destroy: true });

    return destroyHandle;
  };

  // 根据索引创建播放器
  const createByIndexHandle = usePersistFn((index) => {
    const { playUrl, protocolType } = data[index] || {};
    setStatus({ loading: !!playUrl, bufferLoading: false, create: false, destroy: !playUrl });

    destroyHandle();
    if (!playUrl) return;

    let createFlag = false;

    if (protocolType === 'flv' && FlvJs.isSupported()) {
      const ins = FlvJs.createPlayer({
        type: protocolType,
        url: playUrl
      });
      ins.attachMediaElement(videoRef.current);
      ins.load();
      ins.on(FlvJs.Events.ERROR, onErrorHandle);

      setFlvInstance(ins);
      createFlag = true;
    }

    if (!createFlag) return;

    // react 会忽略enterpictureinpicture和leavepictureinpicture事件，所以直接使用代码的方式监听
    addOnceEventListener(videoRef.current, 'enterpictureinpicture', onVideoOpenPictureInPictureHandle);
    addOnceEventListener(videoRef.current, 'leavepictureinpicture', onVideoClosePictureInPictureHandle);

    return setIndex(index);
  });

  // 设置数据索引
  const setDataIndexHandle = (v) => {
    if (dataIndex === v) return;

    return createByIndexHandle(v);
  };

  // 刷新操作
  const refreshHandle = () => createByIndexHandle(dataIndex);

  // 创建操作
  const createHandle = () => createByIndexHandle(0);

  // 音量设置
  const volumeHandle = (percentage) => {
    if (!videoDom) return;

    if (percentage) {
      videoDom.volume = percentage;
    } else {
      videoDom.volume = 0;
    }
  };
  // 开关音量
  const switchVolumeHandle = () => {
    if (!videoDom) return;
    const { volume } = videoDom;
    if (volume) return volumeHandle(0);

    return volumeHandle(defaultVolume);
  };

  // 点击播放
  const clickPlayHandle = () => new Promise((resolve) => {
    // 如果静音播放还是没有播放就弹框点击播放
    volumeHandle(defaultVolume);
    // 静音播放按钮去掉，因为这里是点击播放
    setStatus({
      clickPlayVisible: true,
      mutedPlayVisible: false
    });

    resolve();
  });

  // 静音播放逻辑
  const mutedPlayHandle = () => {
    volumeHandle(0);
    setStatus({
      clickPlayVisible: false,
      mutedPlayVisible: true
    });
    const playPromise = videoDom.play();
    if (playPromise) {
      // promise
      return playPromise.catch(clickPlayHandle);
    }
    return new Promise((resolve) => {
      const isPaused = videoDom.paused;
      if (isPaused) return clickPlayHandle();

      resolve();
    });
  };

  // 正常播放逻辑
  const normalPlayHandle = () => {
    // 初始化两个不能播放的按钮
    setStatus({
      clickPlayVisible: false,
      mutedPlayVisible: false
    });

    // 刷新时是主动点击所以设置默认音量
    volumeHandle(status.volume);
    const playPromise = videoDom.play();
    if (playPromise) {
      // promise
      return playPromise.catch(mutedPlayHandle);
    }
    return new Promise((resolve) => {
      const isPaused = videoDom.paused;
      if (isPaused) return mutedPlayHandle();

      resolve();
    });
  };

  // 播放操作
  const playHandle = () => {
    if (!videoDom) return;

    return normalPlayHandle();
  };

  // 暂停操作
  const pauseHandle = () => {
    if (!videoDom) return;

    return videoDom.pause();
  };

  // video暂停回调事件
  const onVideoPauseHandle = () => {
    setStatus({
      paused: true,
      played: false
    });
  };
  // video播放回调事件
  const onVideoPlayHandle = () => {
    setStatus({
      paused: false,
      played: true
    });
  };
  // video音量改变回调事件
  const onVideoVolumechangeHandle = () => {
    const { volume } = videoDom;
    setStatus({ volume, muted: !volume });
  };
  // video可以播放时回调事件
  const onVideoCanPlayHandle = () => {
    setStatus({ loading: false, bufferLoading: false, create: true, destroy: false });

    return playHandle();
  };

  // video缓冲中
  const onWaitingHandle = () => setStatus({ bufferLoading: true });

  // 设置弹幕显示方式
  const setDanmakuDisplayHandle = (danmakuDisplay) => {
    setStatus({ danmakuDisplay });
    localStorage.setItem(DANMAKU_DISPLAY_KEY, danmakuDisplay);
  };

  // 设置弹幕不透明度(0-100)
  const setDanmakuOpacityHandle = (danmakuOpacity) => {
    setStatus({ danmakuOpacity: Math.min(100, Math.floor(danmakuOpacity)) });
    localStorage.setItem(DANMAKU_OPACITY_KEY, danmakuOpacity);
  };

  const storeValue = {
    instance: videoDom,
    data: {
      index: dataIndex,
      list: data,
      setIndex: setDataIndexHandle
    },
    status: {
      ...status,
      fullScreen: statusProps.fullScreen,
      ctrlVisible: statusProps.ctrlVisible
    },
    methods: {
      // 销毁
      destroy: destroyHandle,
      // 创建
      create: createHandle,
      // 刷新
      refresh: refreshHandle,
      // 播放
      play: playHandle,
      // 暂停
      pause: pauseHandle,
      // 声音设置
      volume: volumeHandle,
      // 声音开关
      switchVolume: switchVolumeHandle,
      // 全屏
      fullScreen: methodsProps.fullScreen,
      // 退出全屏
      exitScreen: methodsProps.exitScreen,
      // 开启画中画
      openPictureInPicture: openPictureInPictureHandle,
      // 关闭画中画
      closePictureInPicture: closePictureInPictureHandle,
      // 设置弹幕显示(0：关闭弹幕，1全屏弹幕，2弹幕显示上方，3弹幕显示在下方)
      danmakuDisplay: setDanmakuDisplayHandle,
      // 设置弹幕不透明度(0-100)
      danmakuOpacity: setDanmakuOpacityHandle

    }
  };

  useEffect(() => destroyHandle, []);

  return (
    <Context.Provider value={storeValue}>
      <div className={styles.container}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          className={styles.video}
          ref={videoRef}
          onPause={onVideoPauseHandle}
          onPlay={onVideoPlayHandle}
          onVolumeChange={onVideoVolumechangeHandle}
          onEnded={onErrorHandle}
          onCanPlay={onVideoCanPlayHandle}
          onWaiting={onWaitingHandle}
        />
      </div>
      {children}
    </Context.Provider>
  );
};

Provider.defaultProps = {
  list: [],
  status: {},
  methods: {},
  volume: 0.7
};

export default Provider;
