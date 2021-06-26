import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useSelector } from 'react-redux';
import ClassNames from 'classnames';
import { usePersistFn, useSafeState } from '@/utils/hooks';
import ForecastDanmmaku from './ForecastDanmmaku';
import DanmakuClient from '../utils/danmaku';
import { useStores } from '../utils/store';

import styles from '../style/Danmaku.scss';

const Danmaku = forwardRef((props, ref) => {
  const { uid } = useSelector(({ user }) => user.userInfo);
  const [instance, setInstance] = useSafeState();
  const { status: { danmakuDisplay, danmakuOpacity } } = useStores();
  const containerRef = useRef();

  // 验证是否是自己
  const verifyIsSelf = (id) => new RegExp(id).test(uid);

  useEffect(() => {
    const ins = new DanmakuClient(containerRef.current);
    setInstance(ins);
  }, []);

  // 普通消息弹幕
  const simpleMessageHandle = usePersistFn((m) => {
    const { message, userId: msgUserId } = m;

    return instance.push({ text: message, border: verifyIsSelf(msgUserId) });
  });
  // 机器人消息弹幕
  const robotMessageHandle = usePersistFn((m) => {
    const { message } = m;

    return instance.push({ text: message });
  });
  // 礼物消息弹幕
  const giftMessageHandle = usePersistFn((m) => {
    const { userId: msgUserId, ext } = m;
    const { giftQuantity, giftName, userNickName } = ext || {};

    return instance.push({ text: `${userNickName}：送出 ${giftQuantity} 个 ${giftName}`, border: verifyIsSelf(msgUserId) });
  });
  // 预测购买消息弹幕
  const forecastPurchaseMessageHandle = usePersistFn((m) => {
    const { ext } = m;
    const { userHead, userNickName, msg } = ext || {};

    return instance.push({ text: (<ForecastDanmmaku userName={userNickName} userImage={userHead} text={msg} />) });
  });

  const pushHandle = usePersistFn((m) => {
    if (!instance || !danmakuDisplay || !m) return;
    const { messageType } = m || {};

    // 普通发言消息
    if (messageType === 1) return simpleMessageHandle(m);
    // 机器人消息
    if (messageType === 6) return robotMessageHandle(m);
    // 礼物消息
    if (messageType === 2) return giftMessageHandle(m);
    // 预测购买消息弹幕
    if (messageType === 9) return forecastPurchaseMessageHandle(m);
  });

  useImperativeHandle(ref, () => ({
    push: pushHandle
  }));

  return (
    <div
      className={ClassNames(styles.container, {
        [styles.isHidden]: !danmakuDisplay,
        [styles.isFull]: danmakuDisplay === 1,
        [styles.isTop]: danmakuDisplay === 2,
        [styles.isBottom]: danmakuDisplay === 3
      })}
      style={{ opacity: (danmakuOpacity / 100) || 0 }}
      ref={containerRef}
    />
  );
});

export default Danmaku;
