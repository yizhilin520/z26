import React from 'react';

import styles from '../style/Main.scss';

const Main = ({ children }) => (
  <main className={styles.container}>
    <div className={styles.wrapper}>
      {children}
    </div>
  </main>
);

export default Main;
