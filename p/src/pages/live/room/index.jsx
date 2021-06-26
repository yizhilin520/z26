import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { scoreDataFormat } from '@/utils/common';
import { useInterval, usePageViewDataReport, useRequest, useSafeState } from '@/utils/hooks';
import { getRoomDetail } from '@/servers/homeServer';
import { getBasketballRealtime, getFootballRealtime, getMatchInfo } from '@/servers/scoreServer';
import { useSnackbar } from '@/plugins';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RenderJudge from '@/components/RenderJudge';
import LiveRoomPlayerLayout from '@/components/LiveRoomPlayerLayout';
import ScoreHeaderRecap from '@/components/ScoreHeaderRecap';
import FootballStat from '@/components/FootballStat';
import ScoreStatistics from '@/components/ScoreStatistics';
import LiveTabs from '@/pages/score/live';
import KickOutIng from './components/KickOutIng';

import styles from './style/index.scss';

const LiveRoomPage = ({ match: { params: { id: roomId } } }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useSafeState(null);
  const { zhishu } = useSelector(({ config }) => config.globalSwitch);
  const history = useHistory();

  const { data: matchInfo, mutate: matchInfoMutate } = useRequest(
    (q) => getMatchInfo(q).toPromise(),
    null,
    (d) => scoreDataFormat(d || []),
    { useManual: true }
  );

  // 获取技术统计
  const { data: realtimeData = [], mutate: realtimeMutate } = useRequest(
    (q) => {
      if (data.live_type_id === 1) return getFootballRealtime(q).toPromise();
      if (data.live_type_id === 2) return getBasketballRealtime(q).toPromise();
    },
    null,
    () => {
    },
    { useManual: true }
  );

  // 定时请求
  useInterval(
    () => realtimeMutate({ matchId: data.match_id }),
    data?.match_id && 60000,
    { immediate: true }
  );

  const { loading, mutate } = useRequest(
    (q) => getRoomDetail(q).toPromise(),
    { roomId, protocolType: 'flv' },
    (d) => {
      if (!d) {
        return enqueueSnackbar(
          '直播间不存在！', {
            onClose: (e, reason) => {
              if (reason === 'timeout') history.replace('/live/list');
            }
          }
        );
      }

      const { match_id } = d || {};

      setData(d);

      if (match_id) matchInfoMutate({ match_id });
    }
  );

  useEffect(() => {
    if (!loading) mutate({ roomId, protocolType: 'flv' });
  }, [roomId]);

  const { anchor = {}, live_type_id, title, room_id } = data || {};
  let liveTypeName = '';
  if (live_type_id === 1) {
    liveTypeName = '足球';
  } else if (live_type_id === 2) {
    liveTypeName = '篮球';
  }
  let titleNew = `直播间${roomId}_${liveTypeName || ''}直播${title}-U球直播`;
  const keywordsNew = `${anchor.nickname},${anchor.nickname}直播,${liveTypeName || ''}直播,${anchor.nickname}${liveTypeName || ''}精彩视频`;
  let descriptionNew = `欢迎来到u球“${roomId}”“${liveTypeName || ''}”直播间,本直播间提供最精彩的“${anchor.nickname}”“${liveTypeName || ''}”直播,“${anchor.nickname}”带你领略最有趣的“${liveTypeName || ''}”视频直播。`;
  if (anchor.nickname) {
    titleNew = `${anchor.nickname}的直播间${roomId}_${liveTypeName || ''}直播${title}-U球直播`;
    descriptionNew = `欢迎来到主播“${anchor.nickname}”的u球“${roomId}”“${liveTypeName || ''}”直播间,本直播间提供最精彩的“${anchor.nickname}”“${liveTypeName || ''}”直播,“${anchor.nickname}”带你领略最有趣的“${liveTypeName || ''}”视频直播。`;
  }

  usePageViewDataReport('web_11', { params: { event_value: '直播间', page_title: titleNew }, ready: data });

  // 踢人操作
  const onKickHandle = () => setData({
    ...data || {},
    isKickOutIng: true
  });

  if (loading || !data) return null;
  if (data.isKickOutIng) return (<KickOutIng />);
  return (
    <div className={styles.container}>
      <Helmet>
        <title>{titleNew}</title>
        <meta name="keywords" content={keywordsNew} />
        <meta name="description" content={descriptionNew} />
      </Helmet>
      <Header isLive />
      <RenderJudge
        value={matchInfo}
        active={(<ScoreHeaderRecap data={matchInfo || {}} />)}
      />
      <LiveRoomPlayerLayout
        className={styles.player}
        data={data}
        footballStat={(
          <RenderJudge
            value={realtimeData.length && data.live_type_id === 1 && zhishu}
            active={(<FootballStat data={realtimeData} />)}
          />
        )}
        onKick={onKickHandle}
      />
      <div className={styles.wrapper}>
        <RenderJudge
          value={data?.match_id && realtimeData.length && zhishu}
          active={(
            <ScoreStatistics matchInfo={matchInfo} textLive={realtimeData[2] || []} matchId={data?.match_id} />
          )}
        />
        {/* TODO 有时间重构 */}
        <LiveTabs
          liveTypeId={live_type_id}
          textLive={realtimeData[2] || []}
          anchorUid={anchor?.uid}
          anchorAid={anchor?.aid}
          roomId={room_id}
        />
      </div>
      <Footer />
    </div>
  );
};

export default LiveRoomPage;
