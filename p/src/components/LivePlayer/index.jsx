import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { addOnceEventListener } from '@/utils/common';
import { useSetState, useTimeout } from '@/utils/hooks';
import RenderJudge from '@/components/RenderJudge';
import GuideLogin from '@/components/GuideLogin';
import Controller from './components/Controller';
import Provider from './components/Provider';
import BufferLoading from './components/BufferLoading';
import Loading from './components/Loading';
import Danmaku from './components/Danmaku';
import Recommend from './components/Recommend';
import Status from './components/Status';
import StatusRecommend from './components/StatusRecommend';
import ManuallyPlay from './components/ManuallyPlay';
import { Context, useStores } from './utils/store';

import styles from './style/index.scss';

const Main = forwardRef(({ ctrl, useGuideLogin }, ref) => {
  const { instance, status, methods } = useStores();
  const danmakuRef = useRef();

  useImperativeHandle(ref, () => ({
    create: methods.create,
    destroy: methods.destroy,
    danmaku: {
      push: danmakuRef.current.push
    }
  }));

  return (
    <>
      <Danmaku ref={danmakuRef} />
      {ctrl}
      <RenderJudge
        value={status.played && instance && status.bufferLoading}
        active={(<BufferLoading />)}
      />
      <RenderJudge
        value={status.clickPlayVisible}
        active={(<ManuallyPlay />)}
      />
      <RenderJudge
        value={useGuideLogin}
        active={(<GuideLogin />)}
      />
      <RenderJudge
        value={status.loading}
        active={(<Loading />)}
      />
    </>
  );
});

const LivePlayer = forwardRef(({ data, ctrl, useGuideLogin, children }, ref) => {
  const containerRef = useRef();
  const [status, setStatus] = useSetState({
    fullScreen: false,
    ctrlVisible: false
  });

  // 倒计时隐藏控制器
  useTimeout(() => setStatus({ ctrlVisible: false }), status.ctrlVisible && status.fullScreen ? 3000 : null);

  const methods = {
    // 全屏
    fullScreen() {
      const container = containerRef.current;
      if (!container) return;

      setStatus({ fullScreen: true });

      const handler = container.requestFullscreen || container.mozRequestFullScreen || container.webkitRequestFullscreen || container.msRequestFullscreen;
      return handler.call(container);
    },
    // 退出全屏
    exitScreen() {
      const handler = document.cancelFullScreen || document.mozCancelFullScreen || document.webkitCancelFullScreen || document.msCancelFullScreen || document.msExitFullscreen;

      setStatus({ fullScreen: false });

      return handler.call(document);
    }
  };
  const onSetCtrlVisibleHandle = (ctrlVisible) => setStatus({ ctrlVisible });
  useEffect(() => {
    addOnceEventListener(window, 'resize', () => {
      setStatus({
        fullScreen: !!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement)
      });
    });
  }, []);
  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <div
      ref={containerRef}
      className={styles.container}
      onMouseEnter={() => onSetCtrlVisibleHandle(true)}
      onMouseLeave={() => onSetCtrlVisibleHandle(false)}
      onMouseMove={() => onSetCtrlVisibleHandle(true)}
    >
      <Provider data={data} status={status} methods={methods}>
        <Main ref={ref} ctrl={ctrl} useGuideLogin={useGuideLogin} />
        {children}
      </Provider>
    </div>
  );
});

LivePlayer.defaultProps = {
  data: [],
  ctrl: (<Controller />)
};

LivePlayer.Danmuku = Danmaku;
LivePlayer.Controller = Controller;
LivePlayer.Recommend = Recommend;
LivePlayer.Status = Status;
LivePlayer.StatusRecommend = StatusRecommend;
LivePlayer.Context = Context;
LivePlayer.useStores = useStores;

export default LivePlayer;
