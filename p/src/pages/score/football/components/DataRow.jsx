import React from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import dayJs from 'dayjs';
import Tooltip from '@material-ui/core/Tooltip';
import { scoreSmallStatusFormat } from '@/utils/common';
import RenderJudge from '@/components/RenderJudge';
import Iconfont from '@/components/Iconfont';
import Row from './Row';
import Checkbox from '../../components/Checkbox';
import { useStores } from '../utils/store';

import styles from '../style/DataRow.scss';

const playedTime = (data) => {
  const statusCode = Number(data.smallState);
  const timePlayed = data.gameTime;
  const status = data.bigState;
  const { label, disable } = scoreSmallStatusFormat(statusCode);
  if (disable || statusCode === 100) return label;

  let ret = timePlayed || 1;
  if (statusCode === 20 || statusCode === 21 || statusCode === 22) {
    ret = '加';
  } else if (statusCode === 25) {
    ret = '点';
  } else if (statusCode === 31) {
    ret = '中';
  } else if (timePlayed) {
    const timeCeil = Math.ceil(timePlayed / 60);
    if (timeCeil) ret = timeCeil;
    if (status === 2) {
      if (statusCode === 1 && timeCeil > 45) ret = '45+';
      if (statusCode === 2 && timeCeil > 90) ret = '90+';
    }
  }
  return ret;
};

const DataRow = ({ style, data }) => {
  const { status: { scoreSwitch }, state, methods } = useStores();
  const { eventId, bigState } = data;
  // 比分
  const scoreData = data.score || {};
  // 指数
  const indexData = data.exponent || {};
  // 是否选中
  const hasSelected = state.selectObject.has(eventId);
  // 选择
  const onSelectChangeHandle = () => methods.setSelect(eventId);
  // 是否置顶
  const isTopStatus = state.topObject.has(eventId);
  // 设置置顶
  const onSetTopHandle = () => (isTopStatus ? methods.removeTop(eventId) : methods.addTop(eventId));
  // 是否关注
  const isKeepStatus = state.keepObject.has(eventId);
  // 设置关注
  const onSetKeepHandle = () => (isKeepStatus ? methods.cancelKeep(eventId) : methods.setKeep(eventId));
  // 获取默认字符串
  const getDefaultStr = (v, def) => {
    if (v) return v;
    if (bigState === 2 || bigState === 3) return 0;
    if (typeof def === 'undefined') return '-';
    return def;
  };

  return (
    <Row
      style={style}
      select={(<Checkbox value={hasSelected} onChange={onSelectChangeHandle} />)}
      leagueName={(
        <Tooltip title={data.leagueName} placement="top" arrow>
          <div className={styles.leagueName} style={{ backgroundColor: data.leagueColors || '#E04B4A' }}>
            <div className={styles.leagueNameText}>{data.leagueName}</div>
          </div>
        </Tooltip>
      )}
      matchTime={dayJs(data.startTime).format('HH:mm')}
      status={(
        <>
          <span className={ClassNames(styles.statusText, { [styles.isDisable]: data.bigState !== 2 })}>
            {playedTime(data)}
          </span>
          <RenderJudge
            value={data.bigState === 2}
            active={(<span className={styles.statusAni}>&apos;</span>)}
          />
        </>
      )}
      homeTeamName={(
        <>
          <RenderJudge
            value={scoreData.homeTeamYellowCard}
            active={(
              <div className={ClassNames(styles.board, styles.isYellow)}>{scoreData.homeTeamYellowCard}</div>
            )}
          />
          <RenderJudge
            value={scoreData.homeTeamRedCard}
            active={(
              <div className={ClassNames(styles.board, styles.isRed)}>{scoreData.homeTeamRedCard}</div>
            )}
          />
          <div className={styles.teamText}>{data.homeTeamName}</div>
        </>
      )}
      score={(
        <>
          <span>{getDefaultStr(scoreData.homeTeamCurrentScore, '')}</span>
          <span>-</span>
          <span>{getDefaultStr(scoreData.awayTeamCurrentScore, '')}</span>
        </>
      )}
      awayTeamName={(
        <>
          <div className={styles.teamText}>{data.awayTeamName}</div>
          <RenderJudge
            value={scoreData.awayRedCard}
            active={(
              <div className={ClassNames(styles.board, styles.isRed)}>{scoreData.awayRedCard}</div>
            )}
          />
          <RenderJudge
            value={scoreData.awayTeamYellowCard}
            active={(
              <div className={ClassNames(styles.board, styles.isYellow)}>{scoreData.awayTeamYellowCard}</div>
            )}
          />
        </>
      )}
      half={`${getDefaultStr(scoreData.homeTeamHalfScore, '')} - ${getDefaultStr(scoreData.awayTeamHalfScore, '')}`}
      corner={`${getDefaultStr(scoreData.homeTeamCornerKick, '')} - ${getDefaultStr(scoreData.awayTeamCornerKick, '')}`}
      live={(
        <Link to={`/score/detail/${data.eventId}/live`} target="_blank">
          <RenderJudge
            value={data.whetherToUseLiveVideo}
            active={<Iconfont name="video" className={styles.liveImage} />}
            inactive={<Iconfont name="animated" className={styles.liveImage} />}
          />
        </Link>
      )}
      odds={(
        <>
          <RenderJudge
            value={scoreSwitch.asia}
            active={(
              <div className={styles.oddWrapper}>
                <div className={styles.oddItem}>{indexData.homeTeamOdds || '-'}</div>
                <div className={styles.oddItem}>{indexData.asianHandicap || '-'}</div>
                <div className={styles.oddItem}>{indexData.awayTeamOdds || '-'}</div>
              </div>
            )}
          />
          <RenderJudge
            value={scoreSwitch.size}
            active={(
              <div className={styles.oddWrapper}>
                <div className={styles.oddItem}>{indexData.bigOdds || '-'}</div>
                <div className={styles.oddItem}>{indexData.sizeIndex || '-'}</div>
                <div className={styles.oddItem}>{indexData.smallOdds || '-'}</div>
              </div>
            )}
          />
          <RenderJudge
            value={scoreSwitch.europe}
            active={(
              <div className={styles.oddWrapper}>
                <div className={styles.oddItem}>{indexData.homeBidder || '-'}</div>
                <div className={styles.oddItem}>{indexData.standardAnd || '-'}</div>
                <div className={styles.oddItem}>{indexData.awayBidder || '-'}</div>
              </div>
            )}
          />
        </>
      )}
      index={(
        <Link to={`/score/detail/${data.eventId}/european`} target="_blank" className={styles.indexText}>指数</Link>
      )}
      handle={(
        <>
          <div
            className={ClassNames(styles.handle, styles.isTop, { [styles.isActive]: isTopStatus })}
            onClick={onSetTopHandle}
          />
          <div
            className={ClassNames(styles.handle, styles.isFollow, { [styles.isActive]: isKeepStatus })}
            onClick={onSetKeepHandle}
          />
        </>
      )}
    />
  );
};
DataRow.defaultProps = {
  data: {}
};
export default DataRow;
