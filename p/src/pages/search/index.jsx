import React, { useEffect, useState, useMemo } from 'react';
import { useRequest } from '@/utils/hooks';
import { getRequestUrlParams } from '@/utils/common';
import { searchAnchor, searchRoom } from '@/servers/homeServer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Iconfont from '@/components/Iconfont';
import RenderJudge from '@/components/RenderJudge';
import NotData from '@/components/NotData';
import ListVideoCard from '@/components/ListVideoCard';
import VideoCard from '@/components/VideoCard';
import Image from '@/components/Image';
import history from '@/utils/history';
import { useLocation } from 'react-router-dom';
import { localStorageGet, localStoragePut } from '@/utils/regular';

import ClassNames from 'classnames';
import styles from './search.scss';
import noLiveImg from '@/assets/images/no-live.png';
import UserDefaultImage from '@/assets/images/user_default_image.png';

const SearchPage = ({prop}) => {
  const [activeTab, setActiveTab] = useState(1)
  const [searchKey, setSearchKey] = useState('')

  const anchorParams = { current: 1, size: 15 }
  const roomParams = { current: 1, size: 12 }
  const { data: anchorList = [], mutate: anchorMutate } = useRequest(
    (q) => searchAnchor(q).toPromise(),
    {},
    (d) => d.records || [],
    {useManual: true}
  );
  const { data: roomList = [], mutate: roomMutate } = useRequest(
    (q) => searchRoom(q).toPromise(),
    {},
    (d) => d.records || [],
    {useManual: true}
  );
  const { search } = useLocation()

  // 路由参数变化，包括监听浏览器前进后退动作
  useEffect(() => {
    const { key } = getRequestUrlParams(search)
    getSearchData(key)
    setSearchKey(key)
  }, [search])

  const handleSearch = (searchKey) => {
    const { key } = getRequestUrlParams(search)
    if (key === searchKey) return
    // 修改路由
    history.push(`/search?key=${searchKey}`)
  };

  const getSearchData = (searchKey) => {
    anchorMutate({...anchorParams, searchKey})
    roomMutate({...roomParams, searchKey})
    saveHisData(searchKey)
  };

  const onSearchEnterHandle = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      return handleSearch(searchKey);
    }
  };

  // 保存历史搜索记录
  const saveHisData = (key) => {
    const arr = localStorageGet('searchHistory') || []
    const index = arr.findIndex(item => item === key)
    if (index > -1) arr.splice(index, 1)
    arr.unshift(key)
    // 只保留10条
    if (arr.length > 10) arr.pop()
    localStoragePut('searchHistory', arr)
  };

  const computedAnchorList = useMemo(() => {
    return activeTab === 1 ? anchorList.slice(0, 5) : anchorList
  }, [activeTab, anchorList]);

  const computedRoomList = useMemo(() => {
    return activeTab === 1 ? roomList.slice(0, 4) : roomList
  }, [activeTab, roomList]);

  const changeTab = ({key}) => {
    if (activeTab === key) return
    setActiveTab(key)
  };

  const tabList = [
    {name: '综合', key: 1},
    {name: '主播', key: 2},
    {name: '直播', key: 3},
  ]

  return (
    <main>
      <Header isHome />
      <div className={styles.container}>
        <div className={styles.inputArea}>
          <input
            placeholder="搜索主播、直播间"
            type="text"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            onKeyPress={onSearchEnterHandle}
          />
          <div className={styles.searchBtn} onClick={() => handleSearch(searchKey)}>
            <Iconfont name="search" className={styles.searchIcon} />
            <span>搜索</span>
          </div>
        </div>
        <div className={styles.tabList}>
          {tabList.map(item => {
            return (
              <div
                key={item.key}
                className={ClassNames(styles.tabItem, {[styles.active]: activeTab === item.key})}
                onClick={() => changeTab(item)}
              >{item.name}</div>
            )
          })}

        </div>
        <div className={styles.searchResult}>
          <RenderJudge
            value={
              (activeTab === 1 && !computedAnchorList.length && !computedRoomList.length)
              || (activeTab === 2 && !computedAnchorList.length)
              || (activeTab === 3 && !computedRoomList.length)
            }
            active={<NotData image={noLiveImg} text='暂无相关直播' />}
          />
          <RenderJudge
            value={computedAnchorList.length && (activeTab === 1 || activeTab === 2) }
            active={(
              <div className={styles.resultPart}>
                <div className={styles.partTitle}>
                  <span>相关主播</span>
                  <RenderJudge
                    value={activeTab === 1}
                    active={(
                      <a className={styles.more} href="/live/list" target="_blank">
                        <span>更多</span>
                        <Iconfont name="bq_ee" className={styles.icon} />
                      </a>
                    )}
                  />
                </div>
                <div className={styles.resultList}>
                  {computedAnchorList.map(item => {
                    return (
                      <a key={item.room_id} className={styles.anchorItem} target="_blank" href={`/live/room/${item.room_id}`}>
                        <div className={styles.imgWrapper}>
                          <Image className={styles.headImg} src={item.headImg} defaultImage={UserDefaultImage} />
                          <RenderJudge
                            value={item.room_status == 1}
                            active={<div className={styles.playing}></div>}
                          />
                        </div>
                        <span className={styles.nickName}>{item.nickname}</span>
                        <span className={styles.roomNo}>{`房间号：${item.room_id}`}</span>
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          />
          <RenderJudge
            value={computedRoomList.length && (activeTab === 1 || activeTab === 3)}
            active={(
              <div className={styles.resultPart}>
                <div className={ClassNames(styles.partTitle, styles.liveTitle)}>
                  <span>相关直播</span>
                  <RenderJudge
                    value={activeTab === 1 && !computedAnchorList.length}
                    active={(
                      <a className={styles.more} href="/live/list" target="_blank">
                        <span>更多</span>
                        <Iconfont name="bq_ee" className={styles.icon} />
                      </a>
                    )}
                  />
                </div>
                <div className={styles.resultList}>
                  {
                    <ListVideoCard
                      list={computedRoomList}
                      rows={4}
                      marginLeft={30}
                      marginTop={30}
                      style={{width: '100%', marginTop: '-10px'}}
                      dataFormat={(row) => ({
                        roomId: row[prop.roomId],
                        label: row[prop.title],
                        image: row[prop.roomImg] || row[prop.screenshotUrl],
                        userImage: row[prop.headImage],
                        nickName: row[prop.userName],
                        heat: row[prop.heat],
                        playing: row[prop.status] === 1,
                        tag: VideoCard.tag[row[prop.liveTypeId]],
                        type: row[prop.matchType],
                        target: '_blank'
                      })}
                    />
                  }
                </div>
              </div>
            )}
          />
        </div>
      </div>
      <Footer />
    </main>
  )
};

SearchPage.defaultProps = {
  prop: {
    title: 'title',
    liveTypeId: 'live_type_id',
    userName: 'anchorName',
    roomId: 'room_id',
    matchId: 'match_id',
    status: 'status',
    headImage: 'head_image',
    roomImg: 'room_img',
    screenshotUrl: 'screenshot_url',
    matchType: '',
    heat: 'heat'
  }
};

export default SearchPage;
