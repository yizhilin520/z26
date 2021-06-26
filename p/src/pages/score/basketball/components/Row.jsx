import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ClassNames from 'classnames';
import dayJs from 'dayjs';
import { useSafeState } from '@/utils/hooks';
import { usePrevious, useTimeout, useUpdateLayoutEffect } from 'ahooks';
import Tooltip from '@material-ui/core/Tooltip';
import RenderJudge from '@/components/RenderJudge';
import Iconfont from '@/components/Iconfont';
import { secondFormatter } from '@/utils/common';
import Checkbox from '../../components/Checkbox';
import { smallStatusFormatter } from '../utils/common';

import { useStores } from '../utils/store';

import style from '../styles/Row.scss';
import styleBorder from '../styles/Border.scss';

const Row = ({ data, showHandle, style: componentStyle }) => {
  const { zhishu } = useSelector(({ config }) => config.globalSwitch);

  const {
    eventId,
    leagueName,
    leagueColors,
    score,
    awayTeamName,
    homeTeamName,
    startTime,
    exponent,
    whetherToUseLiveVideo,
    bigState,
    smallState,
    gameTime
  } = data;

  const {
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
  } = score;

  const {
    homeBidder,
    awayBidder,

    awayTeamOdds,
    homeTeamOdds,
    asianHandicap,
    asianHandicapInChinese,

    bigOdds,
    smallOdds,
    sizeIndex,
    sizeIndicatorInChinese
  } = exponent;

  const preHomeTeamCurrentScore = usePrevious(homeTeamCurrentScore);
  const preAwayTeamCurrentScore = usePrevious(awayTeamCurrentScore);
  const { keepObject, topObject, selectObject, setSelect, setKeep, cancelKeep, setTop } = useStores();
  // 主 是否显示动画背景
  const [homeShowAnimation, setHomeShowAnimation] = useSafeState(false);
  // 客 是否显示动画背景
  const [guestShowAnimation, setGuestShowAnimation] = useSafeState(false);
  const isSelect = selectObject[eventId];
  const isKeep = keepObject[eventId];
  const isTop = topObject[eventId];
  const isNcaaLeague = leagueName === 'NCAA';

  // 设置 主 动画
  useUpdateLayoutEffect(() => {
    if (homeTeamCurrentScore > preHomeTeamCurrentScore) setHomeShowAnimation(true);
  }, [homeTeamCurrentScore]);
  useTimeout(() => setHomeShowAnimation(false), homeShowAnimation ? 5000 : null);

  // 设置 客 动画
  useUpdateLayoutEffect(() => {
    if (awayTeamCurrentScore > preAwayTeamCurrentScore) setGuestShowAnimation(true);
  }, [awayTeamCurrentScore]);
  useTimeout(() => setGuestShowAnimation(false), guestShowAnimation ? 5000 : null);

  // 设置置顶
  const onSetTopHandle = () => {
    setTop(eventId);
  };
  // 设置收藏
  const onSetKeepHandle = () => {
    if (keepObject[eventId]) {
      cancelKeep(eventId);
    } else {
      setKeep(eventId);
    }
  };
  // 选择/不选择
  const onSelectHandle = () => {
    setSelect(eventId);
  };

  const homeFirstQuarter = homeTeamScoredInTheFirstQuarter || 0;
  const homeSecondQuarter = homeTeamScoredTheSecondQuarter || 0;
  const homeThirdQuarter = homeTeamScoreInTheThirdQuarter || 0;
  const homeFourQuarter = homeTeamScoredTheFourthQuarter || 0;

  const guestFirstQuarter = awayTeamScoredInTheFirstQuarter || 0;
  const guestSecondQuarter = awayTeamScoredTheSecondQuarter || 0;
  const guestThirdQuarter = awayTeamScoredTheThirdQuarter || 0;
  const guestFourQuarter = awayTeamScoredInTheFourthQuarter || 0;
  // 上半场总分
  const homePreAllScore = homeFirstQuarter + (isNcaaLeague ? 0 : homeSecondQuarter);
  const guestPreAllScore = guestFirstQuarter + (isNcaaLeague ? 0 : guestSecondQuarter);
  // 下半场总分
  const homeNextAllScore = isNcaaLeague ? homeSecondQuarter : (homeThirdQuarter + homeFourQuarter);
  const guestNextAllScore = isNcaaLeague ? guestSecondQuarter : (guestThirdQuarter + guestFourQuarter);
  // 比赛时间
  const startTimeArr = startTime ? [
    dayJs(startTime).format('MM-DD'),
    dayJs(startTime).format('HH:mm')
  ] : [];

  // 小状态格式化
  const smallStatusObj = smallStatusFormatter(smallState, isNcaaLeague);

  // 比分组件
  const ScoreItem = ({ isHeader, isHome, isGuest }) => {
    const baseArr = ['1', '2', '3', '4'];
    const upDownArr = ['上', '下'];
    const headerArr = (isNcaaLeague ? upDownArr : baseArr).concat(['加时']);
    const homeArr = isNcaaLeague ? [
      homeTeamScoredInTheFirstQuarter,
      homeTeamScoreInTheThirdQuarter,
      homeTeamOvertimeScore
    ] : [
      homeTeamScoredInTheFirstQuarter,
      homeTeamScoredTheSecondQuarter,
      homeTeamScoreInTheThirdQuarter,
      homeTeamScoredTheFourthQuarter,
      homeTeamOvertimeScore
    ];
    const awayArr = isNcaaLeague ? [
      awayTeamScoredInTheFirstQuarter,
      awayTeamScoredTheThirdQuarter,
      awayTeamOvertimeScore
    ] : [
      awayTeamScoredInTheFirstQuarter,
      awayTeamScoredTheSecondQuarter,
      awayTeamScoredTheThirdQuarter,
      awayTeamScoredInTheFourthQuarter,
      awayTeamOvertimeScore
    ];

    let totalArr = (isNcaaLeague ? [
      homeTeamScoredInTheFirstQuarter || awayTeamScoredInTheFirstQuarter,
      homeTeamScoreInTheThirdQuarter || awayTeamScoredTheThirdQuarter,
      homeTeamOvertimeScore || awayTeamOvertimeScore
    ] : [
      homeTeamScoredInTheFirstQuarter || awayTeamScoredInTheFirstQuarter,
      homeTeamScoredTheSecondQuarter || awayTeamScoredTheSecondQuarter,
      homeTeamScoreInTheThirdQuarter || awayTeamScoredTheThirdQuarter,
      homeTeamScoredTheFourthQuarter || awayTeamScoredInTheFourthQuarter,
      homeTeamOvertimeScore || awayTeamOvertimeScore
    ]).filter((row) => row !== null);

    if (isNcaaLeague) {
      if (!totalArr.length) totalArr = upDownArr;
    } else if (bigState === 1) {
      // 未开始
      totalArr = baseArr;
    }

    if (isHeader) {
      if (totalArr.length === 2) {
        return upDownArr.map((row, index) => (
          <span className={style.lessonItem} key={index}>{headerArr[index]}</span>
        ));
      }
      return totalArr.map((row, index) => (
        <span className={style.lessonItem} key={index}>{headerArr[index]}</span>
      ));
    }
    if (isHome) {
      return totalArr.map((row, index) => (
        <span className={style.lessonItem} key={index}>{homeArr[index] || '-'}</span>
      ));
    }
    if (isGuest) {
      return totalArr.map((row, index) => (
        <span className={style.lessonItem} key={index}>{awayArr[index] || '-'}</span>
      ));
    }

    return [];
  };

  // 超链接组件
  const ScoreLink = ({ page, children, ...props }) => (
    <Link
      to={`/score/detail/${eventId}/${page}`}
      target="_blank"
      {...props}
    >
      {children}
    </Link>
  );

  return (
    <div className={style.container} style={componentStyle}>
      <div className={ClassNames(style.item, styleBorder.borderTop, style.isHeader)}>
        <div className={ClassNames(style.cell, style.league, styleBorder.borderRight)}>
          <Tooltip title={leagueName} placement="top" arrow>
            <div className={style.leagueText} style={{ backgroundColor: leagueColors || '#E04B4A' }}>{leagueName}</div>
          </Tooltip>
        </div>
        <div className={ClassNames(style.cell, style.name)}>
          <RenderJudge
            value={smallStatusObj.image}
            active={<img src={smallStatusObj.image} className={style.nameImage} />}
          />
          <span
            className={ClassNames(style.nameStatus, { [style.isDisabled]: !smallStatusObj.image })}
          >
            {smallStatusObj.label}
          </span>
          <RenderJudge
            value={gameTime}
            active={<span className={style.nameTime}>{secondFormatter(gameTime)}</span>}
          />
        </div>
        <div className={ClassNames(style.cell, style.lesson)}>
          <ScoreItem isHeader />
        </div>
        <div className={ClassNames(style.cell, style.upDown)}>上/下</div>
        <div className={ClassNames(style.cell, style.all)}>全场</div>
        <div className={ClassNames(style.cell, style.diff)}>分差</div>
        <div className={ClassNames(style.cell, style.total)}>总分</div>
        <RenderJudge
          value={zhishu}
          active={(
            <div className={ClassNames(style.cell, style.pay)}>欧</div>
          )}
        />
        <RenderJudge
          value={zhishu}
          active={(
            <div className={ClassNames(style.cell, style.rangScore)}>让</div>
          )}
        />
        <RenderJudge
          value={zhishu}
          active={(
            <div className={ClassNames(style.cell, style.bigSmall)}>总分</div>
          )}
        />
        <RenderJudge
          value={zhishu}
          active={(
            <div className={ClassNames(style.cell, style.analyze)}>数据</div>
          )}
        />
        <div className={ClassNames(style.cell, style.live)}>直播</div>
        <RenderJudge
          value={showHandle}
          active={<div className={ClassNames(style.cell, style.handle)}>功能</div>}
        />
      </div>
      <div className={ClassNames(style.item, styleBorder.borderTop)}>
        <div className={ClassNames(style.cell, style.league, styleBorder.borderRight)} />
        <div className={ClassNames(style.cell, style.name, styleBorder.borderRight)}>
          <div className={style.nameText}>{awayTeamName}</div>
        </div>
        <div className={ClassNames(style.cell, style.lesson, styleBorder.borderRight)}>
          <ScoreItem isGuest />
        </div>
        <div
          className={ClassNames(style.cell, style.upDown)}
        >
          {`${guestPreAllScore || '-'}/${(guestNextAllScore) || '-'}`}
        </div>
        <div className={ClassNames(style.cell, style.all)}>
          <RenderJudge
            value={guestShowAnimation}
            active={<div className={style.goalAnimation} />}
          />
          <div className={style.allScore}>{awayTeamCurrentScore || '-'}</div>
        </div>
        <div className={ClassNames(style.cell, style.diff)}>{`半: ${(homePreAllScore - guestPreAllScore) || '--'}`}</div>
        <div
          className={ClassNames(style.cell, style.total, styleBorder.borderRight)}
        >
          {`半: ${(homePreAllScore + guestPreAllScore) || '--'}`}
        </div>
        <RenderJudge
          value={zhishu}
          active={(
            <div className={ClassNames(style.cell, style.pay, styleBorder.borderRight)}>{awayBidder}</div>
          )}
        />
        <RenderJudge
          value={zhishu}
          active={(
            <div className={ClassNames(style.cell, style.rangScore, styleBorder.borderRight)}>
              <RenderJudge
                value={awayTeamOdds}
                active={(
                  <>
                    <div className={ClassNames(style.rangScoreItem, style.left)}>{awayTeamOdds}</div>
                    <div className={ClassNames(style.rangScoreItem, style.right)}>{asianHandicap}</div>
                  </>
                )}
                inactive={asianHandicapInChinese}
              />
            </div>
          )}
        />
        <RenderJudge
          value={zhishu}
          active={(
            <div className={ClassNames(style.cell, style.bigSmall, styleBorder.borderRight)}>
              <RenderJudge
                value={smallOdds}
                active={(
                  <>
                    <div className={ClassNames(style.bigSmallItem, style.left)}>{`小 ${sizeIndex}`}</div>
                    <div className={ClassNames(style.bigSmallItem, style.right)}>{smallOdds}</div>
                  </>
                )}
                inactive={sizeIndicatorInChinese}
              />
            </div>
          )}
        />
        <RenderJudge
          value={zhishu}
          active={(
            <div className={ClassNames(style.cell, style.analyze, styleBorder.borderRight)}>
              <div className={style.cell} />
            </div>
          )}
        />
        <div className={ClassNames(style.cell, style.live, styleBorder.borderRight)} />
        <RenderJudge
          value={showHandle}
          active={<div className={ClassNames(style.cell, style.handle)} />}
        />
      </div>
      <div className={ClassNames(style.item, styleBorder.borderTop)}>
        <div className={ClassNames(style.cell, style.league, styleBorder.borderRight)}>
          <div className={style.fullCell}>
            <div className={style.leagueWrapper}>
              <RenderJudge
                value={showHandle}
                active={(
                  <Checkbox className={style.checkbox} value={isSelect} onChange={onSelectHandle} />
                )}
              />
              <div>
                {startTimeArr.map((row, index) => (<div className={style.time} key={index}>{row}</div>))}
              </div>
            </div>
          </div>
        </div>
        <div className={ClassNames(style.cell, style.name, styleBorder.borderRight)}>
          <div className={style.nameText}>{homeTeamName}</div>
        </div>
        <div className={ClassNames(style.cell, style.lesson, styleBorder.borderRight)}>
          <ScoreItem isHome />
        </div>
        <div
          className={ClassNames(style.cell, style.upDown)}
        >
          {`${homePreAllScore || '-'}/${(homeNextAllScore) || '-'}`}
        </div>
        <div className={ClassNames(style.cell, style.all)}>
          <RenderJudge
            value={homeShowAnimation}
            active={<div className={style.goalAnimation} />}
          />
          <div className={style.allScore}>{homeTeamCurrentScore || '-'}</div>
        </div>
        <div
          className={ClassNames(style.cell, style.diff)}
        >
          {`全: ${(homeTeamCurrentScore - awayTeamCurrentScore) || '--'}`}
        </div>
        <div
          className={ClassNames(style.cell, style.total, styleBorder.borderRight)}
        >
          {`全: ${(awayTeamCurrentScore + homeTeamCurrentScore) || '--'}`}
        </div>
        <RenderJudge
          value={zhishu}
          active={(
            <div className={ClassNames(style.cell, style.pay, styleBorder.borderRight)}>{homeBidder}</div>
          )}
        />
        <RenderJudge
          value={zhishu}
          active={(
            <div className={ClassNames(style.cell, style.rangScore, styleBorder.borderRight)}>
              <RenderJudge
                value={homeTeamOdds}
                active={(
                  <>
                    <div className={ClassNames(style.rangScoreItem, style.left)}>{homeTeamOdds}</div>
                    <div className={ClassNames(style.rangScoreItem, style.right)}>{asianHandicap}</div>
                  </>
                )}
                inactive={asianHandicapInChinese}
              />
            </div>
          )}
        />
        <RenderJudge
          value={zhishu}
          active={(
            <div className={ClassNames(style.cell, style.bigSmall, styleBorder.borderRight)}>
              <RenderJudge
                value={bigOdds}
                active={(
                  <>
                    <div className={ClassNames(style.bigSmallItem, style.left)}>{`大 ${sizeIndex}`}</div>
                    <div className={ClassNames(style.bigSmallItem, style.right)}>{bigOdds}</div>
                  </>
                )}
                inactive={sizeIndicatorInChinese}
              />
            </div>
          )}
        />
        <RenderJudge
          value={zhishu}
          active={(
            <div className={ClassNames(style.cell, style.analyze, styleBorder.borderRight)}>
              <div className={style.fullCell}>
                <div className={style.fullCellItem}>
                  <ScoreLink
                    page="handicap"
                    className={style.analyzeLink}
                  >
                    亚
                  </ScoreLink>
                  <ScoreLink
                    page="european"
                    className={style.analyzeLink}
                  >
                    欧
                  </ScoreLink>
                  <ScoreLink
                    page="size"
                    className={style.analyzeLink}
                  >
                    大
                  </ScoreLink>
                </div>
              </div>
            </div>
          )}
        />
        <div className={ClassNames(style.cell, style.live, styleBorder.borderRight)}>
          <div className={style.fullCell}>
            <ScoreLink
              page="live"
              className={style.fullCellItem}
            >
              <RenderJudge
                value={whetherToUseLiveVideo}
                active={<Iconfont name="video" className={style.liveImage} />}
                inactive={<Iconfont name="animated" className={style.liveImage} />}
              />
            </ScoreLink>
          </div>
        </div>
        <RenderJudge
          value={showHandle}
          active={(
            <div className={ClassNames(style.cell, style.handle)}>
              <div className={style.fullCell}>
                <div className={style.fullCellItem}>
                  <div
                    className={ClassNames(style.handleIcon, style.top, isTop && style.isActive)}
                    onClick={onSetTopHandle}
                  />
                </div>
                <div className={style.fullCellItem}>
                  <div
                    className={ClassNames(style.handleIcon, style.keep, isKeep && style.isActive)}
                    onClick={onSetKeepHandle}
                  />
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

Row.defaultProps = {
  data: {},
  showHandle: true,
  style: {}
};

export default Row;
