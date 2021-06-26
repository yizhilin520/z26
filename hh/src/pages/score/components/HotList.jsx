import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import dayJs from 'dayjs';
import useSafeState from 'ahooks/lib/useSafeState';
import { useRequest } from 'ahooks';
import { empty } from '@/common/utils';
import { getHotMatchList } from '@/services/sports';
import EmptyData from '@/components/EmptyData';
import RenderJudge from '@/components/RenderJudge';
import Image from '@/components/Image';
import TextDownload from '@/components/TextDownload';
import DefaultFootballMatchImage from '@/assets/images/default_football_match_image.png';
import DefaultBasketballMatchImage from '@/assets/images/default_basketball_match_image.png';
import StatusTabs from './StatusTabs.jsx';
import styles from '../style/HotList.scss';

const HotList = ({ onLoading }) => {
  const { loading, data = [] } = useRequest(() => getHotMatchList());
  const [curTitle, setCurTitle] = useSafeState('全部');
  useEffect(() => {
    onLoading(loading);
  }, [loading]);

  const isSameDay = (list, index) => {
    if (index === 0) return true;
    const curMatchDate = dayJs(list[index][1]).format('YYMMDD');
    const preMatchDate = dayJs(list[index - 1][1]).format('YYMMDD');
    return curMatchDate === preMatchDate;
  };

  const isToday = (date) => {
    return dayJs().format('YYYYMMDD') === dayJs(date).format('YYYYMMDD');
  };

  const getWeekDay = (date) => {
    const index = dayJs(date).day();
    const arr = ['日', '一', '二', '三', '四', '五', '六'];
    return `星期${arr[index]}`;
  };

  const filterLeagueMatch = ({ title }) => {
    setCurTitle(title);
  };

  const showList = useMemo(() => {
    const arr = curTitle === '全部' ? data : data.filter((item) => item[4] === curTitle);
    return arr;
  }, [curTitle, data]);

  const hotTabs = [
    { title: '全部', value: 0 },
    { title: '西甲', value: 1 },
    { title: '中超', value: 2 },
    { title: 'CBA', value: 3 },
    { title: 'NBA', value: 4 },
  ];

  return (
    <div className={styles.hotContainer}>
      <StatusTabs
        tabs={hotTabs}
        onTabChange={filterLeagueMatch}
      />
      <div>
        <RenderJudge
          value={!loading && !showList.length}
          active={<EmptyData />}
          inactive={showList.map((row, index) => (
            <div key={row[0]} className={styles.matchItem}>
              <RenderJudge
                value={index === 0 || !isSameDay(showList, index)}
                active={
                  <div className={styles.matchDate}>{`${dayJs(row[1]).format('YYYY-MM-DD ')} ${getWeekDay(row[1])}`}</div>
                }
              />
              <Link className={styles.matchWrapper} to={`/score/detail/${row[0]}`}>
                <div className={styles.hotStatus}>
                  <RenderJudge
                    value={row[15] === 2}
                    active={<span className={styles.going}>进行中</span>}
                    inactive={<span>{isToday(row[1]) ? dayJs(row[1]).format('HH:mm') : dayJs(row[1]).format('MM-DD HH:mm')}</span>}
                  />
                  <span className={styles.leagueName}>{row[4]}</span>
                </div>
                <div className={styles.scoreInfo}>
                  <div className={styles.team}>
                    <Image src={row[18]} defaultImage={row[6] === 1 ? DefaultFootballMatchImage : DefaultBasketballMatchImage} />
                    <p className={styles.teamName}>{row[2]}</p>
                    <span>{row[15] === 2 || row[15] === 3 ? row[17][0] : '-'}</span>
                  </div>
                  <div className={styles.team}>
                    <Image src={row[19]} defaultImage={row[6] === 1 ? DefaultFootballMatchImage : DefaultBasketballMatchImage} />
                    <p className={styles.teamName}>{row[3]}</p>
                    <span>{row[15] === 2 || row[15] === 3 ? row[17][1] : '-'}</span>
                  </div>
                </div>
                <div className={ClassNames(styles.videoBox, { [styles.hasVideo]: row[11] === 1 })} />
              </Link>
            </div>
          ))}
        />
      </div>
      <TextDownload />
    </div>
  );
};

HotList.defaultProps = {
  onLoading: empty
};

export default HotList;
