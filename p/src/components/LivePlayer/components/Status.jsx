import React from 'react';

import styles from '../style/Status.scss';

// status 0主播已经下播  1正在直播 2主播封禁 3有数据但是无法播放,
const Status = ({ status, children }) => {
  if (status !== 1) return (<div className={styles.download} />);

  return children;
};
export default Status;
