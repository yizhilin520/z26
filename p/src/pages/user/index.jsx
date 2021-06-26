import React from 'react';
import { useSelector } from 'react-redux';
import Header from '@/components/Header';
import SideTools from '@/components/SideTools';
import Footer from '@/components/Footer';
import ClassNames from 'classnames';
import { usePageViewDataReport } from '@/utils/hooks';
import LeftMenu from './components/LeftMenu';
import InfoPage from './components/InfoPage';
// import TaskPage from './components/TaskPage';
import FollowPage from './components/FollowPage';
import AssetsPage from './components/AssetsPage';
import IncomePage from './components/IncomePage';
import LivePage from './components/LivePage';
import FansPage from './components/FansPage';
import ForAnchorPage from './components/ForAnchorPage';
import NewsPage from './components/NewsPage';

import InfoIcon from './images/info_icon.png';
import FollowIcon from './images/follow_icon.png';
import AssetsIcon from './images/assets_icon.png';
import IncomeIcon from './images/income_icon.png';
import LiveIcon from './images/live_icon.png';
import FansIcon from './images/fans_icon.png';
// import GameIcon from "./images/game_icon.png";
import AnchorIcon from './images/anchor_icon.png';
import newsIcon from './images/news_icon.png';
import styles from './style/index.scss';

const UserPage = ({ match: { params: { type } } }) => {
  const { headImage, nickName, registerDay, roomId, levelId, hasStationMsg } = useSelector(
    ({ user }) => user.userInfo || {}
  );

  usePageViewDataReport('web_5', { params: { event_value: '个人中心' } });

  // 是否是主播
  const isAnchor = !!roomId;

  const infoObj = {
    label: '账号设置',
    icon: InfoIcon,
    value: 'info',
    component: <InfoPage />
  };

  // const taskObj = {
  //   label: '任务中心',
  //   icon: 'renwu',
  //   value: 'task',
  //   component: (<TaskPage />)
  // };

  const followObj = {
    label: '我的关注',
    icon: FollowIcon,
    value: 'follow',
    component: <FollowPage />
  };

  const assetsObj = {
    label: '我的资产',
    icon: AssetsIcon,
    value: 'assets',
    component: <AssetsPage />
  };

  const incomeObj = {
    label: '我的收益',
    icon: IncomeIcon,
    value: 'income',
    component: <IncomePage />
  };

  const liveObj = {
    label: '直播设置',
    icon: LiveIcon,
    value: 'live',
    component: <LivePage />
  };

  const audienceObj = {
    label: '房间管理',
    icon: FansIcon,
    value: 'fans',
    component: <FansPage />
  };
  const forAnchorObj = {
    label: '主播专用',
    icon: AnchorIcon,
    value: 'foranchor',
    component: <ForAnchorPage />
  };

  // const gameObj = {
  //   label: "直播游戏",
  //   icon: GameIcon,
  //   value: "game",
  //   component: <div>直播游戏</div>,
  // };

  const newsObj = {
    label: '我的消息',
    icon: newsIcon,
    value: 'news',
    component: <NewsPage />
  }

  const menus = [
    infoObj,
    followObj,
    // taskObj,
    assetsObj,
    isAnchor && liveObj,
    newsObj,
    isAnchor && incomeObj,
    isAnchor && audienceObj,
    // isAnchor && gameObj,
    isAnchor && forAnchorObj,
    
    
  ].filter(Boolean);

  const { component, value } = menus.find(({ value: v }) => v === type) || infoObj;


  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={ClassNames(styles.wrapper, 'module-section')}>
          <LeftMenu
            value={value}
            list={menus}
            userName={nickName}
            userImage={headImage}
            joinDay={registerDay || 0}
            isAnchor={isAnchor}
            levelId={levelId}
            hasStationMsg={hasStationMsg}
          />
          <div className={styles.main}>{component}</div>
        </div>
      </main>
      <SideTools />
      <Footer />
    </>
  );
};

export default UserPage;
