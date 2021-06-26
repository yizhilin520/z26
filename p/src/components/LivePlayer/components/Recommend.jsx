import React from 'react';
import { useRequest } from '@/utils/hooks';
import { getLiveList } from '@/servers/homeServer';
import ListVideoCard from '@/components/ListVideoCard';

import styles from '../style/Recommend.scss';

const Recommend = ({ sportId, roomId }) => {
  const ignoreRoomIds = roomId ? (Array.isArray(roomId) ? roomId.join(',') : roomId) : null;
  const { data: list } = useRequest(
    (q) => getLiveList(q).toPromise(),
    {
      page: 1,
      size: 2,
      liveTypeId: sportId,
      ignoreRoomIds
    },
    (d) => {
      const { rows } = d || {};
      return (rows || []).sort((a, b) => b.heat - a.heat);
    }
  );

  return (
    <div className={styles.container}>
      <div className={styles.title}>主播正在赶来的路上，下面内容同样精彩~</div>
      <ListVideoCard className={styles.list} list={list} rows={2} marginLeft={30} marginTop={26} />
    </div>
  );
};

Recommend.defaultProps = {
  // 默认足球
  sportId: 1
};

export default Recommend;
