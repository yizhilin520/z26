import React from 'react';
import SideTools from '@/components/rightFix';
import Footer from '@/components/Footer';
import { usePageViewDataReport } from '@/utils/hooks';

import TopBanner from './components/TopBanner';
import HotMatchClassify from './components/HotMatchClassify';
import MatchClassify from './components/MatchClassify';
import AdClassify from './components/AdClassify';
import AnchorClassify from './components/AnchorClassify';

import styles from './style/index.scss';

import HitTitleIcon from './images/hit_title_icon.png';
import FootballTitleIcon from './images/football_title_icon.png';
import BasketballTitleIcon from './images/basketball_title_icon.png';
import GameTitleIcon from './images/game_title_icon.png';

const HomePage = () => {
  usePageViewDataReport('web_00', { params: { event_value: '首页' } });

  return (
    <main className={styles.container}>
      <TopBanner />
      <div className={styles.wrapper}>
        <HotMatchClassify />
        <MatchClassify image={HitTitleIcon} label="正在热播" liveType={[1, 2, 3]} />
        <AdClassify />
        <AnchorClassify />
        <MatchClassify image={FootballTitleIcon} label="足球热播" liveType={1} />
        <MatchClassify image={BasketballTitleIcon} label="篮球热播" liveType={2} />
        <MatchClassify image={GameTitleIcon} label="电竞热播" liveType={3} />
      </div>
      <SideTools />
      <Footer />
    </main>
  );
};

export default HomePage;
