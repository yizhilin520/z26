import React, { useRef } from 'react';
import ClassNames from 'classnames';
import dayJs from 'dayjs';
import { useSafeState } from '@/utils/hooks';
import RenderJudge from '@/components/RenderJudge';
import SortDropdown from './SortDropdown';
import EventFilterDropdown from '../../components/EventFilterDropdown';

import { useStores } from '../utils/store';

import style from '../styles/TopFilter.scss';

export default function TopFilter() {
  const [type, setType] = useSafeState('time');
  const eventRef = useRef();
  const { list: dataList, hiddenObject, query, getMatch, getMatchFollow, setHidden, setSortType } = useStores();
  const totalHideSize = Object.keys(hiddenObject).length;

  // 设置查询参数
  const setQueryHandle = (status, date) => {
    if (query.status !== status) {
      getMatch({ status, date: date || dayJs().format('YYYYMMDD') });
    }
  };
  // 显示全部
  const onShowAllHandle = () => setHidden({});

  // 类型事件
  const onTypeHandle = ({ value, status }) => {
    if (type === value) return;
    if (value === 'keep') {
      getMatchFollow();
    } else {
      setQueryHandle(status);
    }
    setType(value);
    setSortType(value);
    onShowAllHandle();
  };
  // 打开赛事筛选
  const onOpenEventFilterHandle = (event) => eventRef.current.open(event);

  const list = [{
    label: '即时',
    value: 'time',
    status: undefined
  }, {
    label: '完场',
    value: 'finish',
    status: 3
  }, {
    label: '赛程',
    value: 'schedule',
    status: 1
  }, {
    label: '关注',
    value: 'keep'
  }];

  return (
    <div className={style.container}>
      <div className={style.wrapper}>
        <div className={style.statusMain}>
          {list.map((row, index) => (
            <div
              className={ClassNames(style.item, { [style.isActive]: row.value === type })}
              onClick={() => onTypeHandle(row)}
              key={index}
            >
              {row.label}
            </div>
          ))}
          <RenderJudge
            value={!!totalHideSize}
            active={(
              <div
                className={ClassNames(style.item, style.isActive)}
                onClick={onShowAllHandle}
              >
                {`全部(隐藏${totalHideSize}场)`}
              </div>
            )}
          />
        </div>
        <div className={style.filterMain}>
          <RenderJudge
            value={type === 'keep'}
            inactive={<div className={style.item} onClick={onOpenEventFilterHandle}>赛事筛选</div>}
          />
          <RenderJudge
            value={type === 'time'}
            active={<SortDropdown className={style.item} />}
          />
        </div>
      </div>
      <EventFilterDropdown ref={eventRef} data={dataList} onSubmit={setHidden} />
    </div>
  );
}
