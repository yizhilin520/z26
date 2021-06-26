import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_LOGIN_REDUCER } from '@/actions/userAtion';
import { getMyNews } from '@/servers/userServer';
import { useRequest } from '@/utils/hooks';
import Pagination from '@material-ui/lab/Pagination';
import { withStyles } from '@material-ui/core/styles';
import RenderJudge from '@/components/RenderJudge';
import NotData from '@/components/NotData';
import notice from '../images/notice.png';

import styles from '../style/NewsPage.scss';

const CustomPage = withStyles(() => ({
  root: {
    margin: '20px'
  },
  ul: {
    justifyContent: 'flex-end'
  }
}))(Pagination);

const NewList = ({list, isNotData}) => {
  
  return (
    <div className={styles.wrapper}>
      <RenderJudge
        value={isNotData}
        active={<NotData />}
        inactive={
          list.map((row, index) => {
            return (
              <div key={index} className={styles.row}>
                <div className={styles.icon}><img src={notice} /></div>
                <div className={styles.content}>
                  <div className={styles.top}>
                    <p className={styles.title}>{row.title}</p>
                    <p className={styles.time}>{row.sendTime}</p>
                  </div>
                  <div className={styles.notice}>{row.content}</div>
                </div>
              </div>
            )
          })
        }
      />
    </div>
  )
}

const NewsPage = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(({ user }) => user.userInfo || {});
  const [query, setQuery] = useState({ page: 1, size: 10 });
  const [pageCount, setPageCount] = useState(0);
  const { data: list = [], loading, mutate } = useRequest(
    (q) => getMyNews(q).toPromise(),
    query,
    (d) => {
      const { page, pages, rows } = d || {};
      setPageCount(pages || 0);
      if (page === 1) {
        // 如果是获取最新消息列表，设置我的消息为已读
        dispatch({
          type: `user/${UPDATE_LOGIN_REDUCER}`,
          payload: {
            data: {
              ...userInfo,
              hasStationMsg: 0,
            }
          }
        });
      }
      return rows || [];
    }
  );

  // 翻页
  const onPageHandle = (event, page) => {
    const qy = { ...query, page };
    setQuery(qy);
    return mutate(qy);
  };


  return (
    <div className={styles.container}>
      <div className={styles.label}>我的消息</div>
      <NewList list={list} isNotData={!loading && !list.length}/>
      
      <RenderJudge
        value={pageCount}
        active={(<CustomPage page={query.page} count={pageCount} onChange={onPageHandle} />)}
      />
    </div>
  )
}

export default NewsPage
