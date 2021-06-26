import React from 'react';
import { useLogin } from '@/utils/hooks';

import styles from '../style/UnLoginLabel.scss';

const UnLoginLabel = ({ label }) => {
  const { login } = useLogin();

  return (<div className={styles.container} onClick={login}>{label}</div>);
};

export default UnLoginLabel;
