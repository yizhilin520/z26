import React from 'react';

import styles from '../style/Table.scss';

const Table = ({ list }) => (
  <div className={styles.container}>
    {list.map((row, index) => (
      <div className={styles.item} key={index}>
        {row.map((subRow, subIndex) => (
          <div className={styles.cell} key={subIndex}>{subRow}</div>
        ))}
      </div>
    ))}
  </div>
);

export default Table;
