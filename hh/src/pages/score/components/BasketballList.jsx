import React, { useEffect } from 'react';
import useSafeState from 'ahooks/lib/useSafeState';
import { useRequest } from 'ahooks';
import { empty } from '@/common/utils';
import { getMatchList } from '@/services/sports';
import EmptyData from '@/components/EmptyData';
import RenderJudge from '@/components/RenderJudge';
import StatusTabs from './StatusTabs';
import BasketballVirtual from './BasketballVirtual';
import styles from '../style/BasketballList.scss';

const BasketballList = ({ onLoading }) => {
  const [tabStatus, setTabStatus] = useSafeState(0);
  const { loading, data = [] } = useRequest(
    () => getMatchList({ sport_id: 2, status: tabStatus === 0 ? '' : tabStatus }),
    {
      refreshDeps: [tabStatus]
    }
  );

  useEffect(() => {
    onLoading(loading);
  }, [loading]);

  const hotTabs = [
    { title: '全部', value: 0 },
    { title: '进行', value: 2 },
    { title: '赛程', value: 1 },
    { title: '赛果', value: 3 },
  ];

  return (
    <div className={styles.footballContainer}>
      <StatusTabs
        tabs={hotTabs}
        onTabChange={({ value }) => setTabStatus(value)}
      />
      <div className={styles.matchList}>
        <RenderJudge
          value={!loading && !data.length}
          active={<EmptyData />}
          inactive={(
            <>
              <RenderJudge
                value={data.length}
                active={
                  <BasketballVirtual listData={data} tabStatus={tabStatus} />
                }
              />
            </>
          )}
        />
      </div>
    </div>
  );
};

BasketballList.defaultProps = {
  onLoading: empty
};

export default BasketballList;
