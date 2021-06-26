import React from 'react';
import { useSelector } from 'react-redux';
import dayJs from 'dayjs';
import { scoreDataFormat } from '@/utils/common';
import { useLogin, useRequest, useSafeState } from '@/utils/hooks';
import { addMatchFollow, cancelMatchFollow, getMatch, getMatchFollowList } from '@/servers/scoreServer';
import { getLocalTopObject, setLocalTop } from '../utils/common';
import { Context } from '../utils/store';

const Provider = ({ children }) => {
  const { uid } = useSelector(({ user }) => user.userInfo);
  const [matchList, setMatchList] = useSafeState([]);
  const [keepList, setKeepList] = useSafeState([]);
  const [keepObject, setKeepObject] = useSafeState({});
  const [query, setQuery] = useSafeState({ sport_id: 2, date: dayJs().format('YYYYMMDD') });
  const [sortType, setSortType] = useSafeState('time');
  const [topObject, setTopObject] = useSafeState(getLocalTopObject());
  const [selectObject, setSelectObject] = useSafeState({});
  const [hiddenObject, setHiddenObject] = useSafeState({});
  const { isLogin, login: loginHandle } = useLogin();
  // 列表数据
  const { loading: matchListLoading, mutate: matchListMutate } = useRequest(
    (q) => getMatch(q).toPromise(),
    query,
    (d) => {
      setMatchList((d || []).map(scoreDataFormat));
      setSelectObject({});
    }
  );
  // 关注数据
  const { loading: matchFollowLoading, mutate: matchFollowMutate } = useRequest(
    (q) => isLogin && getMatchFollowList(q).toPromise(),
    { userId: uid, sportId: 2 },
    (d) => {
      const list = (d || []).map(scoreDataFormat);
      const obj = {};
      list.forEach(({ eventId }) => {
        obj[eventId] = true;
      });
      setKeepList(list);
      setKeepObject(obj);
      setSelectObject({});
    }
  );
  // 滚动到顶部
  const scrollToTop = () => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };
  // 获取列表数据
  const getMatchHandle = (q) => {
    const reqQuery = { ...query, ...q || {}, sport_id: 2 };
    setQuery(reqQuery);
    return matchListMutate(reqQuery).then(scrollToTop);
  };
  // 获取关注数据
  const getMatchFollowHandle = () => matchFollowMutate({ userId: uid, sportId: 2 }).then(scrollToTop);
  // 设置置顶
  const setTopHandle = (id) => setTopObject(setLocalTop(id));
  // 设置选中
  const setSelectHandle = (id) => {
    const obj = { ...selectObject };
    if (obj[id]) {
      delete obj[id];
    } else {
      obj[id] = true;
    }
    setSelectObject(obj);
  };
  // 清空选中
  const setEmptySelectHandle = () => setSelectObject({});
  // 关注/取关 之前的验证
  const keepBeforeVerify = (id) => {
    // 验证是否登录
    if (!isLogin) {
      loginHandle();
      return;
    }
    const ids = Array.isArray(id) ? id : [id];
    if (!ids.length) return;

    return {
      ids,
      params: {
        matchIds: ids.join(','),
        sportType: 2,
        userId: uid
      }
    };
  };
  // 设置关注
  const setKeepHandle = async (id) => {
    const result = keepBeforeVerify(id);
    if (result) {
      await addMatchFollow(result.params).toPromise();
      const obj = { ...keepObject };
      result.ids.forEach((eventId) => {
        obj[eventId] = true;
      });
      setKeepObject(obj);
    }
  };
  // 取消关注
  const cancelKeepHandle = async (id) => {
    const result = keepBeforeVerify(id);

    if (result) {
      await cancelMatchFollow(result.params).toPromise();
      const obj = { ...keepObject };
      result.ids.forEach((eventId) => {
        delete obj[eventId];
      });
      setKeepObject(obj);
    }
  };
  // 设置隐藏对象
  const setHiddenHandle = (obj) => setHiddenObject(obj || {});
  // 设置数据
  const setListHandle = (d) => setMatchList(d || []);
  const val = {
    // 加载中
    loading: matchListLoading || matchFollowLoading,
    // 请求的原数据列表
    list: matchList,
    // 设置数据
    setList: setListHandle,
    // 获取列表数据
    getMatch: getMatchHandle,
    // 关注数据列表
    keepList,
    // 获取关注数据
    getMatchFollow: getMatchFollowHandle,
    // 隐藏的对象
    hiddenObject,
    // 设置隐藏
    setHidden: setHiddenHandle,
    // 置顶的对象
    topObject,
    // 设置置顶
    setTop: setTopHandle,
    // 关注对象
    keepObject,
    // 设置关注
    setKeep: setKeepHandle,
    // 取消关注
    cancelKeep: cancelKeepHandle,
    // checkbox选择
    selectObject,
    // 设置选择
    setSelect: setSelectHandle,
    // 清空选中
    setEmptySelect: setEmptySelectHandle,
    // 请求参数
    query,
    // 排序方式
    sortType,
    // 设置排序方式
    setSortType
  };
  return (
    <Context.Provider value={val}>
      {children}
    </Context.Provider>
  );
};

export default Provider;
