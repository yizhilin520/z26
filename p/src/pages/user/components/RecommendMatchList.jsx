import React, { forwardRef, useImperativeHandle, useState, useRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useRequest, useSafeState } from '@/utils/hooks';
import { useSelector } from 'react-redux';
import ClassNames from 'classnames';
import Snackbar from '@material-ui/core/Snackbar';
import { setForecastStatus, getPlanListForForecast } from '@/servers/userServer';
import { HttpCode } from '@/enums';
import Table from './Table';
import Form from './Form';
import Select from '@/components/Select';
import Dialog from './Dialog';
import ConfirmDialog from '@/pages/forecast/components/ConfirmDialog';
import RenderJudge from '@/components/RenderJudge';

import styles from '../style/RecommendMatchList.scss';

const CustomDialog = withStyles(() => ({
  paper: {
    boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.06)'
  }
}))(Dialog);

const RecomMatchList = forwardRef(({ onChange }, ref) => {
  const [visible, setVisible] = useSafeState(false);
  const [message, setMessage] = useState(null);
  const [isSelf, setIsSelf] = useState(false);
  const [forecastList, setForecastList] = useState([]);
  const [expertName, setExpertName] = useState('');
  const [operatePlan, setOperatePlan] = useState({});
  const userInfo = useSelector((state) => state.user.userInfo);
  const confirmRef = useRef();

  const { data, loading, mutate } = useRequest(
    (q) => getPlanListForForecast(q).toPromise(),
    {userId: userInfo.uid},
    (d) => {
      const arr = isSelf ? d.selfPlans : d.platformPlans
      setForecastList(arr || [])
    },
    { useManual: true }
  );

  // 打开
  const onOpenHandle = () => {
    setVisible(true);
    return mutate();
  };
  // 关闭
  const onCloseHandle = () => setVisible(false);

  useImperativeHandle(ref, () => ({
    open: onOpenHandle,
    close: onCloseHandle
  }));

  const handlePlanType = (flag) => {
    const arr = flag ? data.selfPlans : data.platformPlans
    setIsSelf(flag)
    setExpertName('')
    setForecastList(arr || [])
  };

  const onFilterList = () => {
    let arr = isSelf ? data.selfPlans : data.platformPlans
    if (expertName) {
      arr = arr.filter(item => item.name.includes(expertName))
    }
    setForecastList(arr)
  };

  const onConfirmOpen = (data) => {
    confirmRef.current.open();
    setOperatePlan(data);
  };

  const handleProductStatus = async () => {
    const { planId, forecastStatus } = operatePlan
    const {
      data: { code, msg }
    } = await setForecastStatus({
      planId,
      userId: userInfo.uid,
      status: forecastStatus > 0 ? -1 : 1
    }).toPromise();

    if (HttpCode.SUCCESS === code) {
      onChange();
      setMessage(forecastStatus > 0 ? '下架成功' : '上架成功');
      return mutate();
    }
    setMessage(msg);
  };

  // order 排序顺序 -1降序 0升序 1默认
  const handleSortList = (key, order) => {
    let arr = data.platformPlans
    if (order !== 1) {
      arr = data.platformPlans.map(item => item).sort((a, b) => {
        const diff = a[key] - b[key]
        return order === -1 ? -diff : diff
      })
    }
    setForecastList(arr)
  };

  const tableProps = [
    {
      label: '专家信息',
      value: 'matchTime',
      width: 231,
      formatter: ({ name, redNum, numM, numN, rate }) => (
        <div className={styles.expertInfo}>
          <div>{name}</div>
          <div className={styles.achievement}>
            <RenderJudge
              value={numM && numN}
              active={(<div>{`近${numM}中${numN}`}</div>)}
            />
            <RenderJudge
              value={redNum}
              active={(<div>&nbsp;&nbsp;{`${redNum}连红`}</div>)}
            />
            <RenderJudge
              value={rate}
              active={(<div>&nbsp;&nbsp;{`${rate}%命中率`}</div>)}
            />
          </div>
        </div>
      )
    },
    {
      label: '商品信息',
      formatter: ({ matchInfoString }) => {
        const arr = matchInfoString.split('；')
        return (
          <div className={styles.matchInfo}>
            {
              arr.map((item, index) => (
                <div key={index} className={styles.matchItemInfo} title={item}>{item}</div>
              ))
            }
          </div>
        )
      }
    },
    {
      label: '商品价格',
      width: 80,
      value: 'price'
    },
    {
      label: '商品佣金',
      width: 120,
      value: 'fee',
      sortKey: 'fee'
    },
    {
      label: '商品状态',
      width: 120,
      formatter: ({ closeStatus }) => (
        <div>
          {closeStatus === 1 ? '在售' : '已截止'}
        </div>
      )
    },
    {
      label: '操作',
      width: 158,
      formatter: (data) => (
        <div
          className={styles.operateBtn}
          onClick={() => onConfirmOpen(data)}
        >
          {data.forecastStatus <= 0 ? '上架' : '下架'}
        </div>
      )
    }
  ];

  const typeList = [
    {
      label: '平台',
      value: false
    },
    {
      label: '自己',
      value: true
    }
  ];
  
  return (
    <CustomDialog
      width={1000}
      visible={visible}
      onClose={onCloseHandle}
    >
      <div className={styles.container}>
        <div className={styles.title}>新建商品</div>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <div className={styles.item}>
              <span className={styles.selectType}>类型：</span>
              <Select
                width={113}
                list={typeList}
                value={isSelf}
                inputStyle={{height: '26px', fontSize: '12px'}}
                onChange={val => handlePlanType(val)}
              />
            </div>
            <RenderJudge
              value={isSelf}
              active={<></>}
              inactive={(
                <div className={styles.item}>
                  <Form.Input
                    placeholder="搜索专家名称"
                    type="text"
                    style={{height: '26px', width: '240px', fontSize: '12px'}}
                    value={expertName}
                    onChange={(e) => setExpertName(e.target.value)}
                  />
                  <div className={styles.searchBtn} onClick={onFilterList}>
                    搜索
                  </div>
                </div>
              )}
            />
          </div>
          <div className={styles.content}>
            <Table
              list={forecastList}
              props={isSelf ? tableProps.filter(item => item.label !== '商品佣金') : tableProps }
              isNotData={!forecastList.length && !loading}
              bodyCellStyle={{height: '72px', lineHeight: '72px'}}
              onSort={handleSortList}
            />
          </div>
        </div>
      </div>
      <Snackbar
        autoHideDuration={2000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={!!message}
        message={message}
        key="default"
      />
      <ConfirmDialog ref={confirmRef} onConfirm={handleProductStatus} text={`您确定${operatePlan.forecastStatus <= 0 ? '上架' : '下架'}该商品吗？`} />
    </CustomDialog>
  );
});

export default RecomMatchList;
