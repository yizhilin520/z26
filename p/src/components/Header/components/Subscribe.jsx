import React from 'react';
import { Link } from 'react-router-dom';
import RenderJudge from '@/components/RenderJudge';

import { getSubscribe } from '@/servers/userServer';
import { useRequest } from '@/utils/hooks';
import SubDefaultImage from '@/assets/images/header/sub_default_image.jpg';

import styles from '../style/Subscribe.scss';

const Subscribe = () => {
  const { data } = useRequest(
    (q) => getSubscribe(q).toPromise(),
    { fetchSize: 6 }
  );
  const list = data || [];
  const onlineTotal = list.filter(({ status }) => status === 2).length;

  return (
    <div className={styles.container}>
      <RenderJudge
        value={list.length}
        active={(
          <>
            <div className={styles.title}>{`订阅的比赛${onlineTotal}场正在进行中`}</div>
            {list.map((row, index) => (
              <div className={styles.item} key={index}>
                <img className={styles.image} src={SubDefaultImage} alt="订阅" />
                <div className={styles.infos}>
                  <div className={styles.meta}>
                    <span className={styles.metaItem}>{row.tournamentName}</span>
                    <span className={styles.metaItem}>{row.round}</span>
                  </div>
                  <div className={styles.name}>
                    {/* <span className={styles.nameItem}>欧洲杯</span> */}
                    <span className={styles.nameItem}>{`${row.homeTeamName}VS${row.awayTeamName}`}</span>
                  </div>
                </div>
              </div>
            ))}
            <Link
              to="/live/list/subscribe"
              className={styles.button}
            >
              查看全部
            </Link>
          </>
        )}
        inactive={<div className={styles.notData}>您未订阅任何比赛，请先订阅 !</div>}
      />
    </div>
  );
};

export default Subscribe;
