import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import useSafeState from 'ahooks/lib/useSafeState';
import FooterTabs from '@/components/FooterTabs';
import HeaderDownload from '@/components/HeaderDownload';
import Tabs from '@/pages/home/components/Tabs';
import RenderJudge from '@/components/RenderJudge';
import Loading from '@/components/Loading';
import { usePageViewDataReport } from '@/common/hooks';
import HotList from './components/HotList';
import FootballList from './components/FootballList';
import BasketballList from './components/BasketballList';
import styles from './style/index.scss';

const ScorePage = () => {
  const [sprotTypeId, setSprotTypeId] = useSafeState(0);
  const [loading, setLoading] = useSafeState(true);

  const pageTitle = '足球_篮球热门比赛赛事-赛程中心-U球体育';

  usePageViewDataReport('h5_2', { params: { event_value: '比分首页', page_title: pageTitle } });

  const tabList = [{
    label: '热门',
    value: 0
  }, {
    label: '足球',
    value: 1
  }, {
    label: '篮球',
    value: 2
  }];

  const handleTabChange = (tabId) => {
    setSprotTypeId(tabId);
  };

  const SportList = useMemo(() => {
    if (sprotTypeId === 1) return <FootballList onLoading={(value) => setLoading(value)} />;
    if (sprotTypeId === 2) return <BasketballList onLoading={(value) => setLoading(value)} />;
    return <HotList onLoading={(value) => setLoading(value)} />;
  }, [sprotTypeId]);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="keywords" content="足球赛程,篮球赛程,比赛赛程" />
      </Helmet>
      <div className={styles.container}>
        <HeaderDownload />
        <Tabs
          value={sprotTypeId}
          list={tabList}
          onChange={handleTabChange}
        />
        <div className={styles.matchContainer}>
          {SportList}
        </div>
        <FooterTabs isScore />
        <RenderJudge
          value={loading}
          active={(<Loading />)}
        />
      </div>
    </>
  );
};

export default ScorePage;
