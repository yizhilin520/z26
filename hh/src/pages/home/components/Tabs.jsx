import React from 'react';
import ClassNames from 'classnames';
import { empty } from '@/common/utils';

import LogoImage from '../images/logo.png';

import styles from '../style/Tabs.scss';

const Tabs = ({ value, onChange, list }) => {
  const onChangeHandle = (v) => {
    if (v === value) return;

    return onChange(v);
  };

  return (
    <div className={styles.container}>
      <img className={styles.logo} src={LogoImage} />
      {list.map((row, index) => (
        <div
          className={ClassNames(styles.item, { [styles.isActive]: value === row.value })}
          onClick={() => onChangeHandle(row.value)}
          key={index}
        >
          {row.label}
        </div>
      ))}
    </div>
  );
};

Tabs.defaultProps = {
  list: [],
  onChange: empty
};

export default Tabs;
