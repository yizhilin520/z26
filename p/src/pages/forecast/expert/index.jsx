import React from 'react';
import { useSelector } from 'react-redux';
import { getPlanExpertList } from '@/servers/scoreServer';
import { useRequest, useSafeState, useSetState } from '@/utils/hooks';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SideTools from '@/components/SideTools';
import RenderJudge from '@/components/RenderJudge';
import Main from '../components/Main';
import UserInfo from '../components/UserInfo';
import ExpertPlanList from '../components/ExpertPlanList';
import ExpertPlanTabs from '../components/ExpertPlanTabs';
import LoadMore from '../components/LoadMore';

import styles from './style.scss';

const ExpertPage = ({ match: { params: { expertId } } }) => {
  const { uid } = useSelector(({ user }) => user.userInfo || {});
  const [query, setQuery] = useSetState({
    expertId,
    userId: uid,
    page: 1,
    size: 10
  });
  const [tabValue, setTabValue] = useSafeState('sale');
  // 历史方案总长度
  const [historyTotal, setHistoryTotal] = useSafeState(0);

  const { data = {}, loading, mutate } = useRequest(
    (q) => getPlanExpertList(q).toPromise(),
    query,
    (d) => {
      const { sale, history } = d || {};
      const { data: hData, total } = history || {};
      const { history: yData } = data || {};

      setHistoryTotal(total || 0);
      return { sale: sale || [], history: (yData || []).concat(hData || []) };
    }
  );

  // 判断是否显示加载更多
  const judgeShowLoadMore = !loading && tabValue === 'history' && (query.page * query.size < historyTotal);

  // 下一页
  const onNextPageHandle = () => {
    const qy = {
      ...query,
      page: query.page + 1
    };

    setQuery(qy);
    return mutate(qy);
  };

  const tabList = [{
    label: '在售方案',
    value: 'sale',
    list: data.sale || []
  }, {
    label: '历史方案',
    value: 'history',
    list: data.history || []
  }];

  const { list } = tabList.find((t) => t.value === tabValue);

  return (
    <>
      <Header isForecast />
      <Main>
        <div className={styles.container}>
          <UserInfo expertId={expertId} />
          <ExpertPlanList
            className={styles.wrapper}
            list={list}
            loading={loading && tabValue === 'sale'}
            beforeChildren={(<ExpertPlanTabs list={tabList} value={tabValue} onChange={setTabValue} />)}
            getLinkUrl={({ sportId, planId }) => `/forecast/detail/${sportId}/${expertId}/${planId}`}
          >
            <RenderJudge
              value={judgeShowLoadMore}
              active={(<LoadMore onClick={onNextPageHandle} />)}
            />
          </ExpertPlanList>
        </div>
      </Main>
      <SideTools />
      <Footer />
    </>
  );
};

export default ExpertPage;
