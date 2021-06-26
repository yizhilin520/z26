import React from 'react';
import ClassNames from 'classnames';

import styles from '../style/Wrapper.scss';

const Wrapper = ({ className, style, isRadius, isShadow, children }) => (
  <div
    className={ClassNames(styles.container, className, {
      [styles.isShadow]: isShadow,
      [styles.isRadius]: isRadius
    })}
    style={style}
  >
    {children}
  </div>
);

Wrapper.defaultProps = {
  isRadius: true,
  isShadow: true
};

export default Wrapper;
