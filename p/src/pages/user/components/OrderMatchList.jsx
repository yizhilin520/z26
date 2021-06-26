import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useRequest, useSafeState } from '@/utils/hooks';
import { useSelector } from 'react-redux';
import ClassNames from 'classnames';
import dayjs from 'dayjs';
import Select from '@/components/Select';
import Snackbar from '@material-ui/core/Snackbar';
import { getAnchorMatchApply, getAnchorMatchList } from '@/servers/userServer';
import { HttpCode } from '@/enums';
import Table from './Table';
import Form from './Form';
import Dialog from './Dialog';
import MatchPlayAddress from './MatchPlayAddress';

import styles from '../style/OrderMatchList.scss';

const CustomDialog = withStyles(() => ({
  paper: {
    boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.06)'
  }
}))(Dialog);

const dateFormater = (val) => val.replace(/\-/g, '');
let timer = null;
const OrderMatchList = forwardRef(({ ballType, onChange }, ref) => {
  const [visible, setVisible] = useSafeState(false);
  const [message, setMessage] = useState(null);
  const [matchList, setMatchList] = useState([]);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [query, setQuery] = useState({
    date: dateFormater(dayjs().format('YYYY-MM-DD')),
    sportId: 1,
    status: 1,
    userId: userInfo.uid
  });
  const matchPlayAddressRef = useRef();

  const { data: list = [], loading, mutate } = useRequest(
    (q) => getAnchorMatchList(q).toPromise(),
    query,
    (d) => d || [],
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

  const dateList = [
    {
      label: dayjs().format('MM-DD'),
      value: dateFormater(dayjs().format('YYYY-MM-DD'))
    },
    {
      label: dayjs().add(1, 'day').format('MM-DD'),
      value: dateFormater(dayjs().add(1, 'day').format('YYYY-MM-DD'))
    },
    {
      label: dayjs().add(2, 'day').format('MM-DD'),
      value: dateFormater(dayjs().add(2, 'day').format('YYYY-MM-DD'))
    },
    {
      label: dayjs().add(3, 'day').format('MM-DD'),
      value: dateFormater(dayjs().add(3, 'day').format('YYYY-MM-DD'))
    },
    {
      label: dayjs().add(4, 'day').format('MM-DD'),
      value: dateFormater(dayjs().add(4, 'day').format('YYYY-MM-DD'))
    },
    {
      label: dayjs().add(5, 'day').format('MM-DD'),
      value: dateFormater(dayjs().add(5, 'day').format('YYYY-MM-DD'))
    },
    {
      label: dayjs().add(6, 'day').format('MM-DD'),
      value: dateFormater(dayjs().add(6, 'day').format('YYYY-MM-DD'))
    }
  ];
  const typeList = [
    {
      label: '足球',
      value: 1
    },
    {
      label: '篮球',
      value: 2
    }
  ];

  // 对象数组去重
  const unique = (arr) => {
    const strings = arr.map((item) => JSON.stringify(item));
    const removeDupList = [...new Set(strings)];
    const result = removeDupList.map((item) => JSON.parse(item));
    return result;
  };

  useEffect(() => {
    const temArr = list.map((item) => ({
      label: item.tournamentName,
      value: item.tournamentId
    }));
    setMatchList(unique(temArr));
  }, [list?.length]);

  useEffect(() => () => {
    timer && clearTimeout(timer);
  }, []);

  const onQueryChangeHandle = (f, v) => {
    const val = v;
    const qy = { ...query, [f]: val };
    setQuery(qy);
    return mutate(qy);
  };

  const handleAnchorMatchApply = async ({ matchId, matchTime, userApply }) => {
    console.log('userApply', userApply);
    // 所有赛事开赛前一小时不可预约
    let index;
    index = list.findIndex((it) => it.matchId === matchId);
    if (matchTime - Date.now() <= 3600 * 1000) {
      timer = setTimeout(() => {
        list.splice(index, 1);
      }, 1000);
      return setMessage('此赛事还有一小时开始，不可预约');
    }
    const {
      data: { code, msg }
    } = await getAnchorMatchApply({
      matchId,
      matchTime,
      uid: userInfo.uid,
      status: userApply > 0 ? -1 : 1
    }).toPromise();

    if (HttpCode.SUCCESS === code) {
      onChange();
      setMessage(userApply > 0 ? '已取消预约' : '预约成功');
      return mutate(query);
    }

    setMessage(msg);
  };

  const tableProps = [
    {
      label: '时间',
      value: 'matchTime',
      width: 130,
      formatter: ({ matchTime }) => (
        <div>{dayjs(matchTime).format('YYYY-MM-DD HH:mm')}</div>
      )
    },
    {
      label: '类型',
      formatter: ({ sportId }) => <div>{ballType[sportId]}</div>
    },
    {
      label: '赛事',
      value: 'tournamentName'
    },
    {
      label: '场次',
      width: 280,
      formatter: ({ homeTeamName, awayTeamName }) => (
        <div>{`${homeTeamName} VS ${awayTeamName}`}</div>
      )
    },
    {
      label: '赛事状态',
      formatter: ({ applys, matchId }) => (
        <div>
          {applys}
          人预约
        </div>
      )
    },
    {
      label: '管理',
      formatter: (data) => (
        <div className={styles.tableHandle}>
          <div
            className={ClassNames(data.userApply <= 0 ? styles.order : styles.successOrder)}
            onClick={() => handleAnchorMatchApply(data)}
          >
            {data.userApply <= 0 ? '预约' : '取消预约'}
          </div>
          <div className={styles.order} onClick={() => matchPlayAddressRef.current.open(data.matchId)}>查看流</div>
        </div>
      )
    }
  ];

  return (
    <CustomDialog
      width={1000}
      visible={visible}
      onClose={onCloseHandle}
    >
      <div className={styles.container}>
        <div className={styles.title}>预约比赛</div>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <div className={styles.item}>
              <Form.Item label="预约时间：" labelWidth={80}>
                <div className={styles.input}>
                  <Select
                    width={130}
                    list={dateList}
                    value={query.date}
                    onChange={(v) => onQueryChangeHandle('date', v)}
                  />
                </div>
              </Form.Item>
            </div>
            <div className={styles.item}>
              <Form.Item label="预约类型：" labelWidth={80}>
                <div className={styles.input}>
                  <Select
                    width={130}
                    list={typeList}
                    value={query.sportId}
                    onChange={(v) => onQueryChangeHandle('sportId', v)}
                  />
                </div>
              </Form.Item>
            </div>
            <div className={styles.item}>
              <Form.Item label="预约赛事：" labelWidth={80}>
                <div className={styles.input}>
                  <Select
                    width={130}
                    list={matchList}
                    value=""
                    // onChange={(v) => onQueryChangeHandle("dealUserType", v)}
                  />
                </div>
              </Form.Item>
            </div>

            <div className={styles.text}>
              共查询
              {list?.length || 0}
              {' '}
              场比赛
            </div>
          </div>
          <div className={styles.content}>
            <Table
              list={list}
              props={tableProps}
              isNotData={!list.length && !loading}
              style={{ margin: 0 }}
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
      <MatchPlayAddress ref={matchPlayAddressRef} />
    </CustomDialog>
  );
});

export default OrderMatchList;
