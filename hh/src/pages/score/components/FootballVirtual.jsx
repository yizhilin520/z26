import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import dayJs from 'dayjs';
import { useVirtualList } from 'ahooks';
import { empty } from '@/common/utils';
import RenderJudge from '@/components/RenderJudge';
import TextDownload from '@/components/TextDownload';
import styles from '../style/FootballList.scss';

const FootballList = ({ listData, tabStatus }) => {
  const isSameDay = (arr, index) => {
    if (index === 0) return true;
    const curMatchDate = dayJs(arr[index][1]).format('YYMMDD');
    const preMatchDate = dayJs(arr[index - 1][1]).format('YYMMDD');
    return curMatchDate === preMatchDate;
  };

  const getWeekDay = (date) => {
    const index = dayJs(date).day();
    const arr = ['日', '一', '二', '三', '四', '五', '六'];
    return `星期${arr[index]}`;
  };

  const calcHeight = () => {
    const len = listData.length;
    if (len > 6) return '68vh';
    return `${(len * 67) + 31}px`;
  };

  const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(listData, {
    itemHeight: (i) => {
      if (i === 0) return 93;
      return isSameDay(listData, i) ? 67 : 93;
    }
  });

  useEffect(() => {
    scrollTo(0);
  }, [tabStatus]);

  return (
    <div {...containerProps} style={{ height: calcHeight(), overflow: 'auto' }}>
      <div {...wrapperProps}>
        {
          list.map(({ data: row }, index) => (
            <div key={row[0]} className={styles.matchItem}>
              <RenderJudge
                value={index === 0 || !isSameDay(list, index)}
                active={
                  <div className={styles.matchDate}>{`${dayJs(row[1]).format('YYYY-MM-DD ')} ${getWeekDay(row[1])}`}</div>
                }
              />
              <Link className={styles.matchWrapper} to={`/score/detail/${row[0]}`}>
                <div className={styles.matchTop}>
                  <div className={styles.leagueName} style={{ backgroundColor: row[5] }}>{row[4].slice(0, 4)}</div>
                  <div className={styles.matchTime}>{dayJs(row[1]).format('HH:mm')}</div>
                  <div className={styles.half}>{`半:${row[17][2] || 0}-${row[17][3] || 0}`}</div>
                  <div className={styles.corner}>{`角:${row[17][8] || 0}-${row[17][9] || 0}`}</div>
                  <div className={ClassNames({ [styles.isHot]: row[12] === 1 })} />
                </div>
                <div className={styles.matchBottom}>
                  <RenderJudge
                    value={tabStatus !== 3}
                    active={(<div className={styles.clock} />)}
                  />
                  <div className={styles.teamBox}>
                    <div className={styles.yellow}>{row[17][6]}</div>
                    <div className={ClassNames(styles.teamName, styles.hostName)}>{row[2]}</div>
                    <div className={styles.score}>{row[17][0] >= 0 ? row[17][0] : '-'}</div>
                    <RenderJudge
                      value={row[15] === 2}
                      active={(<div className={ClassNames(styles.matchStatus, styles.going)}>{Math.floor(row[14] / 60)}</div>)}
                      inactive={(<div className={styles.matchStatus}>{row[15] === 1 ? '未' : '完'}</div>)}
                    />
                    <div className={styles.score}>{row[17][1] >= 0 ? row[17][1] : '-'}</div>
                    <div className={styles.teamName}>{row[3]}</div>
                    <div className={styles.yellow}>{row[17][7]}</div>
                  </div>
                  <div className={ClassNames(styles.videoBox, { [styles.hasVideo]: row[11] === 1 })} />
                </div>
              </Link>
            </div>
          ))
        }
        <TextDownload />
      </div>
    </div>
  );
};

FootballList.defaultProps = {
  onLoading: empty
};

export default FootballList;
