import React, { useRef } from 'react';
import DownloadDialog from '@/components/DownloadDialog';

import styles from '../style/Download.scss';

const Download = () => {
  const dialogRef = useRef();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.text} onClick={() => dialogRef.current.open()}>
          <span>想了解更多资讯？</span>
          <span className={styles.link}>立即下载U球APP</span>
        </div>
      </div>
      <DownloadDialog ref={dialogRef} />
    </div>
  );
};

export default Download;
