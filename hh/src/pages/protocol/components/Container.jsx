import React from 'react';

import styles from '../style/Container.scss';

const Container = ({ children }) => (
  <main className={styles.container}>
    <div className={styles.wrapper}>
      {children}
    </div>
  </main>
);

export default Container;
