import React from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import ZIndex from '@/components/ZIndex';
import useRouterStores from '@/store/getters/router';

import styles from './style.scss';

const FooterTabs = ({ isLive, isScore, isForecast, isDownload }) => {
  const { getConfig } = useRouterStores();
  const displayModule = getConfig?.displayModule || [];
  // 1直播 2赛程 3发现 4预测
  const showForecast = displayModule.find(({ id }) => id === 4);

  const list = [{
    label: '直播',
    url: '/',
    className: ClassNames(styles.item, styles.isLive, { [styles.isActive]: isLive })
  }, {
    label: '赛程',
    url: '/score',
    className: ClassNames(styles.item, styles.isScore, { [styles.isActive]: isScore })
  }, showForecast && {
    label: '预测',
    url: '/forecast',
    className: ClassNames(styles.item, styles.isForecast, { [styles.isActive]: isForecast })
  }, {
    label: 'APP下载',
    url: '/download',
    className: ClassNames(styles.item, styles.isDownload, { [styles.isActive]: isDownload })
  }].filter(Boolean);

  return (
    <ZIndex className={styles.container}>
      <div className={styles.wrapper}>
        {list.map((row, index) => {
          return (
            <Link to={row.url} className={row.className} key={index}>
              <div className={styles.icon} />
              <div className={styles.label}>{row.label}</div>
            </Link>
          );
        })}
      </div>
    </ZIndex>
  );
};

export default FooterTabs;
