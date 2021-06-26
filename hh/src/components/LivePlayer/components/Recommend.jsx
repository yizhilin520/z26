import React from 'react';
import { useRequest } from 'ahooks';
import { getRoomList } from '@/services/live';
import ListVideoCard from '@/components/ListVideoCard';

import styles from '../style/Recommend.scss';

const Recommend = ({ sportId, roomId }) => {
  // eslint-disable-next-line no-nested-ternary
  const ignoreRoomIds = roomId ? (Array.isArray(roomId) ? roomId.join(',') : roomId) : null;
  const { data } = useRequest(
    () => getRoomList({
      page: 1,
      size: 2,
      liveTypeId: sportId,
      ignoreRoomIds
    }),
    {
      initialData: {}
    }
  );

  const list = (data.rows || []).sort((a, b) => b.heat - a.heat);

  return (
    <div className={styles.container}>
      <div className={styles.title}>主播正在赶来的路上，下面内容同样精彩~</div>
      <ListVideoCard className={styles.list} list={list} rows={2} marginLeft={34} marginTop={24} />
    </div>
  );
};

Recommend.defaultProps = {
  // 默认足球
  sportId: 1
};

export default Recommend;
