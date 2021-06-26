import React, { useRef } from 'react';
import { useRequest, useSafeState } from '@/utils/hooks';
import { getExpertPlanMarket } from '@/servers/scoreServer';
import Iconfont from '@/components/Iconfont';
import RenderJudge from '@/components/RenderJudge';
import ExpertPlanTabs from '../../components/ExpertPlanTabs';
import Title from './Title';
import ExpertPlanList from '../../components/ExpertPlanList';
import LoadMore from '../../components/LoadMore';

import styles from '../style/MarketPage.scss';

const MarketPage = () => {
  let isLoadMore = false;
  const searchRef = useRef();
  const [query, setQuery] = useSafeState({ sportId: 1, sortType: 2, currentPage: 1, limit: 20 });
  const [total, setTotal] = useSafeState(0);
  const [data, setData] = useSafeState([]);
  const { loading, mutate } = useRequest(
    (q) => getExpertPlanMarket(q).toPromise(),
    query,
    (d) => {
      const { records, total: rTotal } = d || {};
      const rows = records || [];

      setTotal(rTotal);
      if (isLoadMore) {
        isLoadMore = false;
        setData(data.concat(rows));
      } else {
        setData(rows);
      }
    }
  );
  const isDisablePage = query.currentPage * query.limit >= total;

  // 方案类型切换
  const onSportTypeChange = (v) => {
    const qy = {
      ...query,
      sportId: v,
      currentPage: 1,
      lotteryCode: undefined
    };

    setQuery(qy);
    setData([]);

    return mutate(qy);
  };
  // 玩法类型切换
  const onLotteryTypeChange = (v) => {
    if (v === query.lotteryCode) return;

    const qy = {
      ...query,
      currentPage: 1,
      lotteryCode: v
    };

    setQuery(qy);
    setData([]);

    return mutate(qy);
  };

  // 下一页
  const onNextPageHandle = () => {
    isLoadMore = true;
    const qy = {
      ...query,
      currentPage: query.currentPage + 1
    };

    setQuery(qy);

    return mutate(qy);
  };

  // 搜索
  const onSearchHandle = () => {
    const searchKey = searchRef.current.value;

    setData([]);
    return mutate({
      ...query,
      searchKey
    });
  };

  // 搜索input绑定回车键
  const onSearchEnterHandle = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      return onSearchHandle();
    }
  };

  const sportTypeList = [{
    label: '足球',
    value: 1
  }, {
    label: '篮球',
    value: 2
  }];

  const lotteryList = query.sportId === 1 ? [{
    label: '全部'
  }, {
    label: '单关',
    value: 1
  }, {
    label: '串关',
    value: 2
  }, {
    label: '进球数',
    value: 4
  }, {
    label: '让球',
    value: 3
  }] : [{
    label: '全部'
  }, {
    label: '单关',
    value: 1
  }, {
    label: '串关',
    value: 2
  }, {
    label: '让分',
    value: 3
  }, {
    label: '大小分',
    value: 4
  }];

  return (
    <>
      <Title
        label="方案市场"
        className={styles.title}
        list={sportTypeList}
        value={query.sportId}
        onChange={onSportTypeChange}
      />
      <ExpertPlanList
        loading={loading && !data.length}
        beforeChildren={(
          <ExpertPlanTabs list={lotteryList} value={query.lotteryCode} onChange={onLotteryTypeChange}>
            <div className={styles.search}>
              <input
                className={styles.input}
                placeholder="联赛，球队或专家"
                onKeyDown={onSearchEnterHandle}
                ref={searchRef}
              />
              <Iconfont name="search" className={styles.icon} onClick={onSearchHandle} />
            </div>
          </ExpertPlanTabs>
        )}
        className={styles.container}
        list={data}
      >
        <RenderJudge
          value={isDisablePage}
          inactive={(<LoadMore onClick={onNextPageHandle} />)}
        />
      </ExpertPlanList>
    </>
  );
};

export default MarketPage;
