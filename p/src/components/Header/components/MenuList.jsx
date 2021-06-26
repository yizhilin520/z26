import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ClassNames from 'classnames';
import RenderJudge from '@/components/RenderJudge';
import Iconfont from '@/components/Iconfont';
import HotIcon from '@/assets/images/header/hot-icon.png';
import ScoreDropDown from './ScoreDropDown';
import LiveDropDown from './LiveDropDown';
import { useStores } from '../utils/store';

import styles from '../style/MenuList.scss';

const MenuList = () => {
  const { expert } = useSelector(({ config }) => config.globalSwitch);
  const { state: { theme, isHome, isLive, isScore, isForecast } } = useStores();

  const list = [{
    label: '首页',
    path: '/',
    active: isHome
  }, {
    label: '直播',
    path: '/live/list',
    isHot: true,
    children: (<LiveDropDown />),
    active: isLive
  }, {
    label: '比赛',
    path: '/score/football',
    children: (<ScoreDropDown />),
    active: isScore
  }, expert && {
    label: '预测',
    path: '/forecast',
    active: isForecast
  }].filter(Boolean);

  return (
    <div className={styles.container}>
      {list.map((row, index) => (
        <div className={ClassNames(styles.item, styles[theme], { [styles.isActive]: row.active })} key={index}>
          <Link
            className={styles.link}
            to={row.path}
          >
            <span>{row.label}</span>
            <RenderJudge
              value={row.children}
              active={<Iconfont name="xiala" className={ClassNames(styles.moreIcon)} />}
            />
            <RenderJudge
              value={row.isHot}
              active={<img className={styles.hotImage} src={HotIcon} alt={row.label} />}
            />
          </Link>
          <RenderJudge
            value={row.children}
            active={(
              <div className={styles.subNav}>
                <div className={styles.subWrapper}>{row.children}</div>
              </div>
            )}
          />
        </div>
      ))}
    </div>
  );
};

export default MenuList;
