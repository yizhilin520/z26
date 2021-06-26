import React from 'react';
import ClassNames from 'classnames';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import Iconfont from '@/components/Iconfont';
import RenderJudge from '@/components/RenderJudge';
import { useStores } from '../utils/store';

import styles from '../style/Controller.scss';

const CtrlSlider = withStyles({
  root: {
    color: '#aaa9a9',
    height: '2px'
  },
  thumb: {
    '&:focus, &:hover': {
      boxShadow: 'inherit'
    }
  }
})(Slider);

const CtrlTooltip = ({ title, open, children }) => (
  <Tooltip title={title} open={open} placement="top" arrow PopperProps={{ disablePortal: true }}>
    {children}
  </Tooltip>
);

const Controller = ({ left, center, right }) => {
  const { status } = useStores();
  return (
    <div className={ClassNames(styles.container, { [styles.isVisible]: status.ctrlVisible })}>
      <div className={styles.wrapper}>
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
        <CtrlTooltip title="播放">
          <div className={ClassNames(styles.item)} onClick={methods.play}>
            <Iconfont name="bofang" className={styles.icon} />
          </div>
        </CtrlTooltip>
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
        <CtrlTooltip title="暂停">
          <div className={ClassNames(styles.item)} onClick={methods.pause}>
            <Iconfont name="zanting" className={styles.icon} />
          </div>
        </CtrlTooltip>
      )}
    />
  );
};
// 刷新
Controller.Refresh = () => {
  const { methods } = useStores();
  return (
    <CtrlTooltip title="刷新">
      <div className={ClassNames(styles.item)} onClick={methods.refresh}>
        <Iconfont name="shuaxin" className={styles.icon} />
      </div>
    </CtrlTooltip>
  );
};
// 画质
Controller.Quality = () => {
  const { data: { index, list, setIndex } } = useStores();

  const { name } = list[index] || {};

  return (
    <RenderJudge
      value={list.length}
      active={(
        <div className={ClassNames(styles.item, styles.isQuality)}>
          <div className={styles.qualityText}>{name}</div>
          <div className={styles.qualityWrapper}>
            {list.map((row, rowIndex) => (
              <div
                className={ClassNames(styles.qualityItem, { [styles.isActive]: rowIndex === index })}
                onClick={() => setIndex(rowIndex)}
                key={rowIndex}
              >
                {row.name}
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
};
// 音量
Controller.Volume = () => {
  const { status: { volume, muted }, methods } = useStores();
  const onChange = (e, v) => methods.volume(v / 100);
  return (
    <>
      <CtrlTooltip title="音量">
        <div className={styles.item} onClick={methods.switchVolume}>
          <RenderJudge
            value={muted}
            active={(<Iconfont name="jingyin" className={styles.icon} />)}
            inactive={(<Iconfont name="yinliang" className={styles.icon} />)}
          />
        </div>
      </CtrlTooltip>
      <div className={ClassNames(styles.item, styles.isVolumeBar)}>
        <CtrlSlider
          min={0}
          max={100}
          step={1}
          value={volume * 100}
          onChange={onChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(num) => Math.floor(num || 0)}
        />
      </div>
    </>
  );
};
// 全屏
Controller.FullScreen = () => {
  const { status, methods } = useStores();
  return (
    <RenderJudge
      value={status.fullScreen}
      inactive={(
        <CtrlTooltip title="全屏">
          <div className={ClassNames(styles.item)} onClick={methods.fullScreen}>
            <Iconfont name="quanping" className={styles.icon} />
          </div>
        </CtrlTooltip>
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
        <CtrlTooltip title="退出全屏">
          <div className={ClassNames(styles.item)} onClick={methods.exitScreen}>
            <Iconfont name="tuichuquanping" className={styles.icon} />
          </div>
        </CtrlTooltip>
      )}
    />
  );
};
// 打开画中画
Controller.OpenPictureInPicture = () => {
  const { status, methods } = useStores();
  return (
    <RenderJudge
      value={status.pictureInPicture}
      inactive={(
        <CtrlTooltip title="打开画中画">
          <div className={ClassNames(styles.item)} onClick={methods.openPictureInPicture}>
            <Iconfont name="open-pip" className={styles.icon} />
          </div>
        </CtrlTooltip>
      )}
    />
  );
};
// 关闭画中画
Controller.ClosePictureInPicture = () => {
  const { status, methods } = useStores();
  return (
    <RenderJudge
      value={status.pictureInPicture}
      active={(
        <CtrlTooltip title="关闭画中画">
          <div className={ClassNames(styles.item)} onClick={methods.closePictureInPicture}>
            <Iconfont name="exit-pip" className={styles.icon} />
          </div>
        </CtrlTooltip>
      )}
    />
  );
};

// 弹幕
Controller.Danmaku = () => {
  const { status, methods } = useStores();
  const { danmakuOpacity, danmakuDisplay } = status;

  const danmakuDisplayHandle = (v) => methods.danmakuDisplay(v);
  const onSliderHandle = (e, val) => methods.danmakuOpacity(val);

  return (
    <div className={ClassNames(styles.item, styles.isDanmaku)}>
      <div onClick={() => danmakuDisplayHandle(+!danmakuDisplay)}>
        <RenderJudge
          value={!!danmakuDisplay}
          active={(<Iconfont name="kaidanmu" className={styles.icon} />)}
          inactive={(<Iconfont name="guandanmu" className={styles.icon} />)}
        />
      </div>
      <RenderJudge
        value={danmakuDisplay === 0}
        inactive={(
          <div className={styles.danmakuWrapper}>
            <div className={styles.opacityText}>不透明度</div>
            <div className={styles.opacity}>
              <div className={styles.opacityBar}>
                <CtrlSlider
                  min={0}
                  max={100}
                  step={1}
                  value={danmakuOpacity}
                  valueLabelDisplay="off"
                  onChange={onSliderHandle}
                />
              </div>
              <div className={styles.opacityVal}>{`${danmakuOpacity}%`}</div>
            </div>
            <div className={styles.location}>
              <div
                className={ClassNames(
                  styles.locationItem,
                  styles.isFull,
                  { [styles.isActive]: danmakuDisplay === 1 }
                )}
                onClick={() => danmakuDisplayHandle(1)}
              >
                全屏
              </div>
              <div
                className={ClassNames(
                  styles.locationItem,
                  styles.isTop,
                  { [styles.isActive]: danmakuDisplay === 2 }
                )}
                onClick={() => danmakuDisplayHandle(2)}
              >
                上方
              </div>
              <div
                className={ClassNames(
                  styles.locationItem,
                  styles.isBottom,
                  { [styles.isActive]: danmakuDisplay === 3 }
                )}
                onClick={() => danmakuDisplayHandle(3)}
              >
                下方
              </div>
            </div>
          </div>
        )}
      />
    </div>
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
      <Controller.Quality />
      <Controller.Danmaku />
      <Controller.Volume />
      <Controller.OpenPictureInPicture />
      <Controller.ClosePictureInPicture />
      <Controller.FullScreen />
      <Controller.ExitFullScreen />
    </>
  )
};

export default Controller;
