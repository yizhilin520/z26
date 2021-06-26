import React, { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRequest } from 'ahooks';
import { getBasketballRealtime, getFootballRealtime, getLive365 } from '@/servers/scoreServer';
import RenderJudge from '@/components/RenderJudge';
import LiveRoomPlayerLayout from '@/components/LiveRoomPlayerLayout';
import FootballStat from '@/components/FootballStat';
import ScoreStatistics from '@/components/ScoreStatistics';
import LiveTabs from '@/pages/score/live';
import Wrapper from './Wrapper';

import styles from '../style/Live.scss';

const ScoreAnimationStatus = ({ url }) => {
  const { status } = LiveRoomPlayerLayout.Player.useStores();
  if (status.destroy) {
    return (
      <RenderJudge
        value={url}
        active={(
          <div className={styles.playIframe}>
            <iframe
              src={url}
              className={styles.playIframeInner}
            />
          </div>
        )}
        inactive={(
          <LiveRoomPlayerLayout.Player.StatusRecommend sportId={1} status={3} />
        )}
      />
    );
  }

  return null;
};

const Live = ({ matchInfo }) => {
  const { zhishu } = useSelector(({ config }) => config.globalSwitch);
  const playerRef = useRef();
  const { eventId, eventType, animationUrl } = matchInfo;

  const { data } = useRequest(() => getLive365({ match_id: eventId }).toPromise());
  // 获取技术统计
  const { data: realtimeData = [] } = useRequest(
    () => {
      if (eventType === 1) return getFootballRealtime({ matchId: eventId }).toPromise();
      if (eventType === 2) return getBasketballRealtime({ matchId: eventId }).toPromise();
    }, {
      ready: eventType === 1 || eventType === 2,
      pollingInterval: 60000
    }
  );

  const playAddr = useMemo(() => {
    if (!data || !data.length) return [];

    return data.map(([, playUrl, code, title, name] = []) => ({
      playUrl,
      code,
      title,
      name,
      protocolType: 'flv'
    }));
  }, [data]);
  const status = playAddr.length ? 1 : null;

  useEffect(() => {
    playerRef.current.create();
  }, [playAddr]);

  return (
    <Wrapper isRadius={false} isShadow={false}>
      <LiveRoomPlayerLayout.Provider
        data={{ playAddr, status }}
        chatId={eventId}
        components={{
          // 消息
          message: (<LiveRoomPlayerLayout.Message />),
          // 播放器
          player: (
            <LiveRoomPlayerLayout.Player
              ref={playerRef}
              data={playAddr || []}
              useGuideLogin
            >
              <ScoreAnimationStatus url={animationUrl} />
            </LiveRoomPlayerLayout.Player>
          ),
          // 将足球统计放在礼物布局上
          gift: (
            <RenderJudge
              value={realtimeData.length && eventType === 1}
              active={(<FootballStat data={realtimeData} />)}
            />
          )
        }}
      />
      <RenderJudge
        value={realtimeData.length && zhishu}
        active={(
          <ScoreStatistics matchInfo={matchInfo} textLive={realtimeData[2] || []} matchId={eventId} />
        )}
      />
      <LiveTabs
        liveTypeId={eventType}
        textLive={realtimeData[2] || []}
      />
    </Wrapper>
  );
};

Live.defaultProps = {
  matchInfo: {}
};

export default Live;
