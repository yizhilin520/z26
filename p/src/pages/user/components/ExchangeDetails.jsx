import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dayJs from 'dayjs';
import { useRequest } from 'ahooks';
import { getUserWithdraw } from '@/servers/userServer';
import { HttpCode } from '@/enums';
import RenderJudge from '@/components/RenderJudge';
import MonthYearPicker from '@/components/MonthYearPicker';
import Table from './Table';
import Pagination from './Pagination';

import styles from '../style/ExchangeDetails.scss';

const ExchangeDetails = ({ withdrawType }) => {
  const [monthString, setMonthString] = useState(dayJs().format('YYYY-MM'));
  const { data = {}, loading, pagination } = useRequest(
    ({ current, pageSize }) => getUserWithdraw({ page: current, size: pageSize, monthString, withdrawType }).toPromise(),
    {
      paginated: true,
      defaultPageSize: 10,
      formatResult: (rData) => {
        const rD = (rData || {}).data || {};
        const { code, data: pData } = rD;
        if (HttpCode.SUCCESS === code) {
          const { rows, total } = pData || {};

          return { list: rows || [], total: +total };
        }
        return throw { ...rD, type: 'business' };
      },
      refreshDeps: [monthString]
    }
  );
  const tableProps = [{
    label: '提现金额(元)',
    value: 'money',
    width: 220
  }, {
    label: '提现状态',
    width: 126,
    formatter: ({ approveStatus, approveRemark, paymentStatus, paymentRemark }) => {
      // 审核拒绝
      if (approveStatus === 2) return (<div style={{ color: '#FF5C5B' }}>{approveRemark}</div>);
      if (approveStatus === 1) {
        // 审核通过
        // 打款失败
        if (paymentStatus === 2) return (<div style={{ color: '#FF5C5B' }}>{paymentRemark}</div>);
        return (<div style={{ color: '#1AB971' }}>{['打款中', '打款成功', '打款失败'][paymentStatus]}</div>);
      }
      return (<div style={{ color: '#1AB971' }}>{['待审核', '审核通过', '审核拒绝'][approveStatus]}</div>);
    }
  }, {
    label: '订单编号',
    value: 'orderNo'
  }, {
    label: '兑换时间',
    width: 270,
    value: 'createTime'
  }];

  return (
    <>
      <div className={styles.monthQuery}>
        <MonthYearPicker
          value={monthString ? dayJs(monthString).toDate() : new Date()}
          onChange={(d) => setMonthString(dayJs(d).format('YYYY-MM'))}
        >
          <div className={styles.monthWrapper}>
            <div className={styles.monthLabel}>时间：</div>
            <div className={styles.monthInput}>{monthString}</div>
          </div>
        </MonthYearPicker>
      </div>
      <Table
        list={data.list}
        props={tableProps}
        isNotData={!loading && !data.list.length}
        tableStyle={{ margin: '20px 0' }}
      />
      <RenderJudge
        value={pagination.totalPage}
        active={(
          <Pagination
            page={pagination.current}
            count={pagination.totalPage}
            onChange={(e, p) => pagination.changeCurrent(p)}
          />
        )}
      />
    </>
  );
};

ExchangeDetails.propTypes = {
  withdrawType: PropTypes.number.isRequired
};

export default ExchangeDetails;
