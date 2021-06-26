import React from 'react';
import { useSelector } from 'react-redux';
import { useLogin } from '@/utils/hooks';
import { Link, useHistory } from 'react-router-dom';
import Iconfont from '@/components/Iconfont';

import styles from '../style/UserInfo.scss';

const UserInfo = () => {
  const { loginRequired } = useSelector(({ router }) => router.meta);
  const history = useHistory();
  const { logout } = useLogin();
  // 退出登录
  const onLogoutHandle = () => {
    logout();

    // 某些页面需要跳转到首页
    if (loginRequired) history.replace('/');
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <Link className={styles.item} to="/user">
        <Iconfont name="ziliao" className={styles.icon} />
        <div className={styles.label}>资料设置</div>
      </Link>
      <div className={styles.item} onClick={onLogoutHandle}>
        <Iconfont name="tuichu" className={styles.icon} />
        <div className={styles.label}>退出登录</div>
      </div>
    </div>
  );
};

export default UserInfo;
