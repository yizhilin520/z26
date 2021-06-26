import React, { forwardRef, useImperativeHandle } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useSafeState } from '@/utils/hooks';
import DownloadQrcode from '/static/images/home/code.png';
import Dialog from './Dialog';

import AnchorInfos from '../images/anchor_infos.png';

import styles from '../style/BeAnchorDialog.scss';

const CustomDialog = withStyles(() => ({
  paper: {
    boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.06)'
  }
}))(Dialog);

const BeAnchorDialog = forwardRef((props, ref) => {
  const [visible, setVisible] = useSafeState(false);

  // 打开
  const onOpenHandle = () => setVisible(true);
  // 关闭
  const onCloseHandle = () => setVisible(false);

  useImperativeHandle(ref, () => ({
    open: onOpenHandle,
    close: onCloseHandle
  }));

  return (
    <CustomDialog
      width={464}
      visible={visible}
      onClose={onCloseHandle}
      hideBackdrop
    >
      <div className={styles.container}>
        <div className={styles.title}>成为主播</div>
        <div className={styles.wrapper}>
          <div className={styles.codeimg}>
            <img className={styles.qrcode} src={DownloadQrcode} />
            <span className={styles.codeimglogo}></span>
          </div>
          <div className={styles.content}>
            <img className={styles.image} src={AnchorInfos} />
            <div className={styles.text}>下载U球体育APP快速认证成为红人主播！</div>
          </div>
        </div>
      </div>
    </CustomDialog>
  );
});

export default BeAnchorDialog;
