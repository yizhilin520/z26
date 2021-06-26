import React from 'react';
import ClassNames from 'classnames';
import { empty } from '@/utils/common';

import styles from '../style/LeftSideTools.scss';

const LeftSideTools = ({ onKeep, onSave, onHidden, isMedia }) => (
  <div className={ClassNames(styles.container, { [styles.isMedia]: isMedia })}>
    <div className={styles.item} onClick={onKeep}>
      <i className={ClassNames(styles.icon, styles.follow)} />
      <span className={styles.text}>关注</span>
    </div>
    <div className={styles.item} onClick={onSave}>
      <i className={ClassNames(styles.icon, styles.save)} />
      <span className={styles.text}>保留</span>
    </div>
    <div className={styles.item} onClick={onHidden}>
      <i className={ClassNames(styles.icon, styles.hide)} />
      <span className={styles.text}>隐藏</span>
    </div>
  </div>
);

LeftSideTools.defaultProps = {
  isMedia: true,
  onKeep: empty,
  onSave: empty,
  onHidden: empty
};

export default LeftSideTools;
