import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RenderJudge from '@/components/RenderJudge';
import Iconfont from '@/components/Iconfont';
import { getUserCareList } from '@/servers/userServer';
import { useRequest } from '@/utils/hooks';

import styles from '../style/Follow.scss';

const Follow = () => {
  const { expert } = useSelector(({ config }) => config.globalSwitch);
  const { data: list = [] } = useRequest(
    (q) => getUserCareList(q).toPromise(),
    { page: 1, size: 4 },
    (d) => (d || []).sort((a, b) => b.roomStatus - a.roomStatus)
  );
  const onlineTotal = list.filter(({ roomStatus }) => roomStatus === 1).length;

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <div className={styles.titleLabel}>关注的主播</div>
        <Link to="/user/follow" className={styles.titleLink}>{`${onlineTotal}人直播中`}</Link>
        <Iconfont tag={Link} to="/user/follow" className={styles.titleIcon} name="bq_ee" />
      </div>
      <RenderJudge
        value={list.length}
        active={(
          <div className={styles.list}>
            {list.map((row, index) => (
              <div className={styles.item} key={index}>
                <img
                  className={styles.image}
                  src={row.user_img}
                  alt={row.nickname}
                />
                <RenderJudge
                  value={row.roomStatus === 1}
                  active={<div className={styles.playing} />}
                />
              </div>
            ))}
          </div>
        )}
        inactive={<div className={styles.notData}>您还未关注任何主播，请先关注 !</div>}
      />
      <RenderJudge
        value={expert}
        active={(
          <>
            <div className={styles.title}>
              <div className={styles.titleLabel}>关注的专家</div>
              <div className={styles.titleLink}>0人发新方案</div>
              <Iconfont className={styles.titleIcon} name="bq_ee" />
            </div>
            <div className={styles.notData}>您还未关注任何专家，请先关注 !</div>
          </>
        )}
      />
    </div>
  );
};

export default Follow;
