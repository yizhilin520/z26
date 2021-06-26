import React from 'react';

import styles from './style.scss';

const Toast = ({ text }) => (
  <div className={styles.container}>
    <div className={styles.text}>{text}</div>
  </div>
);

export default Toast;
