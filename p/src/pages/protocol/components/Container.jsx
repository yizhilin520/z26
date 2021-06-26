import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SideTools from '@/components/SideTools';

import styles from '../style/Container.scss';

const Container = ({ children }) => (
  <>
    <Header />
    <div className={styles.container}>
      <main className={styles.wrapper}>
        <div className={styles.main}>
          {children}
        </div>
      </main>
    </div>
    <SideTools />
    <Footer />
  </>
);

export default Container;
