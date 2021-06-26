import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Vue2React from '@/components/Vue2React';
import VueAccountPage from '../vue/pages/account';

const AccountPage = () => {
  const { uid } = useSelector(({ user }) => user.userInfo || {});
  const history = useHistory();

  return (<Vue2React component={VueAccountPage} userId={uid} history={history} />);
};

export default AccountPage;
