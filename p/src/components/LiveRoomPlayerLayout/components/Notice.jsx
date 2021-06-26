import React from 'react';
import { useStores } from '../utils/store';

import styles from '../style/Notice.scss';

const Notice = () => {
  const { data } = useStores();
  const announcement = data.announcement || '';

  return (
    <div className={styles.container}>
      <div className={styles.text}>{`公告：${announcement}`}</div>
    </div>
  );
};

export default Notice;
