import React, { useRef } from 'react';
import ClassNames from 'classnames';
import dayJs from 'dayjs';
import RenderJudge from '@/components/RenderJudge';
import EventFilterDropdown from '../../components/EventFilterDropdown';
import { useStores } from '../utils/store';

import styles from '../style/Filter.scss';

const Filter = () => {
  const eventFilterRef = useRef();
  const { status, state, methods } = useStores();
  const totalHideSize = state.hiddenObject.size;

  // 显示全部
  const onShowAllHandle = () => methods.emptyHidden();

  // 类型切换
  const onTypeChangeHandle = (row) => {
    if (status.sortType === row.value) return;
    if (row.value === 'keep') {
      // 关注
      methods.getFollowData();
    } else {
      methods.getListData({ status: row.status, date: dayJs().format('YYYYMMDD') });
    }

    methods.setSortType(row.value);
    onShowAllHandle();
  };

  // 打开赛事筛选
  const onOpenEventFilterHandle = (e) => eventFilterRef.current.open(e);

  const list = [{
    label: '即时',
    value: 'timely',
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
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {list.map((row, index) => (
          <div
            className={ClassNames(styles.button, { [styles.isActive]: row.value === status.sortType })}
            onClick={() => onTypeChangeHandle(row)}
            key={index}
          >
            {row.label}
          </div>
        ))}
        <RenderJudge
          value={!!totalHideSize}
          active={(
            <div
              className={ClassNames(styles.button, styles.isActive)}
              onClick={onShowAllHandle}
            >
              {`全部(隐藏${totalHideSize}场)`}
            </div>
          )}
        />
        <div className={styles.content}>
          <RenderJudge
            value={status.sortType === 'keep'}
            inactive={(
              <div className={ClassNames(styles.button, styles.isPlain)} onClick={onOpenEventFilterHandle}>赛事筛选</div>
            )}
          />
        </div>
      </div>
      <EventFilterDropdown
        ref={eventFilterRef}
        data={state.list}
        onAddHidden={methods.addHidden}
        onRemoveHidden={methods.removeHidden}
      />
    </div>
  );
};

export default Filter;
