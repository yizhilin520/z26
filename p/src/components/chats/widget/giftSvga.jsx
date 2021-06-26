import React, { useEffect, useRef } from 'react';
import { useSafeState } from '@/utils/hooks';
import SvgAnimationPlayer from '@/components/SvgAnimationPlayer';

import style from './widget.scss';

export default function GiftSvgAnimation({ giftAnimation, randomstr }) {
  const [showAnimation, setShowAnimation] = useSafeState(false);
  const animationRef = useRef();

  const onFinishedHandle = () => setShowAnimation(false);
  const onLoadHandle = () => setShowAnimation(true);

  useEffect(() => {
    if (giftAnimation) animationRef.current.play();
    return animationRef.current.stop;
  }, [randomstr, giftAnimation]);

  return (
    <SvgAnimationPlayer
      className={style.giftSvga}
      style={{ display: showAnimation ? 'block' : 'none' }}
      ref={animationRef}
      url={giftAnimation}
      autoPlay={false}
      onFinished={onFinishedHandle}
      onLoad={onLoadHandle}
    />
  );
}
