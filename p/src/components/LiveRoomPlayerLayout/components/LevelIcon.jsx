import React from 'react';
import ClassNames from 'classnames';
import { getCalcLevel } from '@/utils/common';

import styles from '../style/LevelIcon.scss';

const LevelIcon = ({ className, level }) => {
  const calcLevel = getCalcLevel(level);
  return (
    <div className={ClassNames(styles.container, `lvLabel${calcLevel}`, className)}>{`LV ${level || 1}`}</div>
  );
};

export default LevelIcon;
