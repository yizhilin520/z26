import React from 'react';
import { Link } from 'react-router-dom';
import RenderJudge from '@/components/RenderJudge';

import { useRequest } from '@/utils/hooks';
import { time } from '@/utils/regular';
import { getLiveList, userReserves } from '@/servers/homeServer';
import { getNotice } from '@/servers/scoreServer';

import styles from '../style/LiveDropDown.scss';

const LiveDropDown = () => {
  // 正在热播
  const { data: liveData } = useRequest(
    (q) => getLiveList(q).toPromise(),
    {
      dataType: 1,
      page: 1,
      size: 5,
      liveTypeId: 1
    }
  );
  // 赛事预告
  const { data: noticeMatchData } = useRequest(
    (q) => getNotice(q).toPromise(),
    {
      dataType: 1,
      type: 1
    }
  );

  // 赛事订阅
  const onMatchReserveHandle = (matchId) => userReserves({ matchId }).toPromise();

  const hitList = (liveData || {}).rows || [];
  const noticeMatchList = (noticeMatchData || []).slice(0, 5);

  return (
    <div className={styles.container}>
      <RenderJudge
        value={hitList.length}
        active={(
          <>
            <div className={styles.title}>正在直播</div>
            <div className={styles.liveList}>
              {hitList.map((row, index) => (
                <div className={styles.liveItem} key={index}>
                  <div className={styles.inner}>
                    <span className={styles.status} />
                    <span className={styles.userName}>{(row.nickname || '').substr(0, 3)}</span>
                    <span className={styles.liveName}>{row.title}</span>
                  </div>
                  <Link to={`/live/room/${row.room_id}`} className={styles.button}>查看</Link>
                </div>
              ))}
            </div>
          </>
        )}
      />
      <RenderJudge
        value={noticeMatchList.length}
        active={(
          <>
            <div className={styles.title}>赛事预告</div>
            <div className={styles.noticeList}>
              {noticeMatchList.map((row, index) => (
                <div className={styles.noticeItem} key={index}>
                  <div className={styles.dot} />
                  <div className={styles.inner}>
                    <div className={styles.timer}>{time(row[1])}</div>
                    <div className={styles.userName}>{row[6]}</div>
                    <div className={styles.noticeName}>
                      <span>{row[2]}</span>
                      <span>VS</span>
                      <span>{row[4]}</span>
                    </div>
                  </div>
                  <div className={styles.button} onClick={() => onMatchReserveHandle(row[0])}>预订</div>
                </div>
              ))}
            </div>
          </>
        )}
      />
    </div>
  );
};

export default LiveDropDown;
