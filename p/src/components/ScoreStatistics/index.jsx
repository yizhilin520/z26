import React from 'react';
import { useInterval, useRequest } from '@/utils/hooks';
import { getEventStatistics } from '@/servers/scoreServer';
import Image from '@/components/Image';

import DefaultFootballMatchImage from '@/assets/images/default_football_match_image.png';
import DefaultBasketballMatchImage from '@/assets/images/default_basketball_match_image.png';

import styles from './style.scss';

const getClass = (v) => {
  switch (v) {
    case 1:
      return styles.cellRow1;
    case 2:
      return styles.cellRow2;
    case 3:
      return styles.cellRow3;
    case 4:
      return styles.cellRow4;
    case 5:
      return styles.cellRow5;
    default:
      return styles.cellRow6;
  }
};

const images = [
  {
    label: '角球',
    key: 30,
    icon: 'jiao-qiu'
  },
  {
    label: '黄牌',
    key: 18,
    icon: 'huang'
  },
  {
    label: '红牌',
    key: 22,
    icon: 'hong-pai'
  },
  {
    label: '进球',
    key: 9,
    icon: 'jin-qiu'
  },
  {
    label: '点球 ',
    key: 8,
    icon: 'dian-qiu'
  },
  {
    label: '点失',
    key: 138,
    icon: 'dian-shi'
  },
  {
    label: '两黄变红',
    key: 21,
    icon: 'hong-huang'
  },
  {
    label: '换人',
    key: 23,
    icon: 'replacement'
  }
];

const getIcon = (item, data, type: number) => {
  const getAppRealtime = data;
  if (!getAppRealtime || getAppRealtime.length < 1) return '';
  const time = item[6];
  const object = data.find((d) => d[8] === `${time}'`);
  if (!object) return '';
  const play = object[9];
  const image = images.find((i) => i.key === play);
  if (!image) return '';
  if (object[5] == type) {
    return image.icon;
  }
  return '';
};

const Line = ({ styleIndex, items, textLive }) => {
  // 百分比
  const toPercent = (team, another) => `${Math.round(
    (Math.abs(team) / (Math.abs(team) + Math.abs(another))) * 10000
  ) / 100.0 || '10'}%`;

  return (
    <div className={`${styles.cell} ${getClass(styleIndex)}`}>
      <div className={styles.cellContent}>
        <div className={styles.cellTop}>
          {items.map((row, index: number) => {
            const item = row || [];
            return (
              <span
                key={index}
                className={styles.cellLine}
                style={{ height: `${toPercent(item[1], item[2])}` }}
              >
                <i
                  className={`${styles.icon} ${styles[getIcon(item, textLive, 1)]}`}
                />
              </span>
            );
          })}
        </div>
        <div className={styles.cellBottom}>
          <i />
          {items.map((row, index: number) => {
            const item = row || [];
            return (
              <span
                key={index}
                className={`${styles.cellLine} ${styles.cellYellow}`}
                style={{ height: `${toPercent(item[2], item[1])}` }}
              >
                <i
                  className={`${styles.icon} ${styles[getIcon(item, textLive, 2)]}`}
                />
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ScoreStatistics = ({ matchId, matchInfo, textLive }) => {
  const DefaultMatchImage = matchInfo.eventType === 1 ? DefaultFootballMatchImage : DefaultBasketballMatchImage;
  const { data = [], mutate } = useRequest(
    (q) => getEventStatistics(q).toPromise(),
    { match_id: matchId },
    (d) => {
      const eventStatistics = d || [];
      if (eventStatistics.length) {
        const num = Math.ceil(eventStatistics.length / 15);
        const arr = [];
        let i = 0;
        while (i < num) {
          arr.push(eventStatistics.slice(i * 15, (i + 1) * 15));
          ++i;
        }
        return arr;
      }

      return eventStatistics;
    },
    {
      useManual: true
    }
  );

  useInterval(() => mutate(), 60000, { immediate: true });

  return (
    <div className={styles.container}>
      <div className={styles.outsLeft}>
        <div className={styles.text}>
          <Image src={matchInfo.homeTeamLogo} defaultImage={DefaultMatchImage} />
          <span>{matchInfo.homeTeamName}</span>
        </div>
        <div className={styles.text}>
          <Image src={matchInfo.awayTeamLogo} defaultImage={DefaultMatchImage} />
          <span>{matchInfo.awayTeamName}</span>
        </div>
      </div>
      <div className={styles.outsRight}>
        {data.map((items, index) => <Line key={index} styleIndex={index + 1} items={items || []} textLive={textLive} />)}
        <div className={styles.tips}>
          <span>0'</span>
          <span>15'</span>
          <span>30'</span>
          <span>HT'</span>
          <span>60'</span>
          <span>70'</span>
          <span>90'</span>
        </div>
        <div className={`${styles.bg} ${styles.topbg}`} />
        <div className={`${styles.bg} ${styles.bottombg}`} />
        <div className={`${styles.bg} ${styles.bottombg} ${styles.bgline}`} />
        <div className={`${styles.bg} ${styles.topbg}`} />
      </div>
    </div>
  );
};

ScoreStatistics.defaultProps = {
  matchInfo: {},
  textLive: []
};

export default ScoreStatistics;
