import React from 'react';
import ClassNames from 'classnames';

import styles from './style.scss';

const NowPlayingIcon = ({
  tag, className, style, label
}) => {
  const child = (
    <div className={styles.wrapper}>{label}</div>
  );
  return React.createElement(
    tag,
    { className: ClassNames(styles.container, className), style },
    child
  );
};

NowPlayingIcon.defaultProps = {
  tag: 'div',
  label: 'LIVE',
  className: null,
  style: {}
};

export default NowPlayingIcon;
