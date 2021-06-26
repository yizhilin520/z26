import React, { useState } from 'react';
import ClassNames from 'classnames';
import { useLogin } from '@/utils/hooks';
import { scoreSmallStatusFormat } from '@/utils/common';
import { time as timeFormat } from '@/utils/regular';
import { HttpCode } from '@/enums';
import { useSnackbar } from '@/plugins';
import { userReserves } from '@/servers/homeServer';
import { Link } from 'react-router-dom';
import Iconfont from '@/components/Iconfont';
import RenderJudge from '@/components/RenderJudge';
import Image from '@/components/Image';
import PlayingIcon from '@/assets/images/playing_icon.gif';
import DefaultFootballMatchImage from '@/assets/images/default_football_match_image.png';
import DefaultBasketballMatchImage from '@/assets/images/default_basketball_match_image.png';

import styles from '../style/MatchCard.scss';

const MatchCard = ({ data, className, style, reserve, onBook }) => {
  const [isReserve, setIsReserve] = useState(!!reserve);
  const { isLogin, login } = useLogin();
  const { homeTeamCurrentScore, awayTeamCurrentScore } = data.score || {};
  const { enqueueSnackbar } = useSnackbar();
  const DefaultMatchImage = data.eventType === 1 ? DefaultFootballMatchImage : DefaultBasketballMatchImage;
  // 赛事预定
  const onReservesHandle = async (flag) => {
    if (!isLogin) return login();

    const params = {
      matchId: data.eventId
    };
    if (!flag) params.cancel = 1;
    const { data: rData } = await userReserves(params).toPromise();
    const { msg, code } = rData || {};
    if (HttpCode.SUCCESS === code) {
      setIsReserve(flag);
      if (flag) {
        return onBook();
      }
      return enqueueSnackbar('取消预定成功');
    }

    return enqueueSnackbar(msg);
  };

  return (
    <div className={ClassNames(styles.container, className)} style={style}>
      <div className={styles.header}>
        <div className={ClassNames(styles.title, styles.headerItem)}>{data.leagueName}</div>
        <div className={ClassNames(styles.status, styles.headerItem)}>
          <RenderJudge
            value={data.bigState === 1 && data.startTime}
            active={timeFormat(data.startTime)}
            inactive={scoreSmallStatusFormat(data.smallState).label}
          />
        </div>
        <Link
          className={ClassNames(styles.link, styles.headerItem)}
          to={`/score/detail/${data.eventId}`}
          target="_blank"
        >
          <span>
            <RenderJudge
              value={data.bigState === 2}
              active="直播中"
              inactive="详情"
            />
          </span>
          <Iconfont name="bq_ee" style={{ fontSize: '12px' }} />
        </Link>
      </div>
      <div className={styles.content}>
        <div className={styles.name}>
          <Image
            className={styles.image}
            src={data.homeTeamLogo}
            defaultImage={DefaultMatchImage}
            alt={data.homeTeamName}
          />
          <div className={styles.label}>{data.homeTeamName}</div>
        </div>
        <div className={styles.score}>
          <div className={styles.scoreInner}>
            <div className={styles.scoreText}>
              <RenderJudge
                value={data.bigState === 2 || data.bigState === 3}
                active={`${homeTeamCurrentScore || 0}:${awayTeamCurrentScore || 0}`}
                inactive="VS"
              />
            </div>
          </div>
          <RenderJudge
            value={data.bigState === 2 && data.whetherToUseLiveVideo}
            active={(
              <Link
                className={ClassNames(styles.button, styles.isLive)}
                to={`/score/detail/${data.eventId}/live`}
              >
                <img className={styles.buttonIcon} src={PlayingIcon} alt="直播中" />
                <span className={styles.buttonLabel}>直播中</span>
              </Link>
            )}
            inactive={(
              <RenderJudge
                value={isReserve}
                active={(
                  <div className={ClassNames(styles.button, styles.isReserve, styles.isDisable)} onClick={() => onReservesHandle(false)}>
                    <span className={styles.buttonLabel}>已预定</span>
                  </div>
                )}
                inactive={(
                  <div className={ClassNames(styles.button, styles.isReserve)} onClick={() => onReservesHandle(true)}>
                    <Iconfont name="time" className={styles.buttonIcon} />
                    <span className={styles.buttonLabel}>预定</span>
                  </div>
                )}
              />
            )}
          />
        </div>
        <div className={styles.name}>
          <Image
            className={styles.image}
            src={data.awayTeamLogo}
            defaultImage={DefaultMatchImage}
            alt={data.awayTeamName}
          />
          <div className={styles.label}>{data.awayTeamName}</div>
        </div>
      </div>
    </div>
  );
};

MatchCard.defaultProps = {
  data: {},
  onBook: () => {}
};

export default MatchCard;
