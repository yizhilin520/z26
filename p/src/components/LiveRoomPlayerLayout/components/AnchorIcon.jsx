import React from 'react';
import ClassNames from 'classnames';

import styles from '../style/AnchorIcon.scss';

const AnchorIcon = ({ className, label }) => (
  <div className={ClassNames(styles.container, className)}>{label}</div>
);

AnchorIcon.defaultProps = {
  label: '主播'
};

export default AnchorIcon;
