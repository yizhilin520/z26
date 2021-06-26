import React from 'react';
import ClassNames from 'classnames';
import { useInterval, useLogin, useSafeState } from '@/utils/hooks';
import Iconfont from '@/components/Iconfont';

import UserDefaultImage from '@/assets/images/user_default_image.png';

import styles from './style/index.scss';

const GuideLogin = () => {
  const { isLogin, login } = useLogin();
  const [index, setIndex] = useSafeState(0);
  const [visible, setVisible] = useSafeState(false);

  const timeList = [60000, 60000, 180000, 600000];
  const currentTimestamp = timeList[index];

  useInterval(() => {
    setIndex(Math.min(index + 1, timeList.length - 1));
    setVisible(true);
  }, !isLogin && !visible && currentTimestamp ? currentTimestamp : null);

  // 关闭
  const onCloseHandle = () => setVisible(false);

  return (
    <div className={ClassNames(styles.container, { [styles.isShow]: visible })}>
      <div className={styles.wrapper}>
        <div className={styles.label}>当前未登录，登录后享受更优质服务哦</div>
        <img className={styles.image} src={UserDefaultImage} />
        <div className={styles.button} onClick={login}>登录</div>
      </div>
      <Iconfont tag="div" className={styles.close} name="close" onClick={onCloseHandle} />
    </div>
  );
};

export default GuideLogin;
