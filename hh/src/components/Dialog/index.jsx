import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import ReactDom from 'react-dom';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import { usePersistFn } from 'ahooks';
import { empty } from '@/common/utils';
import useSafeState from 'ahooks/lib/useSafeState';
import ZIndex from '@/components/ZIndex';
import RenderJudge from '@/components/RenderJudge';

import styles from './style.scss';

const CreatePortal = ({ container, children }) => (
  <RenderJudge
    value={container}
    active={ReactDom.createPortal(children, container)}
    inactive={children}
  />
);

const Dialog = forwardRef(({ container, title, text, buttons }, ref) => {
  const [visible, setVisible] = useSafeState(false);

  // 打开
  const onOpenHandle = usePersistFn(() => {
    document.body.style.overflow = 'hidden';
    return setVisible(true);
  });
  // 关闭
  const onCloseHandle = usePersistFn(() => {
    document.body.style.overflow = null;
    return setVisible(false);
  });

  useImperativeHandle(ref, () => ({
    open: onOpenHandle,
    close: onCloseHandle
  }));

  if (!visible) return null;
  return (
    <CreatePortal container={'current' in container ? container.current : container}>
      <ZIndex className={styles.mask} />
      <ZIndex className={styles.container}>
        <RenderJudge
          value={title}
          active={(<div className={styles.title}>{title}</div>)}
        />
        <div className={ClassNames(styles.text, { [styles.isNotTitle]: !title })}>{text}</div>
        <div className={styles.buttons}>
          {buttons.map((row, index) => {
            const Tag = row.url ? Link : 'button';
            const onClickHandle = (e) => {
              const handle = row.handle || empty;
              onCloseHandle();
              return handle(e);
            };
            const to = row.url;
            return (
              <Tag
                to={to}
                onClick={onClickHandle}
                className={ClassNames(styles.btn, { [styles.isActive]: row.isActive })}
                key={index}
              >
                {row.label}
              </Tag>
            );
          })}
        </div>
      </ZIndex>
    </CreatePortal>
  );
});

Dialog.defaultProps = {
  container: document.body,
  buttons: []
};

Dialog.Alert = forwardRef(({ title, text, buttonText, onClose }, ref) => {
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
    label: buttonText,
    handle: onClose,
    isActive: true
  }];
  return (<Dialog title={title} text={text} buttons={btnList} ref={dialogRef} />);
});

Dialog.Alert.defaultProps = {
  buttonText: '确定',
  onClose: empty
};

Dialog.Confirm = forwardRef(({ title, text, cancelButtonText, onCancel, confirmButtonText, onConfirm }, ref) => {
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
    label: cancelButtonText,
    handle: onCancel
  }, {
    label: confirmButtonText,
    handle: onConfirm,
    isActive: true
  }];
  return (<Dialog title={title} text={text} buttons={btnList} ref={dialogRef} />);
});

Dialog.Confirm.defaultProps = {
  cancelButtonText: '取消',
  onCancel: empty,
  confirmButtonText: '确定',
  onConfirm: empty
};

export default Dialog;
