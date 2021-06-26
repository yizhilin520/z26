import React from 'react';
import { useSelector } from 'react-redux';
import ClassNames from 'classnames';
import RenderJudge from '@/components/RenderJudge';
import { useStores } from '../utils/store';

import styles from '../style/Row.scss';

const Row = ({
  className,
  style,

  select,
  leagueName,
  matchTime,
  status,
  homeTeamName,
  score,
  awayTeamName,
  half,
  corner,
  live,
  odds,
  index,
  handle
}) => {
  const { zhishu } = useSelector(({ config }) => config.globalSwitch);
  const { status: { sortType } } = useStores();
  const showHandle = sortType === 'timely';

  return (
    <div className={ClassNames(styles.container, className)} style={style}>
      <RenderJudge
        value={showHandle}
        active={(
          <div className={ClassNames(styles.cell, styles.isSelect)}>
            {select}
          </div>
        )}
      />
      <div className={ClassNames(styles.cell, styles.isLeagueName)}>
        {leagueName}
      </div>
      <div className={ClassNames(styles.cell, styles.isMatchTime)}>
        {matchTime}
      </div>
      <div className={ClassNames(styles.cell, styles.isStatus)}>
        {status}
      </div>
      <div className={ClassNames(styles.cell, styles.isHomeTeam)}>
        {homeTeamName}
      </div>
      <div className={ClassNames(styles.cell, styles.isScore)}>
        {score}
      </div>
      <div className={ClassNames(styles.cell, styles.isGuestTeam)}>
        {awayTeamName}
      </div>
      <div className={ClassNames(styles.cell, styles.isHalf)}>
        {half}
      </div>
      <div className={ClassNames(styles.cell, styles.isCorner)}>
        {corner}
      </div>
      <div className={ClassNames(styles.cell, styles.isLive)}>
        {live}
      </div>
      <RenderJudge
        value={zhishu}
        active={(
          <>
            <div className={ClassNames(styles.cell, styles.isOdds)}>
              {odds}
            </div>
            <div className={ClassNames(styles.cell, styles.isIndex)}>
              {index}
            </div>
          </>
        )}
      />
      <RenderJudge
        value={showHandle}
        active={(
          <div className={ClassNames(styles.cell, styles.isHandle)}>
            {handle}
          </div>
        )}
      />
    </div>
  );
};

Row.defaultProps = {
  data: {}
};

export default Row;
