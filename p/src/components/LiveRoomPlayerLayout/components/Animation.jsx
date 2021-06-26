import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { usePersistFn, useSafeState } from '@/utils/hooks';
import SvgAnimationPlayer from '@/components/SvgAnimationPlayer';

import styles from '../style/Animation.scss';

const Animation = forwardRef((props, ref) => {
  const [isPlaying, setIsPlaying] = useSafeState(false);
  const [list, setList] = useSafeState([]);
  const svgARef = useRef();

  const playHandle = usePersistFn((data) => {
    if (!data.length) return;
    const url = data[0];
    if (!url) return;

    svgARef.current.play(url);
    setIsPlaying(true);
  });

  const pushHandle = usePersistFn((src) => {
    const srcList = Array.isArray(src) ? src : [src];
    const result = list.concat(srcList);
    setList(result);
    if (!isPlaying) playHandle(result);
  });
  const onFinishedHandle = usePersistFn(() => {
    const result = list.slice(1);
    setList(result);
    setIsPlaying(false);
    playHandle(result);
  });

  useImperativeHandle(ref, () => ({
    push: pushHandle
  }));

  return (
    <SvgAnimationPlayer
      className={styles.container}
      onFinished={onFinishedHandle}
      autoPlay={false}
      ref={svgARef}
    />
  );
});

export default Animation;
