import React from 'react';
import { useRequest } from 'ahooks';
import { getLiveCategoryList } from '@/servers/live';
import { useLogin, usePageViewDataReport } from '@/utils/hooks';
import Header from '@/components/Header';
import Sidebar from './components/Sidebar';
import SubscribePage from './components/SubscribePage';
import AllPage from './components/AllPage';
import WrapperPage from './components/WrapperPage';

import styles from './style/index.scss';

const LivePage = ({ match }) => {
  const { type } = match.params;
  const { isLogin } = useLogin();

  usePageViewDataReport('web_1', { params: { event_value: '直播首页' } });

  const { data, loading } = useRequest(
    () => getLiveCategoryList().toPromise(),
    {
      initialData: []
    }
  );

  if (loading) return null;

  const requestList = data.map((row) => ({
    ...row,
    label: row.name,
    value: row.matchType,
    component: (<WrapperPage sportId={row.matchType} sportName={row.name} key={row.matchType} />)
  }));

  const subscribeObj = {
    label: '订阅',
    icon: 'follow',
    value: 'subscribe',
    component: (<SubscribePage key="subscribe" />)
  };

  const allObj = {
    label: '全部',
    icon: 'quanbu',
    value: 'all',
    component: (<AllPage key="all" />)
  };

  const list = [isLogin && subscribeObj, allObj].concat(requestList).filter(Boolean);
  const { component, value } = list.find(({ value: v }) => new RegExp(`^${v}$`).test(type)) || allObj;

  return (
    <>
      <Header isLive />
      <Sidebar list={list} value={value} />
      <main className={styles.container}>
        {component}
      </main>
    </>
  );
};

export default LivePage;
