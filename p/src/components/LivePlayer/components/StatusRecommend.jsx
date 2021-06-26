import React from 'react';
import { useStores } from '../utils/store';
import Status from './Status';
import Recommend from './Recommend';

const StatusRecommend = ({ sportId, status: propStatus, roomId }) => {
  const { status } = useStores();

  if (status.destroy) {
    return (
      <Status status={propStatus}>
        <Recommend sportId={sportId} roomId={roomId} />
      </Status>
    );
  }

  return null;
};

export default StatusRecommend;
