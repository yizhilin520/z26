import React from 'react';
import ClassNames from 'classnames';
import { empty } from '@/utils/common';
import RenderJudge from '@/components/RenderJudge';

import styles from './style.scss';

const Modal = ({ title, text, showCancel, zIndex, onCancel, onConfirm }) => (
  <>
    <div className={styles['modal-mask']} style={{ zIndex }} onClick={onCancel} />
    <div className={styles['modal-warp']} style={{ zIndex }}>
      <div className={styles['modal-inner']}>
        <div className={styles['modal-title']}>{title}</div>
        <div className={styles['modal-content']}>
          {text}
        </div>
        <div className={styles['modal-buttons']}>
          <RenderJudge
            value={showCancel}
            active={(
              <div className={ClassNames(styles['button-item'], styles['is-cancel'])} onClick={onCancel}>取消</div>)}
          />
          <div className={ClassNames(styles['button-item'], styles['is-confirm'])} onClick={onConfirm}>确定</div>
        </div>
      </div>
    </div>
  </>
);

Modal.defaultProps = {
  onCancel: empty,
  onConfirm: empty,
  zIndex: 9999
};

export default Modal;
