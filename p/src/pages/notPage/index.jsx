import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Error from '@/components/Error';

import styles from './style.scss';

const notPage = () => (
  <>
    <Header />
    <Error status={404} className={styles.container} />
    <Footer />
  </>
);

export default notPage;
