import React, { useRef } from 'react';
import ClassNames from 'classnames';
import DownloadDialog from '@/components/DownloadDialog';

import styles from './style.scss';

const TextDownload = () => {
  const dialogRef = useRef();

  return (
    <div
      className={styles.container}
      onClickCapture={() => dialogRef.current.open()}
    >
      <span className={styles.text}>想了解更多资讯？</span>
      <span className={ClassNames(styles.text, styles.isActive)}>立即下载U球APP</span>
      <DownloadDialog ref={dialogRef} />
    </div>
  );
};

export default TextDownload;
