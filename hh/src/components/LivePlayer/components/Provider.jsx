import React, { useEffect, useRef } from 'react';
import FlvJs from 'flv.js';
import HlsJs from 'hls.js';
import { usePersistFn, useSetState } from 'ahooks';
import useSafeState from 'ahooks/lib/useSafeState';
import { addOnceEventListener } from '@/common/utils';
import { Context } from '../utils/store';

import styles from '../style/Provider.scss';

const Provider = ({ data, status: statusProps, methods: methodsProps, volume: defaultVolume, children }) => {
  const bufferLoadingTimer = useRef(null);
  const [flvInstance, setFlvInstance] = useSafeState(null);
  const [hlsInstance, setHlsInstance] = useSafeState(null);
  const [dataIndex, setIndex] = useSafeState(0);
  const [status, setStatus] = useSetState({
    ...statusProps,
    loading: true,
    volume: defaultVolume,
    ctrlVisible: true,
    // 是否暂停
    paused: true
  });

  const videoRef = useRef();
  const videoDom = videoRef.current;

  // 销毁
  const destroyHandle = usePersistFn(() => {
    if (videoDom) {
      videoDom.pause();
    }

    if (flvInstance) {
      try {
        flvInstance.off(FlvJs.Events.ERROR, destroyHandle);
        flvInstance.unload();
        flvInstance.detachMediaElement();
        flvInstance.destroy();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(e);
      }

      setFlvInstance(null);
    }

    if (hlsInstance) {
      try {
        hlsInstance.off(HlsJs.Events.ERROR, destroyHandle);
        hlsInstance.destroy();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(e);
      }

      setHlsInstance(null);
    }

    clearInterval(bufferLoadingTimer.current);
  });

  // 错误回调
  const onErrorHandle = () => {
    setStatus({ loading: false, bufferLoading: false, create: false, destroy: true });

    return destroyHandle();
  };

  // 视频缓冲中效果
  const setBufferLoadingChecker = () => {
    if (!videoDom) return;

    clearInterval(bufferLoadingTimer.current);

    let lastPlayPos = 0;
    let currentPlayPos = 0;
    let bufferingDetected = false;

    bufferLoadingTimer.current = setInterval(() => {
      // whether the video is buffering
      currentPlayPos = videoDom.currentTime;
      if (!bufferingDetected && currentPlayPos && currentPlayPos === lastPlayPos) bufferingDetected = true;

      if (bufferingDetected && currentPlayPos > lastPlayPos) bufferingDetected = false;

      setStatus({ bufferLoading: bufferingDetected });
      lastPlayPos = currentPlayPos;
    }, 100);
  };

  // 根据索引创建播放器
  const createByIndexHandle = usePersistFn((index) => {
    const { playUrl, protocolType } = data[index] || {};
    setStatus({ loading: !!playUrl, bufferLoading: false, create: false, destroy: !playUrl });

    destroyHandle();
    if (!playUrl) return;

    if (protocolType === 'flv' && FlvJs.isSupported()) {
      const ins = FlvJs.createPlayer({
        type: protocolType,
        url: playUrl
      });
      ins.attachMediaElement(videoRef.current);
      ins.load();
      ins.on(FlvJs.Events.ERROR, onErrorHandle);

      setFlvInstance(ins);
    } else if (protocolType === 'm3u8' && HlsJs.isSupported()) {
      const ins = new HlsJs({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      ins.loadSource(playUrl);
      ins.attachMedia(videoRef.current);
      ins.on(HlsJs.Events.ERROR, onErrorHandle);

      setHlsInstance(ins);
    } else {
      videoRef.current.src = playUrl;
    }
    try {
      videoRef.current.load();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e);
    }

    // react 会忽略某些事件，所以直接使用代码的方式监听
    // ios退出全屏监听
    addOnceEventListener(videoRef.current, 'webkitendfullscreen', () => setStatus({ fullScreen: false }));

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

    setBufferLoadingChecker();
    return playHandle();
  };

  const onSetCtrlVisibleHandle = (ctrlVisible) => setStatus({ ctrlVisible });

  const storeValue = {
    instance: videoDom,
    data: {
      index: dataIndex,
      list: data,
      setIndex: setDataIndexHandle
    },
    status,
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
      fullScreen: () => {
        try {
          methodsProps.fullScreen();
        } catch (e) {
          videoRef.current.webkitEnterFullScreen();
        }
      },
      // 退出全屏
      exitScreen: methodsProps.exitScreen

    }
  };

  useEffect(() => destroyHandle, []);

  return (
    <Context.Provider value={storeValue}>
      <div
        className={styles.container}
        onClick={() => onSetCtrlVisibleHandle(!status.ctrlVisible)}
      >
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          className={styles.video}
          ref={videoRef}
          preload="auto"
          webkit-playsinline="true"
          playsInline
          x5-playsinline="true"
          x-webkit-airplay="true"
          controls="controls"
          onPause={onVideoPauseHandle}
          onPlay={onVideoPlayHandle}
          onVolumeChange={onVideoVolumechangeHandle}
          onEnded={onErrorHandle}
          onError={onErrorHandle}
          onCanPlay={onVideoCanPlayHandle}
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
  volume: 1
};

export default Provider;
