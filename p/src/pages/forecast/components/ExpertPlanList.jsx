import React from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import dayJs from 'dayjs';
import { empty } from '@/utils/common';
import RenderJudge from '@/components/RenderJudge';
import Iconfont from '@/components/Iconfont';
import NotData from '@/components/NotData';
import Image from '@/components/Image';
import UserDefaultImage from '@/assets/images/user_default_image.png';
import { timeFormat } from '../utils/format';
import Loading from './Loading';

import StatusRedImage from '../images/status_red_image.png';
import StatusBackImage from '../images/status_black_image.png';
import StatusWalkImage from '../images/status_walk_image.png';

import styles from '../style/ExpertPlanList.scss';

const ExpertPlanList = ({
  className,
  loading,
  list,
  onLinkChange,
  showUserInfo,
  showNotData,
  getLinkUrl,
  beforeChildren,
  children,
  target
}) => {
  // 状态图片
  const statusImageObj = { 1: StatusRedImage, 2: StatusBackImage, 4: StatusWalkImage };

  const content = (
    <div className={styles.wrapper}>
      <RenderJudge
        value={list.length}
        active={list.map((row, index) => {
          const statusImage = statusImageObj[row.hitStatus];
          const isAbsoluteStatusImage = !showUserInfo && statusImage;
          return (
            <div className={styles.item} key={index}>
              <RenderJudge
                value={showUserInfo}
                active={(
                  <div className={styles.userInfo}>
                    <Image
                      className={styles.image}
                      src={row.picUrl}
                      defaultImage={UserDefaultImage}
                    />
                    <div className={styles.content}>
                      <div className={styles.name}>{row.name}</div>
                      <div className={styles.meta}>
                        <RenderJudge
                          value={row.des}
                          active={(<div className={ClassNames(styles.metaItem, styles.isSummary)}>{row.des}</div>)}
                        />
                        <RenderJudge
                          value={row.numM >= 6}
                          active={(
                            <div
                              className={ClassNames(styles.metaItem, styles.isSuccess)}
                            >
                              {`近${row.numM}中${row.numN}`}
                            </div>
                          )}
                        />
                        <RenderJudge
                          value={row.redNum >= 3}
                          active={(
                            <div
                              className={ClassNames(styles.metaItem, styles.isWarning)}
                            >
                              {`${row.redNum}连红`}
                            </div>
                          )}
                        />
                      </div>
                    </div>
                    <RenderJudge
                      value={statusImage}
                      active={(<img className={styles.statusImage} src={statusImage} />)}
                    />
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
                )}
              />
              <div
                className={ClassNames(styles.title, { [styles.isPadding]: isAbsoluteStatusImage })}
              >
                {row.title || row.summary}
              </div>
              <RenderJudge
                value={isAbsoluteStatusImage}
                active={(
                  <img
                    className={ClassNames(styles.statusImage, styles.isAbsolute)}
                    src={statusImage}
                  />
                )}
              />
              {(row.expertTeams || row.planItems || []).map((subRow, subIndex) => (
                <div className={styles.planItem} key={subIndex}>
                  <div
                    className={styles.planType}
                  >
                    {`【${row.lotteryClassName}】${subRow.leagueName || subRow.tournamentName}`}
                  </div>
                  <RenderJudge
                    value={subRow.sportType === 1}
                    active={(
                      <div
                        className={styles.planName}
                      >
                        {`${subRow.homeTeamName} VS ${subRow.guestTeamName || subRow.awayTeamName}`}
                      </div>
                    )}
                    inactive={(
                      <div className={styles.planName}>
                        <span>{`${subRow.guestTeamName || subRow.awayTeamName} VS ${subRow.homeTeamName}`}</span>
                        <small className={styles.mainText}>(主)</small>
                      </div>
                    )}
                  />
                  <div className={styles.planDate}>{dayJs(subRow.matchTime).format('MM-DD')}</div>
                  <div className={styles.planTime}>{dayJs(subRow.matchTime).format('HH:mm')}</div>
                </div>
              ))}
              <div className={styles.publish}>
                <div className={styles.price}>{row.isFree ? '免费' : `${row.price}金币`}</div>
                <div className={styles.time}>{timeFormat(row.publishTime)}</div>
                <Link
                  className={styles.link}
                  to={getLinkUrl(row)}
                  onClick={(e) => onLinkChange(row, e)}
                  target={target}
                >
                  <span>查看</span>
                  <Iconfont name="bq_ee" className={styles.icon} />
                </Link>
              </div>
            </div>
          );
        })}
      />
      <RenderJudge
        value={!list.length && showNotData}
        active={<NotData style={{ padding: '40px 0' }} />}
      />
    </div>
  );

  return (
    <div className={ClassNames(styles.container, className)}>
      {beforeChildren}
      <RenderJudge
        value={loading}
        active={(<Loading />)}
        inactive={content}
      />
      {children}
    </div>
  );
};

ExpertPlanList.defaultProps = {
  list: [],
  showUserInfo: true,
  showNotData: true,
  onLinkChange: empty,
  getLinkUrl: ({ sportId, expertId, planId }) => `/forecast/detail/${sportId}/${expertId}/${planId}`
};

export default ExpertPlanList;
