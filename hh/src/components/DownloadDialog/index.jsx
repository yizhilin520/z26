import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import Dialog from '@/components/Dialog';

const DownloadDialog = forwardRef((props, ref) => {
  const dialogRef = useRef();

  // 打开
  const onOpenHandle = () => dialogRef.current.open();
  // 关闭
  const onCloseHandle = () => dialogRef.current.close();

  useImperativeHandle(ref, () => ({
    open: onOpenHandle,
    close: onCloseHandle
  }));

  const btnList = [{
    label: '取消'
  }, {
    label: '确定',
    url: '/download',
    isActive: true
  }];
  return (<Dialog title="提示" text="想了解更多资讯？立即下载U球APP" buttons={btnList} ref={dialogRef} />);
});

export default DownloadDialog;
