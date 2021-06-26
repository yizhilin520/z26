import React from 'react';
import ClassNames from 'classnames';
import { Helmet } from 'react-helmet';
import { usePageViewDataReport } from '@/utils/hooks';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SideTools from '@/components/SideTools';
import RenderJudge from '@/components/RenderJudge';
import Provider from './components/Provider';
import Filter from './components/Filter';
import DateList from '../components/DateList';
import Loading from '../components/Loading';
import LeftSideTools from './components/LeftSideTools';
import HeaderRow from './components/HeaderRow';
import Container from './components/Container';
import { useStores } from './utils/store';

import styles from './style/index.scss';

const ScoreFootballMain = () => {
  const { status, state, methods } = useStores();
  const showDateList = status.sortType === 'finish' || status.sortType === 'schedule';
  const isReverse = status.sortType === 'finish';
  const isShowLeftTools = status.sortType === 'timely';
  const pageTitle = '足球比赛_即时比分数据-比赛频道-U球体育';

  const onDateChangeHandle = (v) => {
    if (state.query.date === v) return;

    return methods.getListData({ date: v });
  };

  usePageViewDataReport('web_2', { params: { event_value: '比分首页', page_title: pageTitle, sportType: 1 } });

  return (
    <main className={styles.container}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="keywords" content="足球比赛,足球比分,足球即时比分" />
        <meta name="description" content="U球体育：为广大球迷提供全球赛事直播，全球体育赛事比分数据实时更新，随时看比分快人一步。" />
      </Helmet>
      <div className={styles.header}>
        <Filter />
        <HeaderRow />
        <RenderJudge
          value={showDateList}
          active={(<DateList isReverse={isReverse} value={state.query.date} onChange={onDateChangeHandle} />)}
        />
      </div>
      <RenderJudge
        value={isShowLeftTools}
        active={(<LeftSideTools />)}
      />
      <div className={ClassNames(styles.wrapper, { [styles.isShowDateList]: showDateList })}>
        <RenderJudge
          value={status.loading}
          active={<Loading />}
          inactive={(<Container />)}
        />
      </div>
    </main>
  );
};

const ScoreFootballPage = () => (
  <Provider>
    <Header isScore />
    <ScoreFootballMain />
    <Footer />
    <SideTools backTop={false} />
  </Provider>
);

export default ScoreFootballPage;
