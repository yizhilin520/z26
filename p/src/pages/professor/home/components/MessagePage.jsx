import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Vue2React from '@/components/Vue2React';
import VueMessagePage from '../vue/pages/message';

const MessagePage = () => {
  const { uid } = useSelector(({ user }) => user.userInfo || {});
  const history = useHistory();

  return (<Vue2React component={VueMessagePage} userId={uid} history={history} />);
};

export default MessagePage;
