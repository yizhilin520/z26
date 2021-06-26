import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import dayJs from 'dayjs';
import { useVirtualList } from 'ahooks';
import { empty, scoreStatusFormat, secondFormatter } from '@/common/utils';
import RenderJudge from '@/components/RenderJudge';
import TextDownload from '@/components/TextDownload';
import styles from '../style/BasketballList.scss';

const BasketballList = ({ listData, tabStatus }) => {
  const isSameDay = (list, index) => {
    if (index === 0) return true;
    const curMatchDate = dayJs(list[index][1]).format('YYMMDD');
    const preMatchDate = dayJs(list[index - 1][1]).format('YYMMDD');
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
    return `${(len * 83) + 31 + 40}px`;
  };

  const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(listData, {
    itemHeight: (i) => {
      if (i === 0) return 109;
      return isSameDay(listData, i) ? 83 : 114;
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
                value={index === 0 || !isSameDay(listData, index)}
                active={
                  <div className={styles.matchDate}>{`${dayJs(row[1]).format('YYYY-MM-DD ')} ${getWeekDay(row[1])}`}</div>
                }
              />
              <Link className={styles.matchWrapper} to={`/score/detail/${row[0]}`}>
                <div className={styles.matchTop}>
                  <div className={styles.leagueName} style={{ backgroundColor: row[5] }}>{row[4].slice(0, 4)}</div>
                  <div className={styles.matchTime}>{dayJs(row[1]).format('HH:mm')}</div>
                  <div className={styles.matchStatus}>
                    <span>{scoreStatusFormat(row[16])}</span>
                    <span>{row[14] > 0 ? secondFormatter(row[14]) : ''}</span>
                  </div>
                  <div className={ClassNames({ [styles.isHot]: row[12] === 1 })} />
                </div>
                <div className={styles.matchBottom}>
                  <div className={styles.clock} style={{ visibility: tabStatus !== 3 ? 'unset' : 'hidden' }} />
                  <div className={styles.teamName}>
                    <p>{row[2]}</p>
                    <p>{row[3]}</p>
                  </div>
                  <div className={styles.scoreBox}>
                    <div className={styles.teamScore}>
                      <RenderJudge
                        value={row[9] === 2}
                        active={(
                          <>
                            <span className={styles.rang} />
                            <span>{row[17][2] || 0}</span>
                            <span>{row[17][4] || 0}</span>
                            <span />
                            <span />
                          </>
                        )}
                        inactive={(
                          <>
                            <span className={styles.rang} />
                            <span>{row[17][2] || 0}</span>
                            <span>{row[17][4] || 0}</span>
                            <span>{row[17][6] || 0}</span>
                            <span>{row[17][8] || 0}</span>
                          </>
                        )}
                      />
                      <span className={styles.total}>{row[17][0]}</span>
                    </div>
                    <div className={styles.teamScore}>
                      <RenderJudge
                        value={row[9] === 2}
                        active={(
                          <>
                            <span className={styles.rang} />
                            <span>{row[17][3] || 0}</span>
                            <span>{row[17][5] || 0}</span>
                            <span />
                            <span />
                          </>
                        )}
                        inactive={(
                          <>
                            <span className={styles.rang} />
                            <span>{row[17][3] || 0}</span>
                            <span>{row[17][5] || 0}</span>
                            <span>{row[17][7] || 0}</span>
                            <span>{row[17][9] || 0}</span>
                          </>
                        )}
                      />
                      <span className={styles.total}>{row[17][1]}</span>
                    </div>
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

BasketballList.defaultProps = {
  onLoading: empty
};

export default BasketballList;
