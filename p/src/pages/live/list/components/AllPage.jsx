import React from 'react';
import { getLiveList } from '@/servers/homeServer';
import { useRequest } from '@/utils/hooks';
import Title from './Title';
import MatchList from './MatchList';
import LiveListVideoCard from './LiveListVideoCard';
import Content from './Content';

// 精彩推荐
const RecommendMain = () => {
  const { data, loading } = useRequest(
    (q) => getLiveList(q).toPromise(),
    { page: 1, size: 6 }
  );

  const list = (data || {}).rows || [];

  return (
    <>
      <Title label="精彩推荐" />
      <LiveListVideoCard list={list} isNotData={!loading && !list.length} />
    </>
  );
};

const AllPage = () => {
  const footballObj = {
    label: '足球',
    value: 1
  };
  const basketballObj = {
    label: '篮球',
    value: 2
  };
  const gameObj = {
    label: '电竞',
    value: 3
  };
  const amusementObj = {
    label: '娱乐',
    value: 100
  };

  const typeList = [footballObj, basketballObj, gameObj, amusementObj];

  return (
    <>
      <MatchList />
      <RecommendMain />
      <Content title="全部" types={typeList} />
    </>
  );
};

export default AllPage;
