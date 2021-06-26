import React from 'react';
import TextDownload from '@/components/TextDownload';

import styles from '../style/GuideDownload.scss';

const GuideDownload = () => {
  return (
    <div className={styles.container}>
      <div className={styles.download}>
        <TextDownload />
      </div>
    </div>
  );
};

export default GuideDownload;
