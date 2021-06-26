import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from '@/plugins';
import { UPDATE_OPEN_LOGIN } from '@/actions/homeAtion';
import { UPDATE_LOGIN_REDUCER } from '@/actions/userAtion';
import Dialog from './components/Dialog';
import RegisterWithAccount from './components/RegisterWithAccount';
import LoginWithPhone from './components/LoginWithPhone';
import LoginWithAccount from './components/LoginWithAccount';

const Login = () => {
  const [useTimeClose, setUseTimeClose] = useState(null);
  const dispatch = useDispatch();
  const { controlLogin } = useSelector(({ home }) => home || {});
  const { enqueueSnackbar } = useSnackbar();
  const { activeIndex, open } = controlLogin;

  // 关闭
  const onCloseHandle = () => dispatch({ type: `home/${UPDATE_OPEN_LOGIN}`, payload: { activeIndex } });

  // 登录/注册成功
  const onSuccessHandle = (data, m) => {
    dispatch({
      type: `user/${UPDATE_LOGIN_REDUCER}`,
      payload: { data }
    });

    setUseTimeClose(1000);
    enqueueSnackbar(m, {
      autoHideDuration: 1000,
      onClose: (e, reason) => {
        if (reason === 'timeout') {
          onCloseHandle();
          location.reload();
        }
      }
    });
  };

  const list = [activeIndex === 1 && {
    label: '注册',
    component: (<RegisterWithAccount onSuccess={(d) => onSuccessHandle(d, '注册成功')} />)
  }, activeIndex === 0 && {
    label: '手机登录',
    component: (<LoginWithPhone onSuccess={(d) => onSuccessHandle(d, '登录成功')} />)
  }, activeIndex === 0 && {
    label: '账号登录',
    component: (<LoginWithAccount onSuccess={(d) => onSuccessHandle(d, '登录成功')} />)
  }].filter(Boolean);

  if (!open) return null;
  return (
    <Dialog visible list={list} onClose={onCloseHandle} />
  );
};

export default Login;
