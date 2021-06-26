import React, { forwardRef, useImperativeHandle } from 'react';
import ClassNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import { empty } from '@/utils/common';
import { useSafeState } from '@/utils/hooks';

import styles from '../style/ConfirmDialog.scss';

const ConfirmDialog = forwardRef((({ text, onConfirm }, ref) => {
  const [visible, setVisible] = useSafeState(false);

  // 打开
  const onOpenHandle = () => setVisible(true);
  // 关闭
  const onCloseHandle = () => setVisible(false);
  // 确定
  const onSubmitHandle = () => {
    onCloseHandle();
    return onConfirm();
  };

  useImperativeHandle(ref, () => ({
    open: onOpenHandle
  }));

  return (
    <Dialog open={visible} maxWidth={false} scroll="body" onClose={onCloseHandle}>
      <div className={styles.container}>
        <div className={styles.text}>{text}</div>
        <div className={styles.buttons}>
          <div className={styles.btn} onClick={onCloseHandle}>取消</div>
          <div className={ClassNames(styles.btn, styles.isActive)} onClick={onSubmitHandle}>确定</div>
        </div>
      </div>
    </Dialog>
  );
}));

ConfirmDialog.defaultProps = {
  onConfirm: empty
};

export default ConfirmDialog;
