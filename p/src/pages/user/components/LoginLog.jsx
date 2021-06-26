import React, { useState } from 'react';
import ClassNames from 'classnames';
import Pagination from '@material-ui/lab/Pagination';
import { withStyles } from '@material-ui/core/styles';
import RenderJudge from '@/components/RenderJudge';
import { useRequest } from '@/utils/hooks';
import { getQueryLoginLog } from '@/servers/userServer';

import styles from '../style/LoginLog.scss';

const CustomPage = withStyles(() => ({
  root: {
    marginTop: '20px'
  },
  ul: {
    justifyContent: 'flex-end'
  }
}))(Pagination);

const LoginLog = () => {
  const [query, setQuery] = useState({ page: 1, size: 10 });
  const [pageCount, setPageCount] = useState(0);
  const { data: list = [], loading, mutate } = useRequest(
    (q) => getQueryLoginLog(q).toPromise(),
    query,
    (d) => {
      const { page, pages, rows } = d || {};

      setQuery({ page, size: 10 });
      setPageCount(pages || 0);
      return rows || [];
    }
  );

  // 页面切换
  const onPageHandle = (event, page) => mutate({ ...query, page });

  return (
    <div className={styles.container}>
      <div className={styles.title}>最近登录记录</div>
      <RenderJudge
        value={!loading && !list.length}
        active={(<div className={styles.notData}>暂无数据</div>)}
        inactive={(
          <>
            {list.map((row, index) => (
              <div className={styles.item} key={index}>
                <div className={styles.timer}>{row.lastLoginTime}</div>
                <div className={styles.addr}>{row.ipArea || '未知'}</div>
                <div className={styles.device}>{row.phoneInfo}</div>
                <div
                  className={ClassNames(styles.status, { [styles.isWarning]: row.status !== 0 })}
                >
                  {row.status === 0 ? '正常' : '异常'}
                </div>
              </div>
            ))}
            <RenderJudge
              value={pageCount}
              active={(<CustomPage page={query.page} count={pageCount} onChange={onPageHandle} />)}
            />
          </>
        )}
      />
    </div>
  );
};

export default LoginLog;
