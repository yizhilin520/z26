import React, { useRef } from 'react';
import DownloadDialog from '@/components/DownloadDialog';
import DownloadImage from './images/download_image.png';

import styles from './style.scss';

const HeaderDownload = () => {
  const dialogRef = useRef();

  return (
    <>
      <div className={styles.container} onClick={() => dialogRef.current.open()}>
        <img className={styles.image} src={DownloadImage} />
      </div>
      <DownloadDialog ref={dialogRef} />
    </>
  );
};

export default HeaderDownload;
