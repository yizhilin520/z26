import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import SvgAnimation from 'svgaplayerweb';
import { empty } from '@/utils/common';
import { usePersistFn, useSafeState } from '@/utils/hooks';

const SvgAnimationPlayer = forwardRef(({
  className,
  style,
  url,
  options,
  autoPlay,
  onLoad,
  onFinished,
  onFrame,
  onPercentage
}, ref) => {
  const [instance, setInstance] = useSafeState(null);
  const wrapperRef = useRef();

  // 播放
  const playHandle = usePersistFn((svgAUrl) => {
    if (!svgAUrl) return;

    const ins = new SvgAnimation.Player(wrapperRef.current);
    const parser = new SvgAnimation.Parser(wrapperRef.current);

    Object.keys(options).forEach((name) => {
      ins[name] = options[name];
    });

    parser.load(svgAUrl, (video) => {
      ins.setVideoItem(video);
      ins.startAnimation();

      onLoad(video);
    });
    ins.onFinished(onFinished);
    ins.onFrame(onFrame);
    ins.onFrame(onPercentage);

    setInstance(ins);

    return instance;
  });
  // 停止
  const stopHandle = usePersistFn(() => {
    if (!instance) return;

    instance.clearDynamicObjects();

    setInstance(null);
  });

  useEffect(() => {
    if (url && autoPlay) playHandle(url);

    return stopHandle;
  }, [url]);

  useEffect(() => stopHandle, []);

  useImperativeHandle(ref, () => ({
    play: playHandle,
    stop: stopHandle
  }));

  return (
    <div className={className} style={style} ref={wrapperRef} />
  );
});

SvgAnimationPlayer.defaultProps = {
  style: {
    width: '100%',
    height: '100%'
  },
  options: {
    loops: 1,
    clearsAfterStop: true
  },
  autoPlay: true,
  onLoad: empty,
  onFinished: empty,
  onFrame: empty,
  onPercentage: empty
};

export default SvgAnimationPlayer;
