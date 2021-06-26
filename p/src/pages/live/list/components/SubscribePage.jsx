import React from 'react';
import { getUserCareList } from '@/servers/userServer';
import { useRequest } from '@/utils/hooks';
import Title from './Title';
import LiveListVideoCard from './LiveListVideoCard';

const SubscribePage = () => {
  const { data: list = [], loading } = useRequest(
    (q) => getUserCareList(q).toPromise(),
    { page: 1, size: 30 },
    (d) => d || []
  );

  const prop = {
    title: 'matchName',
    liveTypeId: 'liveTypeId',
    userName: 'nickname',
    roomId: 'room_id',
    matchId: 'matchId',
    status: 'roomStatus',
    headImage: 'user_img',
    roomImg: 'roomImg',
    matchType: 'matchTypeName',
    heat: 'fans'
  };
  return (
    <>
      <Title label="我关注的主播" />
      <LiveListVideoCard list={list} prop={prop} isNotData={!loading && !list.length} />
    </>
  );
};

export default SubscribePage;
