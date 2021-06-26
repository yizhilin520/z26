import React from 'react';
import ClassNames from 'classnames';
import { Link } from 'react-router-dom';
import Iconfont from '@/components/Iconfont';
import RenderJudge from '@/components/RenderJudge';

import styles from '../style/Sidebar.scss';

const Sidebar = ({ value, list }) => (
  <div className={styles.container}>
    {list.map((row, index) => (
      <Link
        className={ClassNames(styles.item, { [styles.isActive]: value === row.value })}
        to={`/live/list/${row.value}`}
        replace
        key={index}
      >
        <RenderJudge
          value={row.icon}
          active={(
            <Iconfont name={row.icon} className={styles.icon} />
          )}
          inactive={(
            <>
              <img className={styles.imageIcon} src={row.defaultIcon} />
              <img className={styles.imageActiveIcon} src={row.selectedIcon} />
            </>
          )}
        />
        <div className={styles.label}>{row.label}</div>
      </Link>
    ))}
  </div>
);

Sidebar.defaultProps = {
  value: null,
  list: []
};

export default Sidebar;
