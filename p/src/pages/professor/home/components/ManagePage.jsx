import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Vue2React from '@/components/Vue2React';
import VueManagePage from '../vue/pages/manage';

const ManagePage = () => {
  const { uid } = useSelector(({ user }) => user.userInfo || {});
  const history = useHistory();

  return (<Vue2React component={VueManagePage} userId={uid} history={history} />);
};

export default ManagePage;
