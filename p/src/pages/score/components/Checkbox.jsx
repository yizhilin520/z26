import React from 'react';
import ClassNames from 'classnames';
import { empty } from '@/utils/common';

import styles from '../style/Checkbox.scss';

const Checkbox = ({ className, value, onChange }) => {
  const onChangeHandle = () => onChange(!value);

  return (<div className={ClassNames(styles.container, className, { [styles.isActive]: !!value })} onClick={onChangeHandle} />);
};

Checkbox.defaultProps = {
  onChange: empty
};

export default Checkbox;
