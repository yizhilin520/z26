import React from 'react';
import CellMeasurer, { CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
import RenderJudge from '@/components/RenderJudge';
import { usePersistFn, useWebsocketPush } from '@/utils/hooks';
import WindowScrollerVirtualList from '../../components/WindowScrollerVirtualList';
import ClassifyTitle from '../../components/ClassifyTitle';
import Row from './Row';
import NotData from '../../components/NotData';

import { useStores } from '../utils/store';

// 关注的排序
const KeepSortContainer = () => {
  const { keepList } = useStores();

  return (
    <RenderJudge
      value={!!keepList.length}
      active={keepList.map((row, index) => (
        <Row data={row} showHandle={false} key={index} />
      ))}
      inactive={<NotData />}
    />
  );
};

const ClassifySortContainer = () => {
  const { list, sortType, topObject, hiddenObject, setList } = useStores();

  const statusHandle = usePersistFn((d) => {
    // [赛事ID,赛事大状态,赛事小状态,赛事倒计时]
    const [eventId, bigState, smallState, gameTime] = d;
    const result = list.map((row) => {
      if (row.eventId === eventId) {
        return ({
          ...row,
          bigState,
          smallState,
          gameTime
        });
      }

      return row;
    });
    setList([...result]);
  });

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
    const result = list.map((row) => {
      if (row.eventId === eventId) {
        return ({
          ...row,
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
      }

      return row;
    });
    setList([...result]);
  });

  useWebsocketPush('/bf/list/2', (res) => {
    const { type, data } = res;
    if (type === 'status') return statusHandle(data);
    if (type === 'score') return scoreHandle(data);
  });

  const topArr = [];
  let classifyList = [];

  const isTimeSort = sortType === 'time';
  const isMatchSort = sortType === 'match';
  let storeObj = {};
  if (isTimeSort) {
    storeObj = {
      a2: {
        itemId: 2,
        item: []
      },
      a1: {
        itemId: 1,
        item: []
      },
      a3: {
        itemId: 3,
        item: []
      },
      a4: {
        itemId: 4,
        item: []
      }
    };
  }

  list.forEach((row) => {
    const { leagueId, leagueName, bigState, eventId } = row;
    if (hiddenObject[eventId]) return;

    if (isTimeSort || isMatchSort) {
      if (topObject[eventId]) {
        topArr.push(row);
      } else {
        let key;
        if (isTimeSort) key = `a${bigState}`;
        if (isMatchSort) key = `a${leagueId}`;

        const def = storeObj[key] || {
          label: leagueName,
          item: []
        };
        def.item.push(row);
        storeObj[key] = def;
      }
    }
  });

  Object.keys(storeObj).forEach((name) => {
    const { label, itemId, item } = storeObj[name];
    if (item.length) {
      const titleRow = {
        type: 'title',
        label,
        itemId
      };
      classifyList = classifyList.concat([titleRow]).concat(item);
    }
  });

  const result = topArr.concat(classifyList);

  const cache = new CellMeasurerCache({
    defaultHeight: 108,
    minHeight: 60,
    fixedWidth: true
  });

  const rowRenderer = ({ index, key, parent, style }) => {
    const row = result[index];
    const { type, label, itemId } = row;
    let component = (<Row key={key} data={row} showHandle style={style} />);

    if (type === 'title') component = (<ClassifyTitle status={itemId} label={label} key={key} style={style} />);

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {component}
      </CellMeasurer>
    );
  };

  return (
    <WindowScrollerVirtualList
      list={result}
      rowHeight={cache.rowHeight}
      deferredMeasurementCache={cache}
      rowRenderer={rowRenderer}
    />
  );
};

// 正常的排序
const NormalSortContainer = () => {
  const { list, hiddenObject } = useStores();

  const result = [];
  list.forEach((row) => {
    const { eventId } = row;
    if (hiddenObject[eventId]) return;

    result.push(row);
  });

  return (
    <WindowScrollerVirtualList
      list={result}
      rowHeight={108}
      rowRenderer={({ index, style }) => (
        <Row
          key={index}
          data={result[index]}
          showHandle={false}
          style={style}
        />
      )}
    />
  );
};

export default function Container() {
  const { query, sortType, list } = useStores();

  if (!list.length) return <NotData />;

  if (!query.status && (sortType === 'time' || sortType === 'match')) return <ClassifySortContainer />;
  if (sortType === 'keep') return <KeepSortContainer />;

  return <NormalSortContainer />;
}
