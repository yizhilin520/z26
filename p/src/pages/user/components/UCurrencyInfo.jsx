import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import dayJs from 'dayjs';
import ClassNames from 'classnames';
import { useRequest, useSafeState } from '@/utils/hooks';
import {
  getAnchorOtherIncome,
  getCommerceIncome,
  getExpenditureRecord,
  getGiftRevenueRecord,
  getQueryUGoldRecharge
} from '@/servers/userServer';
import Pagination from '@material-ui/lab/Pagination';
import { withStyles } from '@material-ui/core/styles';
import Iconfont from '@/components/Iconfont';
import RenderJudge from '@/components/RenderJudge';
import DatePicker, { registerLocale } from 'react-datepicker';
import { zhCN } from 'date-fns/locale';
import RechargeMethodSelect from './RechargeMethodSelect';
import Table from './Table';

import 'react-datepicker/dist/react-datepicker.css';
import '@/components/datePicker/date.scss';

import styles from '../style/UCurrencyInfo.scss';

registerLocale('zhCN', zhCN);

const CustomPage = withStyles(() => ({
  root: {
    margin: '20px'
  },
  ul: {
    justifyContent: 'flex-end'
  }
}))(Pagination);

// 充值记录(收益记录)
const RechargeRecord = () => {
  const { roomId } = useSelector(({ user }) => user.userInfo || {});
  const [query, setQuery] = useState({ page: 1, size: 10 });
  const [pageCount, setPageCount] = useState(0);

  // 是否是主播
  const isAnchor = !!roomId;

  const { data: list = [], loading, mutate } = useRequest(
    (q) => getQueryUGoldRecharge(q).toPromise(),
    query,
    (d) => {
      const { pages, rows } = d || {};

      setPageCount(pages || 0);
      return rows || [];
    }
  );
  const tableProps = [{
    label: '序号',
    width: 82,
    type: 'index'
  }, {
    label: '订单号',
    value: 'orderNo'
  }, {
    label: isAnchor ? '充值方式' : '订单名称',
    width: 126,
    formatter: ({ rechargeType, orderName }) => (isAnchor ? (['微信', '支付宝'][rechargeType]) : orderName)
  }, {
    label: isAnchor ? '充值数量' : '收益方式',
    width: 126,
    value: isAnchor ? 'amount' : 'typeText'
  }, {
    label: isAnchor ? '支付人民币' : '收益数量',
    width: 144,
    value: isAnchor ? 'money' : 'amount'
  }, {
    label: '订单时间',
    width: 160,
    value: 'createTime'
  }, {
    label: '订单状态',
    width: 124,
    formatter: ({ orderStatus }) => (['处理中', '已失效', '已成功'][orderStatus])
  }];
  const payList = [{
    label: '全部'
  }, {
    label: isAnchor ? '微信' : '充值',
    value: 0
  }, {
    label: isAnchor ? '支付宝' : '退款',
    value: 1
  }];

  // 翻页
  const onPageHandle = (event, page) => {
    const qy = { ...query, page };
    setQuery(qy);
    return mutate(qy);
  };
  // 类型切换
  const onPayChangeHandle = (obj) => {
    const qy = {
      ...query,
      ...obj,
      page: 1
    };
    setQuery(qy);
    return mutate(qy);
  };
  // 时间切换验证是否要请求
  const onTimeChangeJudgeRequest = (q) => {
    if (!q.beginDate || !q.endDate) return;

    return mutate(q);
  };
  // 开始时间切换
  const onStartTimeChangeHandle = (date) => {
    const qy = {
      ...query,
      page: 1,
      beginDate: dayJs(date).format('YYYY-MM-DD')
    };
    setQuery(qy);
    return onTimeChangeJudgeRequest(qy);
  };
  // 结束时间切换
  const onEndTimeChangeHandle = (date) => {
    const qy = {
      ...query,
      page: 1,
      endDate: dayJs(date).format('YYYY-MM-DD')
    };
    setQuery(qy);
    return onTimeChangeJudgeRequest(qy);
  };

  return (
    <>
      <div className={styles.filter}>
        <RenderJudge
          value={isAnchor}
          active={(
            <RechargeMethodSelect
              icon="chongzhi"
              label="充值方式"
              value={query.rechargeType}
              list={payList}
              onChange={(rechargeType) => onPayChangeHandle({ rechargeType })}
            />
          )}
          inactive={(
            <RechargeMethodSelect
              icon="chongzhi"
              label="收益方式"
              value={query.type}
              list={payList}
              onChange={(type) => onPayChangeHandle({ type })}
            />
          )}
        />
        <div className={styles.timer}>
          <Iconfont name="rili" className={styles.icon} />
          <div className={styles.label}>时间筛选：</div>
          <div className={styles.select}>
            <DatePicker
              value={query.beginDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="开始日期"
              locale="zhCN"
              onChange={onStartTimeChangeHandle}
            />
          </div>
          <div className={styles.select}>
            <DatePicker
              value={query.endDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="结束日期"
              locale="zhCN"
              onChange={onEndTimeChangeHandle}
              popperModifiers={{
                offset: {
                  enabled: true,
                  offset: '-150px'
                }
              }}
            />
          </div>
        </div>
      </div>
      <Table list={list} props={tableProps} isNotData={!loading && !list.length} />
      <RenderJudge
        value={pageCount}
        active={(<CustomPage page={query.page} count={pageCount} onChange={onPageHandle} />)}
      />
    </>
  );
};

// 支出记录
const OutlayRecord = () => {
  const [query, setQuery] = useState({ page: 1, size: 10 });
  const [pageCount, setPageCount] = useState(0);
  const { data: list = [], loading, mutate } = useRequest(
    (q) => getExpenditureRecord(q).toPromise(),
    query,
    (d) => {
      const { pages, rows } = d || {};

      setPageCount(pages || 0);
      return rows || [];
    }
  );
  const tableProps = [{
    label: '序号',
    width: 82,
    type: 'index'
  }, {
    label: '订单号',
    value: 'orderNo'
  }, {
    label: '订单名称',
    width: 126,
    value: 'giftName'
  }, {
    label: '订单数量',
    width: 100,
    value: 'amount'
  }, {
    label: '金币支出',
    width: 100,
    value: 'payOut'
  }, {
    label: '支出方式',
    width: 80,
    value: 'typeText'
  }, {
    label: '收益人',
    width: 152,
    value: 'anchorName'
  }, {
    label: '支出时间',
    width: 140,
    value: 'sendTime'
  }];
  const giftList = [{
    label: '全部'
  }, {
    label: '礼物',
    value: 0
  }, {
    label: '预测',
    value: 1
  }];

  // 翻页
  const onPageHandle = (event, page) => {
    const qy = { ...query, page };
    setQuery(qy);
    return mutate(qy);
  };
  // 礼物类型切换
  const onGiftChangeHandle = (type) => {
    const qy = {
      ...query,
      page: 1,
      type
    };
    setQuery(qy);
    return mutate(qy);
  };
  // 时间切换验证是否要请求
  const onTimeChangeJudgeRequest = (q) => {
    if (!q.beginDate || !q.endDate) return;

    return mutate(q);
  };
  // 开始时间切换
  const onStartTimeChangeHandle = (date) => {
    const qy = {
      ...query,
      page: 1,
      beginDate: dayJs(date).format('YYYY-MM-DD')
    };
    setQuery(qy);
    return onTimeChangeJudgeRequest(qy);
  };
  // 结束时间切换
  const onEndTimeChangeHandle = (date) => {
    const qy = {
      ...query,
      page: 1,
      endDate: dayJs(date).format('YYYY-MM-DD')
    };
    setQuery(qy);
    return onTimeChangeJudgeRequest(qy);
  };

  return (
    <>
      <div className={styles.filter}>
        <RechargeMethodSelect
          icon="chongzhi"
          label="支出方式"
          value={query.type}
          list={giftList}
          onChange={onGiftChangeHandle}
        />
        <div className={styles.timer}>
          <Iconfont name="rili" className={styles.icon} />
          <div className={styles.label}>时间筛选：</div>
          <div className={styles.select}>
            <DatePicker
              value={query.beginDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="开始日期"
              locale="zhCN"
              onChange={onStartTimeChangeHandle}
            />
          </div>
          <div className={styles.select}>
            <DatePicker
              value={query.endDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="结束日期"
              locale="zhCN"
              onChange={onEndTimeChangeHandle}
              popperModifiers={{
                offset: {
                  enabled: true,
                  offset: '-150px'
                }
              }}
            />
          </div>
        </div>
      </div>
      <Table list={list} props={tableProps} isNotData={!loading && !list.length} />
      <RenderJudge
        value={pageCount}
        active={(<CustomPage page={query.page} count={pageCount} onChange={onPageHandle} />)}
      />
    </>
  );
};

// 礼物收益
const GiftIncome = () => {
  const { uid } = useSelector(({ user }) => user.userInfo || {});
  const [query, setQuery] = useSafeState({ uid, pageNo: 1, limit: 10 });
  const [pageCount, setPageCount] = useState(0);
  const { data = {}, loading, mutate } = useRequest(
    (q) => getGiftRevenueRecord(q).toPromise(),
    query,
    (d) => {
      const rData = d || {};
      setPageCount(rData.totalPages || 0);
      return rData;
    }
  );
  const list = data.data || [];

  const tableProps = [{
    label: '序号',
    width: 82,
    type: 'index'
  }, {
    label: '收礼时间',
    value: 'createTime'
  }, {
    label: '礼物名称',
    value: 'giftName'
  }, {
    label: '礼物数量',
    width: 126,
    value: 'amount'
  }, {
    label: '礼物价值',
    width: 144,
    value: 'purchasePrice'
  }, {
    label: '赠送人',
    width: 160,
    value: 'giverNickName'
  }];

  // 翻页
  const onPageHandle = (event, pageNo) => {
    const qy = { ...query, pageNo };
    setQuery(qy);
    return mutate(qy);
  };
  // 时间切换验证是否要请求
  const onTimeChangeJudgeRequest = (q) => {
    if (!q.startTime || !q.endTime) return;

    return mutate(q);
  };
  // 开始时间切换
  const onStartTimeChangeHandle = (date) => {
    const qy = {
      ...query,
      pageNo: 1,
      startTime: dayJs(date).format('YYYY-MM-DD')
    };
    setQuery(qy);
    return onTimeChangeJudgeRequest(qy);
  };
  // 结束时间切换
  const onEndTimeChangeHandle = (date) => {
    const qy = {
      ...query,
      pageNo: 1,
      endTime: dayJs(date).format('YYYY-MM-DD')
    };
    setQuery(qy);
    return onTimeChangeJudgeRequest(qy);
  };

  return (
    <>
      <div className={styles.filter}>
        <div className={styles.item} />
        <div className={styles.timer}>
          <Iconfont name="rili" className={styles.icon} />
          <div className={styles.label}>时间筛选：</div>
          <div className={styles.select}>
            <DatePicker
              value={query.startTime}
              dateFormat="yyyy-MM-dd"
              placeholderText="开始日期"
              locale="zhCN"
              onChange={onStartTimeChangeHandle}
            />
          </div>
          <div className={styles.select}>
            <DatePicker
              value={query.endTime}
              dateFormat="yyyy-MM-dd"
              placeholderText="结束日期"
              locale="zhCN"
              onChange={onEndTimeChangeHandle}
              popperModifiers={{
                offset: {
                  enabled: true,
                  offset: '-150px'
                }
              }}
            />
          </div>
        </div>
      </div>
      <Table list={list} props={tableProps} isNotData={!loading && !list.length} />
      <RenderJudge
        value={pageCount}
        active={(<CustomPage page={query.page} count={pageCount} onChange={onPageHandle} />)}
      />
    </>
  );
};
// 带货收益
const SellGoodsIncome = () => {
  const { uid } = useSelector(({ user }) => user.userInfo || {});
  const [query, setQuery] = useSafeState({ anchorId: uid, pageNo: 1, limit: 10 });
  const [pageCount, setPageCount] = useState(0);
  const { data = {}, loading, mutate } = useRequest(
    (q) => getCommerceIncome(q).toPromise(),
    query,
    (d) => {
      const rData = d || {};
      setPageCount(rData.totalPages || 0);
      return rData;
    }
  );
  const list = data.data || [];

  const tableProps = [{
    label: '序号',
    width: 82,
    type: 'index'
  }, {
    label: '订单时间',
    value: 'dealTime',
    width: 160
  }, {
    label: '订单号',
    value: 'planId',
    width: 120
  }, {
    label: '订单名称',
    value: 'matchInfoString'
  }, {
    label: '订单价格',
    width: 120,
    value: 'dealPrice'
  }, {
    label: '佣金',
    width: 120,
    value: 'anchorCommission'
  }, {
    label: '购买用户',
    width: 160,
    value: 'nickName'
  }];

  // 翻页
  const onPageHandle = (event, pageNo) => {
    const qy = { ...query, pageNo };
    setQuery(qy);
    return mutate(qy);
  };
  // 时间切换验证是否要请求
  const onTimeChangeJudgeRequest = (q) => {
    if (!q.startTime || !q.endTime) return;

    return mutate(q);
  };
  // 开始时间切换
  const onStartTimeChangeHandle = (date) => {
    const qy = {
      ...query,
      pageNo: 1,
      startTime: dayJs(date).format('YYYY-MM-DD')
    };
    setQuery(qy);
    return onTimeChangeJudgeRequest(qy);
  };
  // 结束时间切换
  const onEndTimeChangeHandle = (date) => {
    const qy = {
      ...query,
      pageNo: 1,
      endTime: dayJs(date).format('YYYY-MM-DD')
    };
    setQuery(qy);
    return onTimeChangeJudgeRequest(qy);
  };

  return (
    <>
      <div className={styles.filter}>
        <div className={styles.item} />
        <div className={styles.timer}>
          <Iconfont name="rili" className={styles.icon} />
          <div className={styles.label}>时间筛选：</div>
          <div className={styles.select}>
            <DatePicker
              value={query.startTime}
              dateFormat="yyyy-MM-dd"
              placeholderText="开始日期"
              locale="zhCN"
              onChange={onStartTimeChangeHandle}
            />
          </div>
          <div className={styles.select}>
            <DatePicker
              value={query.endTime}
              dateFormat="yyyy-MM-dd"
              placeholderText="结束日期"
              locale="zhCN"
              onChange={onEndTimeChangeHandle}
              popperModifiers={{
                offset: {
                  enabled: true,
                  offset: '-150px'
                }
              }}
            />
          </div>
        </div>
      </div>
      <Table list={list} props={tableProps} isNotData={!loading && !list.length} />
      <RenderJudge
        value={pageCount}
        active={(<CustomPage page={query.page} count={pageCount} onChange={onPageHandle} />)}
      />
    </>
  );
};

const OtherIncome = () => {
  const [query, setQuery] = useSafeState({ page: 1, size: 10 });
  const [pageCount, setPageCount] = useState(0);
  const { data = {}, loading, mutate } = useRequest(
    (q) => getAnchorOtherIncome(q).toPromise(),
    query,
    (d) => {
      const rData = d || {};
      setPageCount(rData.pages || 0);
      return rData;
    }
  );

  const list = data.rows || [];

  const tableProps = [{
    label: '序号',
    width: 82,
    type: 'index'
  }, {
    label: '订单号',
    value: 'orderNo',
    width: 160
  }, {
    label: '订单名称',
    value: 'orderName'
  }, {
    label: '收益方式',
    width: 120,
    value: 'typeText'
  }, {
    label: '收益数量',
    width: 120,
    value: 'money'
  }, {
    label: '订单时间',
    width: 160,
    value: 'createTime'
  }, {
    label: '订单状态',
    width: 124,
    formatter: ({ orderStatus }) => (['处理中', '已失效', '已成功'][orderStatus])
  }];

  // 翻页
  const onPageHandle = (event, page) => {
    const qy = { ...query, page };
    setQuery(qy);
    return mutate(qy);
  };
  // 时间切换验证是否要请求
  const onTimeChangeJudgeRequest = (q) => {
    if (!q.beginDate || !q.endDate) return;

    return mutate(q);
  };
  // 开始时间切换
  const onStartTimeChangeHandle = (date) => {
    const qy = {
      ...query,
      pageNo: 1,
      beginDate: dayJs(date).format('YYYY-MM-DD')
    };
    setQuery(qy);
    return onTimeChangeJudgeRequest(qy);
  };
  // 结束时间切换
  const onEndTimeChangeHandle = (date) => {
    const qy = {
      ...query,
      pageNo: 1,
      endDate: dayJs(date).format('YYYY-MM-DD')
    };
    setQuery(qy);
    return onTimeChangeJudgeRequest(qy);
  };

  return (
    <>
      <div className={styles.filter}>
        <div className={styles.item} />
        <div className={styles.timer}>
          <Iconfont name="rili" className={styles.icon} />
          <div className={styles.label}>时间筛选：</div>
          <div className={styles.select}>
            <DatePicker
              value={query.beginDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="开始日期"
              locale="zhCN"
              onChange={onStartTimeChangeHandle}
            />
          </div>
          <div className={styles.select}>
            <DatePicker
              value={query.endDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="结束日期"
              locale="zhCN"
              onChange={onEndTimeChangeHandle}
              popperModifiers={{
                offset: {
                  enabled: true,
                  offset: '-150px'
                }
              }}
            />
          </div>
        </div>
      </div>
      <Table list={list} props={tableProps} isNotData={!loading && !list.length} />
      <RenderJudge
        value={pageCount}
        active={(<CustomPage page={query.page} count={pageCount} onChange={onPageHandle} />)}
      />
    </>
  );
};

const UCurrencyInfo = () => {
  const [selectIndex, setSelectIndex] = useState(0);
  const { roomId } = useSelector(({ user }) => user.userInfo || {});

  // 是否是主播
  const isAnchor = !!roomId;

  const list = [{
    label: '收益记录',
    component: (<RechargeRecord />)
  }, {
    label: '礼物收益',
    component: (<GiftIncome />)
  }, {
    label: '带货收益',
    component: (<SellGoodsIncome />)
  }, {
    label: '支出记录',
    component: (<OutlayRecord />)
  }, isAnchor && {
    label: '其他收益',
    component: (<OtherIncome />)
  }].filter(Boolean);

  const currentComponent = list[selectIndex].component;
  return (
    <>
      <div className={styles.tabs}>
        {list.map((row, index) => (
          <div
            className={ClassNames(styles.item, { [styles.isActive]: selectIndex === index })}
            onClick={() => setSelectIndex(index)}
            key={index}
          >
            {row.label}
          </div>
        ))}
      </div>
      {currentComponent}
    </>
  );
};

export default UCurrencyInfo;
