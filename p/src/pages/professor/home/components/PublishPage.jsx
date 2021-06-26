import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { empty, getRequestUrlParams } from '@/utils/common';
import { usePersistFn } from '@/utils/hooks';
import Vue2React from '@/components/Vue2React';
import VuePublishPage from '../vue/pages/publish';

const PublishPage = () => {
  const history = useHistory();
  const location = useLocation();
  const { articleId } = getRequestUrlParams(location.search);
  const { uid } = useSelector(({ user }) => user.userInfo || {});
  // 提交成功回调
  const onPageSubmitHandle = usePersistFn((fn = empty) => {
    if (articleId) history.replace('/professor/home/publish');

    fn(articleId);
  });

  return (<Vue2React component={VuePublishPage} userId={uid} pageId={articleId} onSubmit={onPageSubmitHandle} />);
};

export default PublishPage;
