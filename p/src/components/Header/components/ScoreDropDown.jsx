import React from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';

import Iconfont from '@/components/Iconfont';

import styles from '../style/ScoreDropDown.scss';

const ScoreDropDown = () => (
  <div className={styles.container}>
    <Link to="/score/football" className={ClassNames(styles.item, styles.football)}>
      <Iconfont className={styles.icon} name="zuqiu" />
      <span className={styles.label}>足球赛事</span>
    </Link>
    <Link to="/score/basketball" className={ClassNames(styles.item, styles.basketball)}>
      <Iconfont className={styles.icon} name="lanqiu" />
      <span className={styles.label}>篮球比赛</span>
    </Link>
    {/* <Link to="/score" className={ClassNames(styles.item, styles.game)}> */}
    {/*  <Iconfont className={styles.icon} name="game" /> */}
    {/*  <span className={styles.label}>电竞赛事</span> */}
    {/* </Link> */}
  </div>
);

export default ScoreDropDown;
