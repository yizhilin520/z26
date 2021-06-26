import React from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';

import styles from '../style/Menus.scss';

const Menus = ({ value, list }) => {
  const onLinkClickHandle = (e, val) => {
    if (new RegExp(value).test(val)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className={styles.container}>
      {list.map((row, index) => (
        <Link
          className={ClassNames(styles.item, { [styles.isActive]: value === row.value })}
          to={`/professor/home/${row.value}`}
          onClick={(e) => onLinkClickHandle(e, row.value)}
          key={index}
        >
          <img className={styles.icon} src={row.icon} />
          <div className={styles.label}>{row.label}</div>
        </Link>
      ))}
    </div>
  );
};

Menus.defaultProps = {
  list: []
};

export default Menus;
