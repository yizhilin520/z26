import React from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';

import RenderJudge from '@/components/RenderJudge';

import { getInterestingAnchor } from '@/servers/homeServer';
import { useRequest } from '@/utils/hooks';
import Section from './Section';

import styles from '../style/AnchorClassify.scss';

const AnchorClassify = () => {
  const { data = [] } = useRequest(
    (q) => getInterestingAnchor(q).toPromise(),
    { fetchSize: 6 }
  );

  if (!data.length) return null;

  return (
    <Section className={styles.container}>
      <div className={ClassNames(styles.item, styles.more)}>
        <div className={styles.title}>明星主播</div>
        <div className={styles.summary}>806位主播已入驻</div>
        <Link
          className={styles.link}
          to="/live/list"
        >
          查看更多
        </Link>
      </div>
      {data.map((row, index) => (
        <Link className={styles.item} to={`/live/room/${row.room_id}`} target="_blank" key={index}>
          <img className={styles.image} src={row.user_img} alt={row.nickname} />
          <RenderJudge
            value={row.isOnline}
            active={(<div className={styles.liveStatus}>LIVE</div>)}
          />
          <div className={styles.infos}>
            <div className={styles.userName}>{row.nickname}</div>
            <div className={styles.number}>{row.fans}</div>
          </div>
        </Link>
      ))}
    </Section>
  );
};

export default AnchorClassify;
