import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { getExpertExamineStatus } from '@/servers/userServer';
import { useLogin, usePersistFn, useRequest, useSafeState } from '@/utils/hooks';

import LoginPage from './login';
import ApplyPage from './apply';
import HomePage from './home';

const ProfessorPage = () => {
  const { uid } = useSelector(({ user }) => user.userInfo || {});
  const { isLogin } = useLogin();
  const history = useHistory();
  const { professor } = useParams();
  const [status, setStatus] = useSafeState();
  const [pageName, setPageName] = useSafeState();

  const authVerification = usePersistFn((s) => {
    // 没有登录跳转登录页面
    if (professor !== 'login' && !isLogin) {
      history.replace('/professor/login');
      setPageName('login');
      return;
    }
    const statusVal = s || status;
    if (typeof statusVal !== 'undefined') {
      // status      0:待审核 1:审核通过 2:退回 -1:未申请过
      if (statusVal === 1) {
        if (professor !== 'home') {
          history.replace('/professor/home');
          setPageName('home');
          return;
        }
      } else if (professor !== 'apply') {
        history.replace('/professor/apply');
        setPageName('apply');
        return;
      }
    }

    setPageName(professor);
  });

  const { loading } = useRequest(
    (q) => uid && getExpertExamineStatus(q).toPromise(),
    { userId: uid },
    (d) => {
      const { status: s } = d || {};
      // status      0:待审核 1:审核通过 2:退回 -1:未申请过
      setStatus(s);
      authVerification(s);
    }
  );

  useEffect(() => {
    authVerification();
  }, [professor, status]);

  const list = [{
    value: 'login',
    component: (<LoginPage />)
  }, {
    value: 'apply',
    component: (<ApplyPage />)
  }, {
    value: 'home',
    component: (<HomePage />)
  }];

  if (loading) return null;
  const { component = null } = list.find(({ value }) => value === pageName) || {};

  return component;
};

export default ProfessorPage;
