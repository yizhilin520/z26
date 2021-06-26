import React from 'react';
import DateListComponent from '../../components/DateList';
import { useStores } from '../utils/store';

const DateList = () => {
  const { query, getMatch, sortType } = useStores();
  const isReverse = sortType === 'finish';
  const onChangeHandle = (v) => {
    if (query.date === v) return;

    return getMatch({ date: v });
  };

  return (
    <DateListComponent value={query.date} isReverse={isReverse} onChange={onChangeHandle} />
  );
};

export default DateList;
