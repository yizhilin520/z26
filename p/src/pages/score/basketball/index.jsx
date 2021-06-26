import React from 'react';
import { Helmet } from 'react-helmet';
import ClassNames from 'classnames';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SideTools from '@/components/SideTools';
import RenderJudge from '@/components/RenderJudge';
import { usePageViewDataReport } from '@/utils/hooks';
import TopFilter from './components/TopFilter';
import DateList from './components/DateList';
import LeftSideTool from './components/LeftSideTool';
import Container from './components/Container';
import Provider from './components/Provider';
import Loading from '../components/Loading';
import { useStores } from './utils/store';

import style from './styles/index.scss';

const Main = () => {
  const { loading, sortType, query } = useStores();
  const showDateList = sortType === 'finish' || sortType === 'schedule';
  const pageTitle = '篮球比赛_即时比分数据-比赛频道-U球体育';

  usePageViewDataReport('web_2', { params: { event_value: '比分首页', page_title: pageTitle, sportType: 2 } });

  return (
    <main className={style.container}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="keywords" content="篮球比赛,篮球比分,篮球即时比分" />
        <meta name="description" content="U球体育：为广大球迷提供全球赛事直播，全球体育赛事比分数据实时更新，随时看比分快人一步。" />
      </Helmet>
      <div className={style.header}>
        <TopFilter />
        <RenderJudge
          value={showDateList}
          active={(<DateList />)}
        />
      </div>
      <RenderJudge
        value={!query.status && sortType !== 'keep'}
        active={<LeftSideTool />}
      />
      <div className={ClassNames(style.list, { [style.isShowDateList]: showDateList })}>
        <RenderJudge
          value={loading}
          active={(<Loading />)}
          inactive={<Container />}
        />
      </div>
      <div className={style.summary}>说明：第一行为客场球队，第二行为主场球队。</div>
    </main>
  );
};

export default function ScoreBasketballPage() {
  return (
    <Provider>
      <Header isScore />
      <Main />
      <Footer />
      <SideTools backTop={false} />
    </Provider>
  );
}
