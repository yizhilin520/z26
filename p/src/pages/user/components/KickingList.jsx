import React, { useRef, useState } from 'react';
import Pagination from '@material-ui/lab/Pagination';
import { withStyles } from '@material-ui/core/styles';
import { useRequest } from '@/utils/hooks';
import {timeFormat} from '@/utils/regular';
import {
    getUnkickOutUser,
    getUserKickOutTime
} from '@/servers/userServer';
import { HttpCode } from '@/enums';
import RenderJudge from '@/components/RenderJudge';
import Iconfont from '@/components/Iconfont';
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@/components/Select';
import Table from './Table';
import Form from './Form';
import AddKick from './AddKick';

import styles from '../style/FansPage.scss';

const CustomPage = withStyles(() => ({
  root: {
    margin: '20px'
  },
  ul: {
    justifyContent: 'flex-end'
  }
}))(Pagination);

const KickingList = () =>{
    const [message, setMessage] = useState(null);
    const [query, setQuery] = useState({ page: 1, size: 10 });
    const [pageCount, setPageCount] = useState(0);
    const { data: list = [], loading, mutate } = useRequest(
      (q) => getUserKickOutTime(q).toPromise(),
      query,
      (d) => {
        const { pages, rows } = d || {};

        setPageCount(pages || 0);
        return rows || [];
      }
    );
    // console.log('list', list)
    const addMuteRef = useRef();
    // input输入回调
    const onQueryChangeHandle = (f, v) => {
      const isInputFlag = v && v.target;
      let val = v;
      if (isInputFlag) val = v.target.value;
      const qy = { ...query, page: 1, [f]: val };
      setQuery(qy);
      return !isInputFlag && mutate(qy);
    };
    // 根据页码重新请求
    const onRequestByPageHandle = (page) => {
      const qy = { ...query, page };
      setQuery(qy);
      return mutate(qy);
    };
    // 解除踢人
    const onUnmuteHandle = async (roomId, userId) => {
      const { data: { code, msg } } = await getUnkickOutUser({ roomId, uid:userId }).toPromise();
      if (HttpCode.SUCCESS === code) return mutate(query);
      return setMessage(msg);
    };
    // 打开新增踢人
    const onOpenAddMuteHandle = () => addMuteRef.current.open();
    const tableProps = [{
      label: '序号',
      width: 70,
      type: 'index'
    }, {
      label: '用户账号',
      value: 'account',
      width: 124
    }, {
      label: '用户昵称',
      value: 'nickname'
    }, {
      label: '踢人时间',
      width: 160,
      value: 'createTime',
      formatter: ({ createTime }) => (timeFormat(Number(createTime)))
    }, {
      label: '踢人理由',
      width: 130,
      value: 'violateTypeMsg'
    }, {
      label: '踢人周期',
      width: 100,
      value: 'forbidTimeTypeMsg'
    }, {
      label: '操作人',
      width: 130,
      value: 'dealUserTypeMsg'
    }, {
      label: '操作',
      width: 100,
      formatter: ({ roomId, userId }) => (<div onClick={() => onUnmuteHandle(roomId, userId)}>解除</div>)
    }];
    // 时长
    const durationList = [{
      label: '全部'
    }, {
      label: '1天',
      value: 0
    }, {
      label: '7天',
      value: 1
    }, {
      label: '1个月',
      value: 2
    }, {
      label: '永久',
      value: 3
    }];
    // 处理人
    const handleList = [{
      label: '全部'
    }, {
      label: '房管',
      value: 0
    }, {
      label: '后台',
      value: 1
    }, {
      label: '主播',
      value: 2
    }];
    return (
      <div className={styles.muteContainer}>
        <div className={styles.headerAdd}>
          <div className={styles.addButton} onClick={onOpenAddMuteHandle}>
            <Iconfont name="jia" className={styles.addIcon} />
            <span>新增踢人</span>
          </div>
        </div>
        <div className={styles.filter}>
          <div className={styles.item}>
            <Form.Item label="用户账号" labelWidth={60}>
              <div className={styles.input}>
                <Form.Input onChange={(e) => onQueryChangeHandle('account', e)} />
              </div>
            </Form.Item>
          </div>
          <div className={styles.item}>
            <Form.Item label="用户昵称" labelWidth={60}>
              <div className={styles.input}>
                <Form.Input onChange={(e) => onQueryChangeHandle('nickname', e)} />
              </div>
            </Form.Item>
          </div>
          <div className={styles.item}>
            <Form.Item label="踢人时长" labelWidth={60}>
              <div className={styles.input}>
                <Select
                  width={130}
                  placeholder="请选择时长"
                  list={durationList}
                  value={query.forbidTimeType}
                  onChange={(v) => onQueryChangeHandle('forbidTimeType', v)}
                />
              </div>
            </Form.Item>
          </div>
          <div className={styles.item}>
            <Form.Item label="操作人员" labelWidth={60}>
              <div className={styles.input}>
                <Select
                  width={130}
                  list={handleList}
                  value={query.dealUserType}
                  onChange={(v) => onQueryChangeHandle('dealUserType', v)}
                />
              </div>
            </Form.Item>
          </div>
          <div className={styles.item}>
            <div className={styles.query} onClick={() => onRequestByPageHandle(1)}>查询</div>
          </div>
        </div>
        <Table list={list} props={tableProps} isNotData={!loading && !list.length} />
        <RenderJudge
          value={pageCount}
          active={(<CustomPage page={query.page} count={pageCount} onChange={(e, page) => onRequestByPageHandle(page)} />)}
        />
        <AddKick ref={addMuteRef} onSubmit={() => onRequestByPageHandle(1)} />
        <Snackbar
          autoHideDuration={1000}
          onClose={() => setMessage(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={!!message}
          message={message}
          key="default"
        />
      </div>
    );

}

export default KickingList