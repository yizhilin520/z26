import React, { forwardRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import ClassNames from 'classnames';
import { usePersistFn } from 'ahooks';
import useSafeState from 'ahooks/lib/useSafeState';
import { empty } from '@/common/utils';
import ZIndex from '@/components/ZIndex';
import RenderJudge from '@/components/RenderJudge';

import styles from './style.scss';

const ActionSheet = forwardRef(({ title, list, props, onChange, onClose }, ref) => {
  const [value, setValue] = useSafeState({ title, list, visible: false });

  // 打开
  const onOpenHandle = usePersistFn(({ title: aTitle, list: aList } = {}) => {
    document.body.style.overflow = 'hidden';
    return setValue({
      title: aTitle || title,
      list: aList && aList.length ? aList : list,
      visible: true
    });
  });
  // 关闭
  const onCloseHandle = usePersistFn(() => {
    document.body.style.overflow = null;
    return setValue({
      title,
      list,
      visible: false
    });
  });

  // 确定
  const onChangeHandle = (d, i) => {
    onCloseHandle();
    return onChange(d, i);
  };
  // 取消
  const onCancelHandle = () => {
    onCloseHandle();
    return onClose();
  };

  useImperativeHandle(ref, () => ({
    open: onOpenHandle,
    close: onCloseHandle
  }));

  if (!value.visible) return null;
  return createPortal((
    <>
      <ZIndex className={styles.mask} />
      <ZIndex className={styles.container}>
        <RenderJudge
          value={value.title}
          active={(
            <div className={styles.title}>
              <p className={styles.titleText}>{value.title}</p>
            </div>
          )}
        />
        <div className={styles.menus}>
          {value.list.map((row, index) => {
            const rRow = typeof row === 'object' ? row : { [props.label]: row };
            return (
              <div
                className={ClassNames(styles.item, { [styles.isWarn]: rRow[props.isWarn] })}
                onClick={() => onChangeHandle(row, index)}
                key={index}
              >
                {rRow[props.label]}
              </div>
            );
          })}
        </div>
        <div className={styles.button}>
          <div className={styles.item} onClick={onCancelHandle}>取消</div>
        </div>
      </ZIndex>
    </>
  ), document.body);
});

ActionSheet.defaultProps = {
  list: [],
  props: {
    label: 'label',
    isWarn: 'isWarn'
  },
  onChange: empty,
  onClose: empty
};

export default ActionSheet;
