import React from 'react';
import ClassNames from 'classnames';
import Row from './Row';
import Checkbox from '../../components/Checkbox';
import { useStores } from '../utils/store';

import styles from '../style/HeaderRow.scss';

const HeaderRow = () => {
  const { status, state, methods } = useStores();
  const { asia, size, europe } = status.scoreSwitch;
  // 是否选中
  const hasSelected = state.selectObject.size === state.list.length && state.list.length;
  // 选择
  const onSelectChangeHandle = (v) => {
    if (v) {
      // 全选
      state.list.forEach(({ eventId }) => {
        if (!state.selectObject.has(eventId)) methods.setSelect(eventId);
      });
    } else {
      // 全不选
      methods.emptySelect();
    }
  };

  const onScoreSwitchHandle = (obj) => methods.setScoreSwitch(obj);

  return (
    <Row
      className={styles.container}
      style={{ backgroundColor: '#434a68' }}
      select={(
        <div className={styles.select}>
          <Checkbox className={styles.selectInner} value={hasSelected} onChange={onSelectChangeHandle} />
        </div>
      )}
      leagueName={(<div className={styles.cell}>赛事</div>)}
      matchTime={<div className={styles.cell}>时间</div>}
      status={(<div className={styles.cell}>状态</div>)}
      homeTeamName={(<div className={styles.cell}>主队</div>)}
      score={(<div className={styles.cell}>比赛</div>)}
      awayTeamName={(<div className={styles.cell}>客队</div>)}
      half={(<div className={styles.cell}>半场</div>)}
      corner={(<div className={styles.cell}>角球</div>)}
      live={(<div className={styles.cell}>直播</div>)}
      odds={(
        <div className={styles.oddsWrapper}>
          <div className={ClassNames(styles.cell, styles.isOdd)}>
            <div
              className={ClassNames(styles.checkbox, { [styles.isActive]: asia })}
              onClick={() => onScoreSwitchHandle({ asia: !asia })}
            />
            <div className={styles.oddText} onClick={() => onScoreSwitchHandle({ asia: !asia })}>亚</div>
          </div>
          <div className={ClassNames(styles.cell, styles.isOdd)}>
            <div
              className={ClassNames(styles.checkbox, { [styles.isActive]: size })}
              onClick={() => onScoreSwitchHandle({ size: !size })}
            />
            <div className={styles.oddText} onClick={() => onScoreSwitchHandle({ size: !size })}>大</div>
          </div>
          <div className={ClassNames(styles.cell, styles.isOdd)}>
            <div
              className={ClassNames(styles.checkbox, { [styles.isActive]: europe })}
              onClick={() => onScoreSwitchHandle({ europe: !europe })}
            />
            <div className={styles.oddText} onClick={() => onScoreSwitchHandle({ europe: !europe })}>欧</div>
          </div>
        </div>
      )}
      index={(<div className={styles.cell}>数据</div>)}
      handle={(<div className={styles.cell}>功能</div>)}
    />
  );
};

export default HeaderRow;
