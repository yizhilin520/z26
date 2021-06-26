import React, { useMemo } from 'react';
import CellMeasurer, { CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
// import { usePersistFn } from 'ahooks';
// import { useWebsocketPush } from '@/utils/hooks';
import RenderJudge from '@/components/RenderJudge';
import NotData from '../../components/NotData';
import WindowScrollerVirtualList from '../../components/WindowScrollerVirtualList';
import ClassifyTitle from '../../components/ClassifyTitle';
import DataRow from './DataRow';
import { useStores } from '../utils/store';

// 分类排序
const ClassifySortContainer = () => {
  const { state } = useStores();
  const { list, hiddenObject, topObject } = state;

  // 推送状态
  // const statusHandle = usePersistFn((d) => {
  //   // [赛事ID,赛事大状态,赛事小状态,赛事扩展信息(可能为空)]
  //   const [eventId, bigState, smallState] = d || [];
  //
  //   methods.setList(list.map((row) => {
  //     if (row.eventId === eventId) {
  //       return {
  //         ...row,
  //         bigState,
  //         smallState
  //       };
  //     }
  //
  //     return row;
  //   }));
  // });

  // 推送比分
  // const scoreHandle = usePersistFn((d) => {
  //   // [赛事ID,主队全场得分,客队全场得分,主队半场得分,客队半场得分,进球时间,主队名称,客队名称]
  //   const [eventId, homeTeamCurrentScore, awayTeamCurrentScore, homeTeamHalfScore, awayTeamHalfScore, , homeTeamName, awayTeamName] = d || [];
  //   methods.setList(list.map((row) => {
  //     if (row.eventId === eventId) {
  //       return {
  //         ...row,
  //         homeTeamName,
  //         awayTeamName,
  //         score: {
  //           ...row.score || {},
  //           homeTeamCurrentScore,
  //           awayTeamCurrentScore,
  //           homeTeamHalfScore,
  //           awayTeamHalfScore
  //         }
  //       };
  //     }
  //
  //     return row;
  //   }));
  // });

  // 推送统计
  // const staticHandle = usePersistFn((d) => {
  //   // [赛事ID,主队红牌数,客队红牌数,主队黄牌数,客队黄牌数,主队角球数,客队角球数,变化时间,主队名称,客队名称]
  //   const [eventId, homeTeamRedCard, awayRedCard, homeTeamYellowCard, awayTeamYellowCard, homeTeamCornerKick, awayTeamCornerKick, gameTime, homeTeamName, awayTeamName] = d || [];
  //   methods.setList(list.map((row) => {
  //     if (row.eventId === eventId) {
  //       return {
  //         ...row,
  //         homeTeamName,
  //         awayTeamName,
  //         gameTime,
  //         score: {
  //           ...row.score || {},
  //           homeTeamRedCard,
  //           awayRedCard,
  //           homeTeamYellowCard,
  //           awayTeamYellowCard,
  //           homeTeamCornerKick,
  //           awayTeamCornerKick
  //         }
  //       };
  //     }
  //
  //     return row;
  //   }));
  // });

  // useWebsocketPush('/bf/list/1', (res) => {
  //   const { type, data } = res;
  //   if (type === 'status') return statusHandle(data);
  //   if (type === 'score') return scoreHandle(data);
  //   if (type === 'static') return staticHandle(data);
  // });

  const result = useMemo(() => {
    const topDataList = [];
    let classifyList = [];

    const storeObj = {
      a2: {
        id: 2,
        item: []
      },
      a1: {
        id: 1,
        item: []
      },
      a3: {
        id: 3,
        item: []
      },
      a4: {
        id: 4,
        item: []
      }
    };

    list.forEach((row) => {
      const { bigState, eventId } = row;
      if (hiddenObject.has(eventId)) return;
      if (topObject.has(eventId)) {
        topDataList.push(row);
      } else {
        const key = `a${bigState}`;

        const { id, item } = storeObj[key];
        storeObj[key] = {
          id,
          item: item.concat([row])
        };
      }
    });

    Object.keys(storeObj).forEach((name) => {
      const { id, item } = storeObj[name];
      if (item.length) {
        const titleRow = {
          type: 'title',
          id
        };
        classifyList = classifyList.concat([titleRow]).concat(item);
      }
    });

    return topDataList.concat(classifyList);
  }, [list, hiddenObject, topObject]);

  const cache = new CellMeasurerCache({
    fixedWidth: true
  });

  const rowRenderer = ({ index, key, parent, style }) => {
    const row = result[index] || {};
    const { type, id } = row;
    let component = (<DataRow key={key} data={row} style={style} />);

    if (type === 'title') component = (<ClassifyTitle status={id} key={key} style={style} />);

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
    <RenderJudge
      value={result.length}
      active={(
        <WindowScrollerVirtualList
          list={result}
          rowHeight={cache.rowHeight}
          rowRenderer={rowRenderer}
        />
      )}
      inactive={(<NotData />)}
    />
  );
};

// 关注的排序
const KeepSortContainer = () => {
  const { state } = useStores();
  const list = state.keepList;

  return (
    <RenderJudge
      value={list.length}
      active={list.map((row, index) => (<DataRow data={row} showHandle={false} key={index} />))}
      inactive={(<NotData />)}
    />
  );
};

// 正常的排序
const NormalSortContainer = () => {
  const { state } = useStores();
  const { list } = state;

  const cache = new CellMeasurerCache({
    fixedWidth: true
  });

  const rowRenderer = ({ index, key, parent, style }) => (
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      key={key}
      parent={parent}
      rowIndex={index}
    >
      <DataRow
        key={index}
        data={list[index]}
        style={style}
      />
    </CellMeasurer>
  );

  return (
    <RenderJudge
      value={list.length}
      active={(
        <WindowScrollerVirtualList
          list={list}
          rowHeight={cache.rowHeight}
          rowRenderer={rowRenderer}
        />
      )}
      inactive={(<NotData />)}
    />
  );
};

const Container = () => {
  const { status } = useStores();
  const { sortType } = status;

  if (sortType === 'timely') return (<ClassifySortContainer />);
  if (sortType === 'keep') return (<KeepSortContainer />);

  return <NormalSortContainer />;
};

export default Container;
