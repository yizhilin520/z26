import React from 'react';
import ClassNames from 'classnames';
import Iconfont from '@/components/Iconfont';
import RenderJudge from '@/components/RenderJudge';
import { useStores } from '../utils/store';

import styles from '../style/Controller.scss';

const Controller = ({ left, center, right }) => {
  const { status } = useStores();
  return (
    <div className={ClassNames(styles.container, { [styles.isVisible]: status.ctrlVisible })}>
      <div className={ClassNames(styles.wrapper, { [styles.isFull]: status.fullScreen })}>
        <div className={ClassNames(styles.inner, styles.isLeft)}>
          {left}
        </div>
        <div className={ClassNames(styles.inner, styles.isCenter)}>
          {center}
        </div>
        <div className={ClassNames(styles.inner, styles.isRight)}>
          {right}
        </div>
      </div>
    </div>
  );
};

// 播放
Controller.Play = () => {
  const { status, methods } = useStores();
  return (
    <RenderJudge
      value={status.paused}
      active={(
        <div className={ClassNames(styles.item)} onClick={methods.play}>
          <Iconfont name="bofang" className={styles.icon} />
        </div>
      )}
    />
  );
};
// 暂停
Controller.Pause = () => {
  const { status, methods } = useStores();
  return (
    <RenderJudge
      value={status.played}
      active={(
        <div className={ClassNames(styles.item)} onClick={methods.pause}>
          <Iconfont name="zanting" className={styles.icon} />
        </div>
      )}
    />
  );
};
// 刷新
Controller.Refresh = () => {
  const { methods } = useStores();
  return (
    <div className={ClassNames(styles.item)} onClick={methods.refresh}>
      <Iconfont name="shuaxin" className={styles.icon} />
    </div>
  );
};
// 音量
Controller.Volume = () => {
  const { status: { muted }, methods } = useStores();

  return (
    <div className={styles.item} onClick={methods.switchVolume}>
      <RenderJudge
        value={muted}
        active={(<Iconfont name="jingyin" className={styles.icon} />)}
        inactive={(<Iconfont name="yinliang" className={styles.icon} />)}
      />
    </div>
  );
};
// 全屏
Controller.FullScreen = () => {
  const { status, methods } = useStores();
  return (
    <RenderJudge
      value={status.fullScreen}
      inactive={(
        <div className={ClassNames(styles.item)} onClick={methods.fullScreen}>
          <Iconfont name="quanping" className={styles.icon} />
        </div>
      )}
    />
  );
};
// 退出全屏
Controller.ExitFullScreen = () => {
  const { status, methods } = useStores();
  return (
    <RenderJudge
      value={status.fullScreen}
      active={(
        <div className={ClassNames(styles.item)} onClick={methods.exitScreen}>
          <Iconfont name="tuichuquanping" className={styles.icon} />
        </div>
      )}
    />
  );
};

Controller.defaultProps = {
  left: (
    <>
      <Controller.Play />
      <Controller.Pause />
      <Controller.Refresh />
    </>
  ),
  center: null,
  right: (
    <>
      <Controller.Volume />
      <Controller.FullScreen />
      <Controller.ExitFullScreen />
    </>
  )
};

export default Controller;
