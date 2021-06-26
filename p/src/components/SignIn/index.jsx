import React, { forwardRef, useImperativeHandle, useState } from 'react';
import dayJs from 'dayjs';
import { useSelector } from 'react-redux';
import { useLogin, useRequest } from '@/utils/hooks';
import { getInitTreasureChestList, getTreasureChestList } from '@/servers/userServer';
import Dialog from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/core/styles';
import { empty } from '@/utils/common';
import SignInList from './components/SignInList';
import BindPhone from './components/BindPhone';
import SignResult from './components/SignResult';

const MaterialDialog = withStyles(() => ({
  paper: {
    boxShadow: 'none',
    margin: 'auto',
    background: 'none',
    borderRadius: 'none',
    overflowY: 'initial'
  }
}))(Dialog);

const CLOSE_SIGN_TIMER_KEY = '_close_sign_timer_';

const SignIn = forwardRef(({ onSubmit }, ref) => {
  const { isLogin } = useLogin();
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState({ value: 'list', data: null });
  const { uid } = useSelector(({ user }) => user.userInfo || {});
  const { data = {}, loading, mutate } = useRequest(
    (isValid = true) => {
      // 判断今天是否已经关闭了，关闭了就不请求了
      const closeTime = localStorage.getItem(CLOSE_SIGN_TIMER_KEY);
      if (closeTime && dayJs(dayJs(closeTime).format('YYYY-MM-DD')).isBefore(dayJs()) && isValid) return;

      return (isLogin ? getTreasureChestList({ id: uid }).toPromise() : getInitTreasureChestList().toPromise());
    },
    { id: uid },
    (d) => {
      const rData = isLogin ? (d || {}) : { lastIndex: 0, isOpen: 0, chests: d || [] };
      if (!visible) setVisible(!rData.isOpen);
      return rData;
    }
  );
  // 设置为list视图
  const onChangeListViewHandle = () => setView({ value: 'list', data: null });
  // 设置为绑定手机视图
  const onChangeBindPhoneViewHandle = () => setView({ value: 'bind', data: null });
  // 切换为结果视图
  const onChangeResultViewHandle = (d) => {
    onSubmit(d);
    return setView({ value: 'result', data: d });
  };
  // 关闭
  const onCloseHandle = () => {
    localStorage.setItem(CLOSE_SIGN_TIMER_KEY, Date.now());
    return setVisible(false);
  };
  // 打开
  const onOpenHandle = () => {
    setVisible(true);
    setView({ value: 'list', data: null });

    return mutate(false);
  };

  useImperativeHandle(ref, () => ({
    open: onOpenHandle,
    close: onCloseHandle
  }));

  const listView = (
    <SignInList
      data={data || {}}
      onChangeBindView={onChangeBindPhoneViewHandle}
      onChangeResultView={onChangeResultViewHandle}
      onClose={onCloseHandle}
    />
  );
  const bindView = (
    <BindPhone
      onChangeListView={onChangeListViewHandle}
    />
  );
  const resultView = (
    <SignResult
      data={view.data}
      onClose={onCloseHandle}
    />
  );
  const viewObj = {
    list: listView,
    bind: bindView,
    result: resultView
  };
  const component = viewObj[view.value] || listView;

  if (loading || !visible) return null;
  return (
    <MaterialDialog scroll="body" open maxWidth={false}>
      {component}
    </MaterialDialog>
  );
});

SignIn.defaultProps = {
  onSubmit: empty
};

export default SignIn;
