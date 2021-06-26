import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ClassNames from 'classnames';
import dayJs from 'dayjs';
import { useRequest } from 'ahooks';
import { getLive365List } from '@/services/sports';
import { scoreSmallStatusFormat } from '@/common/format';
import LivePlayer from '@/components/LivePlayer';
import RenderJudge from '@/components/RenderJudge';
import Image from '@/components/Image';
import Iconfont from '@/components/Iconfont';
import ActionSheet from '@/components/ActionSheet';

import DefaultFootballMatchImage from '@/assets/images/default_football_match_image.png';
import DefaultBasketballMatchImage from '@/assets/images/default_basketball_match_image.png';

import styles from '../style/HeaderMatchInfo.scss';

const HeaderMatchInfo = ({ data }) => {
  const history = useHistory();
  const [matchId, startTime, homeTeamName, awayTeamName, leagueName, , sportType, , , , , isHasVideo, , , , bigState, smallState, score, homeTeamLogo, awayTeamLogo] = data;
  const [homeTeamScore, awayTeamScore] = score || [];
  const [showPlayer, setShowPlayer] = useState(false);
  const [playAddr, setPlayAddr] = useState([]);
  const playerRef = useRef();
  const actionSheetRef = useRef();

  // 是否显示视频视图
  const isShowVideoView = isHasVideo && bigState === 2;

  const { data: liveData } = useRequest(
    () => getLive365List({ match_id: matchId }),
    {
      initialData: [],
      ready: isShowVideoView
    }
  );

  const live365List = liveData.map((row) => {
    const [, playFlvUrl, clarity, , name, playHlsUrl] = row || [];
    const playUrl = playHlsUrl || playFlvUrl;

    return {
      name: name || clarity,
      playUrl,
      protocolType: playUrl.substr(playUrl.lastIndexOf('.') + 1)
    };
  });

  // 选择回调
  const onSelectChangeHandle = (d) => {
    setPlayAddr([d]);
    return setShowPlayer(true);
  };
  // 点击视频
  const onSelectVideoHandle = () => {
    if (live365List.length > 1) return actionSheetRef.current.open({ list: live365List });

    return onSelectChangeHandle(live365List[0]);
  };

  // 返回到比赛详情
  const onBackMatchInfo = () => {
    if (!showPlayer) return history.goBack();

    setShowPlayer(false);
    return playerRef.current.destroy();
  };

  useEffect(() => {
    if (playerRef.current)playerRef.current.create();
  }, [playAddr, playerRef]);

  // 默认logo
  const defaultLogo = sportType === 1 ? DefaultFootballMatchImage : DefaultBasketballMatchImage;

  return (
    <>
      <RenderJudge
        value={isShowVideoView}
        active={(
          <LivePlayer data={playAddr || []} ref={playerRef}>
            <LivePlayer.StatusRecommend sportId={sportType} status={1} />
          </LivePlayer>
        )}
      />
      <RenderJudge
        value={showPlayer}
        inactive={(
          <div
            className={ClassNames(styles.container, {
              [styles.isFootball]: sportType === 1,
              [styles.isBasketball]: sportType === 2
            })}
          >
            <div className={styles.leagueName}>{leagueName}</div>
            <div className={styles.matchTime}>{dayJs(startTime).format('YYYY/MM/DD HH:mm')}</div>
            <div className={styles.matchContent}>
              <div className={styles.info}>
                <Image
                  className={styles.matchLogo}
                  src={homeTeamLogo}
                  defaultImage={defaultLogo}
                />
                <div className={styles.matchName}>{homeTeamName}</div>
              </div>
              <div className={styles.score}>
                <div className={styles.smallStatus}>{scoreSmallStatusFormat(smallState).label}</div>
                <div className={styles.scoreText}>{`${homeTeamScore || 0} - ${awayTeamScore || 0}`}</div>
              </div>
              <div className={styles.info}>
                <Image
                  className={styles.matchLogo}
                  src={awayTeamLogo}
                  defaultImage={defaultLogo}
                />
                <div className={styles.matchName}>{awayTeamName}</div>
              </div>
            </div>
            <div className={styles.buttons}>
              <RenderJudge
                value={isShowVideoView}
                active={(
                  <div className={ClassNames(styles.btn, styles.isVideo)} onClick={onSelectVideoHandle}>视频直播</div>
                )}
              />
            </div>
          </div>
        )}
      />
      <Iconfont className={styles.back} tag="div" name="bp_ee" onClick={onBackMatchInfo} />
      <ActionSheet ref={actionSheetRef} props={{ label: 'name' }} onChange={onSelectChangeHandle} />
    </>
  );
};

export default HeaderMatchInfo;
