import React, { useEffect, useRef } from 'react';
import { empty } from '@/utils/common';
import { usePersistFn } from '@/utils/hooks';
import LivePlayer from '@/components/LivePlayer';
import Provider from './components/Provider';
import Anchor from './components/Anchor';
import Animation from './components/Animation';
import Gift from './components/Gift';
import Message from './components/Message';
import Layout from './components/Layout';
import Billboard from './components/Billboard';
import Notice from './components/Notice';

const LiveRoomPlayerLayout = ({ className, data, footballStat, onKick }) => {
  const { room_id, live_type_id, status, playAddr } = data;

  const playerRef = useRef();
  const giftRef = useRef();
  const animationRef = useRef();
  // 发送弹幕
  const pushDanmakuHandle = usePersistFn((text, isSelf) => playerRef.current.danmaku.push(text, isSelf));
  // 发送动画
  const pushAnimationHandle = usePersistFn((id) => {
    const animationUrls = giftRef.current.getGiftUrl(id);

    return animationRef.current.push(animationUrls);
  });

  useEffect(() => {
    playerRef.current.create();
  }, [playAddr]);

  return (
    <Provider
      className={className}
      data={data}
      components={{
        // 主播
        anchor: (<Anchor />),
        // 消息
        message: (<Message />),
        // 播放器
        player: (
          <>
            <LivePlayer
              ref={playerRef}
              data={playAddr || []}
              useGuideLogin
            >
              <LivePlayer.StatusRecommend sportId={live_type_id} status={status} roomId={room_id} />
            </LivePlayer>
          </>
        ),
        // 礼物
        gift: (
          <>
            {footballStat}
            <Gift ref={giftRef} />
          </>
        ),
        // 动画
        animation: (<Animation ref={animationRef} />),
        // 榜单
        billboard: (<Billboard />),
        // 公告
        notice: (<Notice />)
      }}
      methods={{
        // 发送弹幕
        pushDanmaku: pushDanmakuHandle,
        // 发送动画
        pushAnimation: pushAnimationHandle
      }}
      chatId={room_id}
      onKick={onKick}
    />
  );
};

LiveRoomPlayerLayout.defaultProps = {
  data: {},
  onKick: empty
};

LiveRoomPlayerLayout.Provider = Provider;
LiveRoomPlayerLayout.Layout = Layout;
LiveRoomPlayerLayout.Anchor = Anchor;
LiveRoomPlayerLayout.Player = LivePlayer;
LiveRoomPlayerLayout.Animation = Animation;
LiveRoomPlayerLayout.Gift = Gift;
LiveRoomPlayerLayout.Message = Message;
LiveRoomPlayerLayout.Billboard = Billboard;
LiveRoomPlayerLayout.Notice = Notice;

export default LiveRoomPlayerLayout;
