import React from 'react';
import { useRequest } from 'ahooks';
import useSafeState from 'ahooks/lib/useSafeState';
import { Helmet } from 'react-helmet';
import { getRoomList } from '@/services/live';
import { usePageViewDataReport } from '@/common/hooks';
import FooterTabs from '@/components/FooterTabs';
import RenderJudge from '@/components/RenderJudge';
import Loading from '@/components/Loading';
import HeaderDownload from '@/components/HeaderDownload';
import TextDownload from '@/components/TextDownload';
import ListVideoCard from '@/components/ListVideoCard';
import Tabs from './components/Tabs';

import styles from './style/index.scss';

const HomePage = () => {
  const [liveTypeId, setLiveTypeId] = useSafeState();

  const { data = {}, loading } = useRequest(
    () => getRoomList({
      page: 1,
      size: 8,
      liveTypeId
    }),
    {
      refreshDeps: [liveTypeId]
    }
  );

  const pageTitle = '体育赛事直播-NBA直播间-美女直播-U球直播-U球体育';

  usePageViewDataReport('h5_1', { params: { event_value: '直播首页', page_title: pageTitle } });

  const list = data.rows || [];

  const tabList = [{
    label: '热门'
  }, {
    label: '足球',
    value: 1
  }, {
    label: '篮球',
    value: 2
  }];

  return (
    <div className={styles.container}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="keywords" content="体育赛事直播,NBA直播间,美女直播" />
      </Helmet>
      <HeaderDownload />
      <Tabs
        value={liveTypeId}
        list={tabList}
        onChange={setLiveTypeId}
      />
      <div className={styles.list}>
        <ListVideoCard list={list} />
        <TextDownload />
      </div>
      <FooterTabs isLive />
      <RenderJudge
        value={loading}
        active={(<Loading />)}
      />
    </div>
  );
};

export default HomePage;
