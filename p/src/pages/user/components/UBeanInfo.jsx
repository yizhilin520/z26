import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRequest } from '@/utils/hooks';
import { getUBeanFlowsDetail } from '@/servers/userServer';
import Pagination from '@material-ui/lab/Pagination';
import { withStyles } from '@material-ui/core/styles';
import RenderJudge from '@/components/RenderJudge';
import Table from '@/pages/user/components/Table';
import RechargeMethodSelect from './RechargeMethodSelect';
import styles from '../style/UBeanInfo.scss';

const CustomPage = withStyles(() => ({
  root: {
    margin: '20px'
  },
  ul: {
    justifyContent: 'flex-end'
  }
}))(Pagination);

const UBeanInfo = () => {
  const { uid } = useSelector(({ user }) => user.userInfo || {});
  const [query, setQuery] = useState({ id: uid, page: 1, size: 10 });
  const [pageCount, setPageCount] = useState(0);
  const { data: list = [], loading, mutate } = useRequest(
    (q) => getUBeanFlowsDetail(q).toPromise(),
    query,
    (d) => {
      const { pages, rows } = d || {};

      setPageCount(pages || 0);
      return rows || [];
    }
  );
  const incomeList = [{
    label: '全部'
  }, {
    label: '收入',
    value: 0
  }, {
    label: '支出',
    value: 1
  }];
  const tableProps = [{
    label: '序号',
    width: 82,
    type: 'index'
  }, {
    label: '收支类型',
    width: 124,
    value: 'inOutTypeName'
  }, {
    label: '收入类型',
    width: 126,
    formatter: ({ inOutType, taskTypeName }) => (inOutType === 0 && taskTypeName) || '/'
  }, {
    label: '支出类型',
    width: 126,
    formatter: ({ inOutType, taskTypeName }) => (inOutType === 1 && taskTypeName) || '/'
  }, {
    label: '变动数量',
    width: 144,
    formatter: ({ ubeanNum, afterNum }) => {
      const num = afterNum - ubeanNum;
      const flag = num === 0 ? '' : (num > 0 ? '+' : '-');

      return `${flag}${Math.abs(num)}`;
    }
  }, {
    label: '订单时间',
    value: 'createTime'
  }, {
    label: '金豆余额',
    width: 160,
    value: 'ubeanNum'
  }];

  // 翻页
  const onPageHandle = (event, page) => {
    const qy = { ...query, page };
    setQuery(qy);
    return mutate(qy);
  };
  // 收支类型切换
  const onIncomeChangeHandle = (inOutType) => {
    const qy = {
      ...query,
      page: 1,
      inOutType
    };
    setQuery(qy);
    return mutate(qy);
  };

  return (
    <>
      <div className={styles.filter}>
        <RechargeMethodSelect
          icon="shouzhifenxi"
          value={query.inOutType}
          label="收支类型"
          list={incomeList}
          onChange={onIncomeChangeHandle}
        />
      </div>
      <Table list={list} props={tableProps} isNotData={!loading && !list.length} />
      <RenderJudge
        value={pageCount}
        active={(<CustomPage page={query.page} count={pageCount} onChange={onPageHandle} />)}
      />
    </>
  );
};

export default UBeanInfo;
