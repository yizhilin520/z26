import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useRequest, useSafeState } from '@/utils/hooks';
import { getExpertPlan } from '@/servers/scoreServer';
import RenderJudge from '@/components/RenderJudge';
import Iconfont from '@/components/Iconfont';
import Title from './Title';
import Banner from './Banner';
import ExpertRecommend from './ExpertRecommend';
import ExpertPlanList from '../../components/ExpertPlanList';
import LoadMore from '../../components/LoadMore';

import styles from '../style/HomePage.scss';

const HomePage = () => {
  const [sportType, setSportType] = useSafeState(null);
  const { uid } = useSelector(({ user }) => user.userInfo || {});
  const { data = [], loading, mutate } = useRequest(
    (t = sportType) => getExpertPlan({ type: 1, size: 50, userId: uid, sportType: t }).toPromise()
  );

  // 方案类型切换
  const onSportTypeChange = (v) => {
    setSportType(v);

    return mutate(v);
  };

  const sportTypeList = [{
    label: '全部',
    value: null
  }, {
    label: '足球',
    value: 1
  }, {
    label: '篮球',
    value: 2
  }];

  return (
    <>
      <Banner />
      <section className={styles.section}>
        <ExpertRecommend className={styles.container} />
      </section>
      <section className={styles.section}>
        <Title label="方案推荐" list={sportTypeList} value={sportType} onChange={onSportTypeChange}>
          <Link className={styles.allLink} to="/forecast/market">
            <span>全部方案</span>
            <Iconfont name="bq_ee" className={styles.icon} />
          </Link>
        </Title>
        <ExpertPlanList loading={loading} list={data} className={styles.container}>
          <RenderJudge
            value={!loading && data.length}
            active={(<LoadMore url="/forecast/market" />)}
          />
        </ExpertPlanList>
      </section>
    </>
  );
};

export default HomePage;
