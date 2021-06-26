import React from 'react';
import ClassNames from 'classnames';
import { useRequest } from 'ahooks';
import { getFootballRealtime } from '@/services/sports';
import RenderJudge from '@/components/RenderJudge';
import EmptyData from '@/components/EmptyData';
import GuideDownload from './GuideDownload';

import styles from '../style/FootballOverview.scss';

const FootballOverview = ({ data }) => {
  const [matchId] = data;

  const { data: rData, loading } = useRequest(
    () => getFootballRealtime(matchId),
    {
      initialData: []
    }
  );
  const realTimeList = rData || [];
  const [, , textLive] = realTimeList;
  const reverseTextLive = ([...textLive || []]).reverse().slice(0, 8);

  return (
    <RenderJudge
      value={!reverseTextLive.length && !loading}
      active={(
        <EmptyData text="暂无文字直播" />
      )}
      inactive={(
        <div className={styles.container}>
          {(reverseTextLive.map((row, index) => {
            const [,,, text,,,,, minute] = row;
            return (
              <div className={ClassNames(styles.item, { [styles.isActive]: !!minute })} key={index}>
                <div className={styles.minute}>{minute}</div>
                <div className={styles.text}>{text}</div>
              </div>
            );
          }))}
          <GuideDownload />
        </div>
      )}
    />
  );
};

export default FootballOverview;
