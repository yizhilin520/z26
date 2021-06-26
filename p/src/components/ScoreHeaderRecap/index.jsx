import React from 'react';
import ClassNames from 'classnames';
import dayJs from 'dayjs';
import { scoreSmallStatusFormat } from '@/utils/common';
import { usePersistFn, useSafeState } from '@/utils/hooks';
import Image from '@/components/Image';
import RenderJudge from '@/components/RenderJudge';
import WebsocketPush from '@/components/WebsocketPush';

import DefaultFootballMatchImage from '@/assets/images/default_football_match_image.png';
import DefaultBasketballMatchImage from '@/assets/images/default_basketball_match_image.png';

import styles from './style.scss';

const bigStatusObj = {
  1: '未开始',
  2: '进行中',
  3: '完场',
  4: '异常'
};

const ScoreHeaderRecap = ({ data: matchInfo, useTimelyPush }) => {
  const [data, setData] = useSafeState(matchInfo);
  const matchTime = data.startTime && dayJs(data.startTime).format('YYYY-MM-DD HH:mm:ss');
  const smallStatusText = scoreSmallStatusFormat(data.smallState).label;
  const DefaultMatchImage = matchInfo.eventType === 1 ? DefaultFootballMatchImage : DefaultBasketballMatchImage;

  const scoreHandle = usePersistFn((d) => {
    // [赛事ID,主队全场得分,客队全场得分,主队第1节得分,客队第1节得分,主队第2节得分
    // ,客队第2节得分,主队第3节得分,客队第3节得分,主队第4节得分,客队第4节得分,主队第加时得分,客队加时得分]
    const [
      eventId,
      homeTeamCurrentScore,
      awayTeamCurrentScore,
      homeTeamScoredInTheFirstQuarter,
      awayTeamScoredInTheFirstQuarter,
      homeTeamScoredTheSecondQuarter,
      awayTeamScoredTheSecondQuarter,
      homeTeamScoreInTheThirdQuarter,
      awayTeamScoredTheThirdQuarter,
      homeTeamScoredTheFourthQuarter,
      awayTeamScoredInTheFourthQuarter,
      homeTeamOvertimeScore,
      awayTeamOvertimeScore
    ] = d;
    setData({
      ...data,
      score: {
        homeTeamCurrentScore,
        awayTeamCurrentScore,
        homeTeamScoredInTheFirstQuarter,
        awayTeamScoredInTheFirstQuarter,
        homeTeamScoredTheSecondQuarter,
        awayTeamScoredTheSecondQuarter,
        homeTeamScoreInTheThirdQuarter,
        awayTeamScoredTheThirdQuarter,
        homeTeamScoredTheFourthQuarter,
        awayTeamScoredInTheFourthQuarter,
        homeTeamOvertimeScore,
        awayTeamOvertimeScore
      }
    });
  });

  const statusHandle = usePersistFn((d) => {
    // [赛事ID,赛事大状态,赛事小状态]
    const [
      eventId,
      bigState,
      smallState
    ] = d;
    setData({
      ...data,
      bigState,
      smallState
    });
  });

  // 消息回调
  const onWebsocketMessageHandle = usePersistFn((res) => {
    const { type, data: msgData } = res;
    if (type === 'score') return scoreHandle(msgData);
    if (type === 'status') return statusHandle(msgData);
  });

  return (
    <div className={styles.container}>
      <RenderJudge
        value={useTimelyPush}
        active={(
          <WebsocketPush path={`/bf/detail/${data.eventType}/${data.eventId}`} on={{ message: onWebsocketMessageHandle }} />
        )}
      />
      <div className={styles.wrapper}>
        <div className={ClassNames(styles.item, styles.isLeft)}>
          <Image className={styles.logo} src={data.homeTeamLogo} defaultImage={DefaultMatchImage} />
          <div className={styles.name}>{data.homeTeamName}</div>
          <div className={styles.score}>{data.score?.homeTeamCurrentScore}</div>
        </div>
        <div className={ClassNames(styles.item, styles.isCenter)}>
          <div className={styles.infos}>
            <div className={styles.bigStatus}>{bigStatusObj[data.bigState]}</div>
            <RenderJudge
              value={matchTime}
              active={(
                <div className={styles.text}>{`${data.leagueName} ${matchTime}`}</div>
              )}
              inactive={<div className={styles.text}>{data.leagueName}</div>}
            />
            <div className={styles.smallStatus}>
              {`${smallStatusText}：${data.score?.homeTeamCurrentScore || 0}-${data.score?.awayTeamCurrentScore || 0}`}
            </div>
          </div>
        </div>
        <div className={ClassNames(styles.item, styles.isRight)}>
          <div className={styles.score}>{data.score?.awayTeamCurrentScore}</div>
          <div className={styles.name}>{data.awayTeamName}</div>
          <Image className={styles.logo} src={data.awayTeamLogo} defaultImage={DefaultMatchImage} />
        </div>
      </div>
    </div>
  );
};

ScoreHeaderRecap.defaultProps = {
  data: {},
  useTimelyPush: true
};

export default ScoreHeaderRecap;
