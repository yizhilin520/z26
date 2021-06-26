import React from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import { empty } from '@/utils/common';
import RenderJudge from '@/components/RenderJudge';

import styles from '../style/Tabs.scss';

const Tabs = ({ value, list, eventId }) => (
  <div className={styles.container}>
    {list.map((row, index) => (
      <RenderJudge
        key={index}
        value={row.value === value}
        active={(
          <div className={ClassNames(styles.item, styles.isActive)}>{row.label}</div>
        )}
        inactive={(
          <Link to={`/score/detail/${eventId}/${row.value}`} replace className={styles.item}>{row.label}</Link>
        )}
      />
    ))}
  </div>
);

Tabs.defaultProps = {
  list: [],
  onChange: empty
};

export default Tabs;
