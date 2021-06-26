import React from 'react';
import ClassNames from 'classnames';
import { useRequest } from 'ahooks';
import { getBasketballMatchDetail } from '@/services/sports';
import CircleProgress from '@/components/CircleProgress';
import { basketballTeamStaticsFormat } from '../utils/formatter';
import GuideDownload from './GuideDownload';

import styles from '../style/BasketballOverview.scss';

const DataCircleProgress = ({ reverse, percentage, color }) => (
  <CircleProgress
    reverse={reverse}
    percentage={percentage}
    width={76}
    strokeWidth={14}
    color={color}
    backgroundColor="#f2f2f2"
    showText={false}
  />
);
const DataLineProgress = ({ homeLabel, awayLabel, percentage, align }) => (
  <div className={styles.lineProgress}>
    <div className={ClassNames(styles.middleValue, styles.isLeft)}>{homeLabel}</div>
    <div className={styles.lineBar}>
      <div
        className={ClassNames(styles.barInner, {
          [styles.isLeft]: align === 'left',
          [styles.isMiddle]: align === 'center',
          [styles.isRight]: align === 'right'
        })}
        style={{ width: percentage }}
      />
    </div>
    <div className={ClassNames(styles.middleValue, styles.isRight)}>{awayLabel}</div>
  </div>
);

const BasketballOverview = ({ data }) => {
  const [matchId, , homeTeamName, awayTeamName, , , , , , , , , , , , , , score] = data;
  const [
    homeTeamScore,
    awayTeamScore,
    homeTeamFirstScore,
    awayTeamFirstScore,
    homeTeamTwoScore,
    awayTeamTwoScore,
    homeTeamThreeScore,
    awayTeamThreeScore,
    homeTeamFourScore,
    awayTeamFourScore,
    homeTeamOvertimeScore,
    awayTeamOvertimeScore
  ] = score || [];

  const { data: rData } = useRequest(
    () => getBasketballMatchDetail({ matchId }),
    {
      initialData: {}
    }
  );
  const { teamStatics } = rData || {};
  const {
    threePointerPercentage,
    shotPercentage,
    penaltyPercentage,
    fouls,
    surplusPauseNumber,
    threePointerScore,
    twoPointerScore,
    freeThrowScore
  } = basketballTeamStaticsFormat(teamStatics);

  return (
    <div className={styles.container}>
      <div className={styles.scoreContainer}>
        <div className={ClassNames(styles.row, styles.isHeader)}>
          <div className={ClassNames(styles.cell, styles.isName)} />
          <div className={styles.cell}>一</div>
          <div className={styles.cell}>二</div>
          <div className={styles.cell}>三</div>
          <div className={styles.cell}>四</div>
          <div className={styles.cell}>OT</div>
          <div className={styles.cell}>总分</div>
        </div>
        <div className={styles.row}>
          <div
            className={ClassNames(styles.cell, styles.isName, styles.isLeftBorder, styles.isMain)}
          >
            {homeTeamName}
          </div>
          <div className={styles.cell}>{homeTeamFirstScore}</div>
          <div className={styles.cell}>{homeTeamTwoScore}</div>
          <div className={styles.cell}>{homeTeamThreeScore}</div>
          <div className={styles.cell}>{homeTeamFourScore}</div>
          <div className={styles.cell}>{homeTeamOvertimeScore}</div>
          <div className={styles.cell}>{homeTeamScore}</div>
        </div>
        <div className={styles.row}>
          <div
            className={ClassNames(styles.cell, styles.isName, styles.isLeftBorder, styles.isGuest)}
          >
            {awayTeamName}
          </div>
          <div className={styles.cell}>{awayTeamFirstScore}</div>
          <div className={styles.cell}>{awayTeamTwoScore}</div>
          <div className={styles.cell}>{awayTeamThreeScore}</div>
          <div className={styles.cell}>{awayTeamFourScore}</div>
          <div className={styles.cell}>{awayTeamOvertimeScore}</div>
          <div className={styles.cell}>{awayTeamScore}</div>
        </div>
      </div>
      <div className={styles.dataContainer}>
        <div className={styles.header}>
          <div className={styles.headerItem}>
            <div
              className={ClassNames(styles.headerVal, styles.isLeft)}
            >
              {threePointerPercentage.homeLabel}
            </div>
            <div className={styles.circleProgress}>
              <DataCircleProgress
                reverse={threePointerPercentage.reverse}
                percentage={threePointerPercentage.percentage}
                color={threePointerPercentage.color}
              />
              <div className={styles.circleLabel}>三分</div>
            </div>
            <div
              className={ClassNames(styles.headerVal, styles.isRight)}
            >
              {threePointerPercentage.awayLabel}
            </div>
          </div>
          <div className={styles.headerItem}>
            <div
              className={ClassNames(styles.headerVal, styles.isLeft)}
            >
              {shotPercentage.homeLabel}
            </div>
            <div className={styles.circleProgress}>
              <DataCircleProgress
                reverse={shotPercentage.reverse}
                percentage={shotPercentage.percentage}
                color={shotPercentage.color}
              />
              <div className={styles.circleLabel}>投篮</div>
            </div>
            <div
              className={ClassNames(styles.headerVal, styles.isRight)}
            >
              {shotPercentage.awayLabel}
            </div>
          </div>
          <div className={styles.headerItem}>
            <div className={ClassNames(styles.headerVal, styles.isLeft)}>{penaltyPercentage.homeLabel}</div>
            <div className={styles.circleProgress}>
              <DataCircleProgress
                reverse={penaltyPercentage.reverse}
                percentage={penaltyPercentage.percentage}
                color={penaltyPercentage.color}
              />
              <div className={styles.circleLabel}>罚球</div>
            </div>
            <div className={ClassNames(styles.headerVal, styles.isRight)}>{penaltyPercentage.awayLabel}</div>
          </div>
        </div>
        <div className={styles.dataWrapper}>
          <div className={styles.pressSide}>
            <div className={styles.sideLabel}>本节犯规数</div>
            <div className={styles.sideValue}>{fouls.homeLabel}</div>
            <div className={styles.sideLabel}>剩余暂停</div>
            <div className={styles.sideValue}>{surplusPauseNumber.homeLabel}</div>
          </div>
          <div className={styles.pressMiddle}>
            <div className={styles.middleLabel}>三分球得分</div>
            <DataLineProgress
              homeLabel={threePointerScore.homeLabel}
              awayLabel={threePointerScore.awayLabel}
              percentage={threePointerScore.percentage}
              align={threePointerScore.align}
            />
            <div className={styles.middleLabel}>两分球得分</div>
            <DataLineProgress
              homeLabel={twoPointerScore.homeLabel}
              awayLabel={twoPointerScore.awayLabel}
              percentage={twoPointerScore.percentage}
              align={twoPointerScore.align}
            />
            <div className={styles.middleLabel}>罚球得分</div>
            <DataLineProgress
              homeLabel={freeThrowScore.homeLabel}
              awayLabel={freeThrowScore.awayLabel}
              percentage={freeThrowScore.percentage}
              align={freeThrowScore.align}
            />
          </div>
          <div className={styles.pressSide}>
            <div className={styles.sideLabel}>本节犯规数</div>
            <div className={styles.sideValue}>{fouls.awayLabel}</div>
            <div className={styles.sideLabel}>剩余暂停</div>
            <div className={styles.sideValue}>{surplusPauseNumber.awayLabel}</div>
          </div>
        </div>
      </div>
      <GuideDownload />
    </div>
  );
};

export default BasketballOverview;
