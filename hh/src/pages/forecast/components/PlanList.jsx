import React, { useEffect } from 'react';
import ClassNames from 'classnames';
import dayJs from 'dayjs';
import { useRequest } from 'ahooks';
import { empty } from '@/common/utils';
import { timeFormat } from '@/common/format';
import { getExpertPlan } from '@/services/sports';
import EmptyData from '@/components/EmptyData';
import RenderJudge from '@/components/RenderJudge';
import Image from '@/components/Image';
import DefaultUserImage from '@/assets/images/default_user_image.png';
import DefaultFootballMatchImage from '@/assets/images/default_football_match_image.png';
import DefaultBasketballMatchImage from '@/assets/images/default_basketball_match_image.png';

import styles from '../style/PlanList.scss';

const PlanList = ({ onLoading, onClick }) => {
  const { loading, data = [] } = useRequest(() => getExpertPlan({ type: 1 }));

  useEffect(() => {
    onLoading(loading);
  }, [loading]);

  return (
    <RenderJudge
      value={!loading && !data.length}
      active={<EmptyData />}
      inactive={data.map((row, index) => (
        <div className={styles.container} key={index} onClick={onClick}>
          <div className={styles.userInfo}>
            <Image className={styles.image} src={row.picUrl} defaultImage={DefaultUserImage} />
            <div className={styles.content}>
              <div className={styles.name}>{row.name}</div>
              <div className={styles.meta}>
                <RenderJudge
                  value={row.redNum >= 3}
                  active={(
                    <div
                      className={ClassNames(styles.metaItem, styles.isRed)}
                    >
                      {`${row.redNum}连红`}
                    </div>
                  )}
                />
                <RenderJudge
                  value={row.numM >= 6}
                  active={(
                    <div
                      className={ClassNames(styles.metaItem, styles.isIn)}
                    >
                      {`近${row.numM}中${row.numN}`}
                    </div>
                  )}
                />
              </div>
            </div>
            <RenderJudge
              value={row.rate}
              active={(
                <div className={styles.result}>
                  <div className={styles.resultVal}>{`${row.rate}%`}</div>
                  <div className={styles.resultSummary}>{`近${row.numM}单命中`}</div>
                </div>
              )}
            />
          </div>
          <div className={styles.title}>{row.title}</div>
          {(row.expertTeams || []).map((subRow, subIndex) => (
            <div className={styles.planItem} key={subIndex}>
              <Image
                className={styles.planImage}
                src={subRow.leaguePic}
                defaultImage={subRow.sportType === 1 ? DefaultFootballMatchImage : DefaultBasketballMatchImage}
              />
              <div className={styles.planType}>{`【${subRow.leagueName}】`}</div>
              <div className={styles.matchTime}>{dayJs(subRow.matchTime).format('MM/DD HH:mm')}</div>
              <RenderJudge
                value={subRow.sportType === 1}
                active={(
                  <div className={styles.planName}>{`${subRow.homeTeamName} VS ${subRow.guestTeamName}`}</div>
                )}
                inactive={(
                  <div className={styles.planName}>
                    <span>{`${subRow.guestTeamName} VS ${subRow.homeTeamName}`}</span>
                    <small className={styles.mainText}>(主)</small>
                  </div>
                )}
              />
            </div>
          ))}
          <div className={styles.planMeta}>
            <div className={styles.lotteryName}>{row.lotteryClassName}</div>
            <div className={styles.publishTime}>{timeFormat(row.publishTime)}</div>
            <RenderJudge
              value={row.isFree}
              active={(<div className={styles.price}>免费</div>)}
              inactive={(
                <div className={styles.price}>
                  <span className={styles.priceVal}>{row.price}</span>
                  <span>金币</span>
                </div>
              )}
            />
          </div>
        </div>
      ))}
    />
  );
};

PlanList.defaultProps = {
  onLoading: empty,
  onClick: empty
};

export default PlanList;
