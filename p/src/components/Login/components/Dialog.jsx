import React, { useState } from 'react';
import ClassNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MaterialDialog from '@material-ui/core/Dialog';
import Iconfont from '@/components/Iconfont';
import RenderJudge from '@/components/RenderJudge';
import { empty } from '@/utils/common';

import styles from '../style/Dialog.scss';

const CustomizeDialog = withStyles(() => ({
  paper: {
    borderRadius: 0,
    background: 'none'
  }
}))(MaterialDialog);

const Dialog = ({ visible, list, onClose, ...props }) => {
  const [selectIndex, setSelectIndex] = useState(0);

  const onChangeHandle = (v) => {
    if (v === selectIndex) return;

    return setSelectIndex(v);
  };

  const { component, label } = list[list.length > 1 ? selectIndex : 0] || {};

  return (
    <CustomizeDialog open={!!visible} maxWidth={false} scroll="body" {...props}>
      <div className={styles.container}>
        <div className={styles.title}>
          <RenderJudge
            value={list.length > 1}
            active={list.map((row, index) => {
              const isActive = index === selectIndex;
              return (
                <div
                  className={ClassNames(styles.titleItem, {
                    [styles.isActive]: isActive,
                    [styles.isPointer]: !isActive
                  })}
                  onClick={() => onChangeHandle(index)}
                  key={index}
                >
                  {row.label}
                </div>
              );
            })}
            inactive={(
              <div className={ClassNames(styles.titleItem, styles.isActive)}>{label}</div>
            )}
          />
        </div>
        <Iconfont name="close" className={styles.close} onClick={onClose} />
        <div className={styles.wrapper}>
          {component}
        </div>
      </div>
    </CustomizeDialog>
  );
};

Dialog.defaultProps = {
  list: [],
  onClose: empty
};

export default Dialog;
