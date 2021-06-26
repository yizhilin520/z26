import React from 'react';
import { useSelector } from 'react-redux';
import { useRequest } from 'ahooks';
import useSafeState from 'ahooks/lib/useSafeState';
import { scoreDataFormat } from '@/utils/common';
import { getMatchDetails, getMatchInfo } from '@/servers/scoreServer';
import { Helmet } from 'react-helmet';
import { usePageViewDataReport } from '@/utils/hooks';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RenderJudge from '@/components/RenderJudge';
import ScoreHeaderRecap from '@/components/ScoreHeaderRecap';
import Tabs from './components/Tabs';
import European from './components/European';
import Handicap from './components/Handicap';
import Size from './components/Size';
import Live from './components/Live';
import Join from './components/Join';

import styles from './style/index.scss';

const ScoreDetailPage = ({ match: { params: { eventId, page } } }) => {
  const [oddsData, setOddsData] = useSafeState([]);
  const { zhishu } = useSelector(({ config }) => config.globalSwitch);

  const { data = [], loading } = useRequest(
    () => getMatchInfo({ match_id: eventId }).toPromise(),
    {
      refreshDeps: [eventId]
    }
  );
  useRequest(
    () => getMatchDetails({ match_id: eventId }).toPromise(),
    {
      ready: !!zhishu,
      refreshDeps: [eventId],
      pollingWhenHidden: false,
      pollingInterval: 3000,
      onSuccess: (d) => setOddsData(d || oddsData)
    }
  );

  const matchInfo = scoreDataFormat(data);

  const pageTitle = `${matchInfo.homeTeamName} VS ${matchInfo.awayTeamName}`;

  usePageViewDataReport('web_21', {
    params: {
      event_value: '比分落地页',
      page_title: pageTitle
    },
    ready: data.length
  });

  if (loading) return null;

  // 是否是足球
  const isFootball = matchInfo.eventType === 1;

  // 欧指
  const europeanObj = {
    label: '欧指',
    value: 'european',
    component: (<European data={oddsData} />)
  };
  // 让球
  const handicapObj = {
    label: '让球',
    value: 'handicap',
    component: (<Handicap data={oddsData} />)
  };
  // 大小
  const sizeObj = {
    label: '大小',
    value: 'size',
    component: (<Size data={oddsData} />)
  };
  // 直播
  const liveObj = {
    label: '直播',
    value: 'live',
    component: (<Live matchInfo={matchInfo} />)
  };
  // 三合一
  const joinObj = {
    label: '三合一',
    value: 'join',
    component: (<Join data={oddsData} />)
  };

  const tabList = [isFootball && europeanObj, handicapObj, sizeObj, joinObj, liveObj].filter(Boolean);

  const { component, value } = zhishu ? (tabList.find((row) => row.value === page) || handicapObj) : liveObj;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="keywords" content="足球直播,篮球直播,比赛直播" />
      </Helmet>
      <Header isScore />
      <ScoreHeaderRecap data={matchInfo} useTimelyPush />
      <RenderJudge
        value={zhishu}
        active={(
          <Tabs value={value} list={tabList} eventId={eventId} />
        )}
      />
      {component}
      <Footer />
    </div>
  );
};

export default ScoreDetailPage;
