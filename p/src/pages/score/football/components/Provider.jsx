import React from 'react';
import { useSelector } from 'react-redux';
import dayJs from 'dayjs';
import { useDocumentVisibility, useInterval, useRequest, useSet, useSetState } from 'ahooks';
import useSafeState from 'ahooks/lib/useSafeState';
import { addMatchFollow, cancelMatchFollow, getMatch, getMatchFollowList } from '@/servers/scoreServer';
import { scoreDataFormat } from '@/utils/common';
import { useSnackbar } from '@/plugins';
import { useLogin } from '@/utils/hooks';
import { HttpCode } from '@/enums';
import { Context } from '../utils/store';

const Provider = ({ children }) => {
  const { uid } = useSelector(({ user }) => user.userInfo || {});
  const { isLogin, login: loginHandle } = useLogin();
  const { enqueueSnackbar } = useSnackbar();

  // 比分开关
  const [scoreSwitch, setScoreSwitch] = useSetState({ asia: true, size: true, europe: false });
  // 排序方式
  const [sortType, setSortType] = useSafeState('timely');
  // 请求的数据列表
  const [list, setList] = useSafeState([]);
  // 请求参数
  const [query, setQuery] = useSafeState({ sport_id: 1, date: dayJs().format('YYYYMMDD') });
  // 关注数据列表
  const [keepList, setKeepList] = useSafeState([]);
  // 置顶的对象
  const [topObject, { add: addTop, remove: removeTop, reset: resetTop }] = useSet();
  // 隐藏的对象
  const [hiddenObject, { add: addHidden, remove: removeHidden, reset: resetHidden }] = useSet();
  // 关注对象
  const [keepObject, { reset: resetKeep, add: addKeep, remove: removeKeep }] = useSet();
  // checkbox选择
  const [selectObject, { reset: resetSelect, has: hasSelect, add: addSelect, remove: removeSelect }] = useSet();
  // 是否是定时刷新
  const [timelyInterval, setTimelyInterval] = useSafeState(false);
  // 可见状态
  const documentVisibility = useDocumentVisibility();

  // 设置数据
  const setListHandle = (d) => setList(d || []);

  // 数据列表request
  const { run: getMatchRequest, loading: matchListLoading } = useRequest(
    (q) => getMatch(q).toPromise(),
    {
      defaultParams: query,
      defaultLoading: false,
      refreshOnWindowFocus: true,
      onSuccess: (d) => {
        const rData = d || [];

        if (timelyInterval) {
          setTimelyInterval(false);
          if (!rData.length) return;
        } else {
          resetSelect();
        }
        setListHandle(rData.map(scoreDataFormat));
      }
    }
  );

  // 数据列表轮询查询时长
  const matchPollingInterval = sortType === 'timely' && !matchListLoading && documentVisibility === 'visible' ? 3000 : null;
  // 定时刷新即时比分(useRequest的pollingInterval参数监听不了状态变化，所以直接用useInterval)
  useInterval(() => {
    setTimelyInterval(true);
    return getMatchRequest(query);
  }, matchPollingInterval);

  // 关注request
  const { run: getKeepRequest, loading: followListLoading } = useRequest(
    (q) => getMatchFollowList(q).toPromise(),
    {
      ready: isLogin,
      manual: true,
      defaultLoading: false,
      onSuccess: (d) => {
        const resList = (d || []).map(scoreDataFormat);
        resetKeep();
        resetSelect();
        resList.forEach(({ eventId }) => addKeep(eventId));
        setKeepList(resList);
      }
    }
  );

  // 滚动到顶部
  const scrollToTopHandle = () => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  // 获取列表数据
  const getListDataHandle = (q) => {
    const reqQuery = { ...query, ...q || {}, sport_id: 1 };
    setQuery(reqQuery);

    scrollToTopHandle();
    return getMatchRequest(reqQuery);
  };

  // 获取关注数据
  const getFollowDataHandle = () => {
    scrollToTopHandle();
    return getKeepRequest({ userId: uid, sportId: 1 });
  };

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
        sportType: 1,
        userId: uid
      }
    };
  };

  // 设置关注
  const setKeepHandle = async (id) => {
    const result = keepBeforeVerify(id);
    if (result) {
      const { data: { code, msg } = {} } = await addMatchFollow(result.params).toPromise();
      if (HttpCode.SUCCESS === code) {
        result.ids.forEach(addKeep);
      } else {
        enqueueSnackbar(msg);
      }
    }
  };

  // 取消关注
  const cancelKeepHandle = async (id) => {
    const result = keepBeforeVerify(id);
    if (result) {
      const { data: { code, msg } = {} } = await cancelMatchFollow(result.params).toPromise();
      if (HttpCode.SUCCESS === code) {
        result.ids.forEach(removeKeep);
      } else {
        enqueueSnackbar(msg);
      }
    }
  };

  // 设置选中
  const setSelectHandle = (id) => {
    if (hasSelect(id)) return removeSelect(id);

    return addSelect(id);
  };

  const providerValue = {
    // 一些状态
    status: {
      // 加载中
      loading: timelyInterval ? false : matchListLoading || followListLoading,
      // 排序方式
      sortType,
      // 比分开关
      scoreSwitch
    },
    // 一些数据
    state: {
      // 请求的数据列表
      list,
      // 请求参数
      query,
      // 关注数据列表
      keepList,
      // 置顶的对象
      topObject,
      // 隐藏的对象
      hiddenObject,
      // 关注对象
      keepObject,
      // checkbox选择
      selectObject
    },
    // 一些方法
    methods: {
      // 设置数据
      setList: setListHandle,
      // 获取列表数据
      getListData: getListDataHandle,
      // 获取关注数据
      getFollowData: getFollowDataHandle,
      // 添加隐藏
      addHidden,
      // 移除隐藏
      removeHidden,
      // 清空隐藏
      emptyHidden: resetHidden,
      // 添加置顶
      addTop,
      // 移除置顶
      removeTop,
      // 清空置顶
      emptyTop: resetTop,
      // 设置关注
      setKeep: setKeepHandle,
      // 取消关注
      cancelKeep: cancelKeepHandle,
      // 设置选择
      setSelect: setSelectHandle,
      // 清空选中
      emptySelect: resetSelect,
      // 设置排序方式
      setSortType,
      // 设置比分开关
      setScoreSwitch
    }
  };
  return (
    <Context.Provider value={providerValue}>
      {children}
    </Context.Provider>
  );
};

export default Provider;
