import React, { forwardRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import { usePersistFn, useSetState, useTimeout } from 'ahooks';
import { empty } from '@/common/utils';

import styles from './style.scss';

const Toast = forwardRef(({ visible, text, duration, onOpen, onClose }, ref) => {
  const [value, setValue] = useSetState({ visible, text, duration });

  // 打开
  const onOpenHandle = usePersistFn((opt) => {
    let options = opt;
    if (typeof opt === 'string') options = { text: options };

    const { text: optText, duration: optDuration = 4000 } = options || {};

    setValue({ visible: true, text: optText, duration: optDuration });
    return onOpen();
  });
  // 关闭
  const onCloseHandle = usePersistFn(() => {
    setValue({ visible: false, text: null, duration: 0 });
    return onClose();
  });

  useTimeout(onCloseHandle, value.duration > 0 ? value.duration : null);

  useImperativeHandle(ref, () => ({
    open: onOpenHandle,
    close: onCloseHandle
  }));

  if (!value.visible) return null;
  return createPortal(<div className={styles.container}>{value.text}</div>, document.body);
});

Toast.defaultProps = {
  onOpen: empty,
  onClose: empty
};

export default Toast;
