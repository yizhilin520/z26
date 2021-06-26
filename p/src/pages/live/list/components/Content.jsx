import React from 'react';
import { useLoadMore, useRequest, useSafeState } from '@/utils/hooks';
import { getLiveList } from '@/servers/homeServer';
import Title from './Title';
import LiveListVideoCard from './LiveListVideoCard';

const Content = ({ title, value, types, pageSize }) => {
  const [type, setType] = useSafeState(value);
  const [query, setQuery] = useSafeState({ page: 1, size: pageSize, liveTypeId: value });
  const [total, setTotal] = useSafeState(0);
  const [nextPageDisable, setNextPageDisable] = useSafeState(true);
  // 标记是否是加载更多
  const [isLoadMoreFlag, setIsLoadMoreFlag] = useSafeState(false);

  const { data: list = [], loading, mutate } = useRequest(
    (q) => getLiveList(q).toPromise(),
    query,
    (d) => {
      const { total: rTotal, rows } = d || {};
      const rRows = rows || [];

      setTotal(rTotal);
      setNextPageDisable(false);

      if (isLoadMoreFlag) return list.concat(rRows);

      return rRows;
    }
  );

  useLoadMore({
    disable: query.page * query.size >= total || nextPageDisable,
    loadMore: () => {
      setNextPageDisable(true);
      setIsLoadMoreFlag(true);
      const qy = {
        ...query,
        page: query.page + 1
      };
      setQuery(qy);
      return mutate(qy);
    }
  });

  // 类型切换
  const onTypeChangeHandle = (t) => {
    setType(t);

    setNextPageDisable(true);
    setIsLoadMoreFlag(false);
    const qy = {
      ...query,
      page: 1,
      liveTypeId: t
    };
    setQuery(qy);
    return mutate(qy);
  };

  return (
    <>
      <Title label={title} list={types} value={type} onChange={onTypeChangeHandle} />
      <LiveListVideoCard list={list} isNotData={!loading && !list.length} />
    </>
  );
};

Content.defaultProps = {
  types: [],
  pageSize: 24
};

export default Content;
