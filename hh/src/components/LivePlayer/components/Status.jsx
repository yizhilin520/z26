import React, { useRef } from 'react';
import RenderJudge from '@/components/RenderJudge';
import DownloadDialog from '@/components/DownloadDialog';

import styles from '../style/Status.scss';

// status 0主播已经下播  1正在直播 2主播封禁 3有数据但是无法播放,
const Status = ({ status, children }) => {
  const dialogRef = useRef();

  // 打开下载弹框
  const onOpenDownloadDialogHandle = () => dialogRef.current.open();

  return (
    <>
      <RenderJudge
        value={status !== 1}
        active={(<div className={styles.download} onClick={onOpenDownloadDialogHandle} />)}
        inactive={children}
      />
      <DownloadDialog ref={dialogRef} />
    </>
  );
};
export default Status;
