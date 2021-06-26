import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useSetState } from 'ahooks';
import RenderJudge from '@/components/RenderJudge';
import Controller from './components/Controller';
import Provider from './components/Provider';
import BufferLoading from './components/BufferLoading';
import Loading from './components/Loading';
import Recommend from './components/Recommend';
import Status from './components/Status';
import StatusRecommend from './components/StatusRecommend';
import { Context, useStores } from './utils/store';

import styles from './style/index.scss';

const Main = forwardRef((props, ref) => {
  const { instance, status, methods } = useStores();

  useImperativeHandle(ref, () => ({
    create: methods.create,
    destroy: methods.destroy
  }));

  return (
    <>
      <RenderJudge
        value={status.played && instance && status.bufferLoading}
        active={(<BufferLoading />)}
      />
      <RenderJudge
        value={status.loading}
        active={(<Loading />)}
      />
    </>
  );
});

const LivePlayer = forwardRef(({ data, ctrl, children }, ref) => {
  const containerRef = useRef();
  const [status, setStatus] = useSetState({
    fullScreen: false
  });

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
  return (
    <div
      ref={containerRef}
      className={styles.container}
    >
      <Provider data={data} status={status} methods={methods}>
        <Main ref={ref} ctrl={ctrl} />
        {children}
      </Provider>
    </div>
  );
});

LivePlayer.defaultProps = {
  data: []
};

LivePlayer.Controller = Controller;
LivePlayer.Recommend = Recommend;
LivePlayer.Status = Status;
LivePlayer.StatusRecommend = StatusRecommend;
LivePlayer.Context = Context;
LivePlayer.useStores = useStores;

export default LivePlayer;
