import React from 'react';

import styles from '../style/BufferLoading.scss';

const BufferLoading = () => (
  <div className={styles.container}>
    <div className={styles.circular}>
      <div className={styles.spinner}>
        <svg viewBox="25 25 50 50" className={styles.image}>
          <circle cx="50" cy="50" r="20" fill="none" className={styles.circle} />
        </svg>
      </div>
    </div>
  </div>
);

export default BufferLoading;
