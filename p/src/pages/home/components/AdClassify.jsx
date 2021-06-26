import React from 'react';
import Section from './Section';

import styles from '../style/AdClassify.scss';

import HomeAdImage from '../images/home_ad.png';

const AdClassify = () => (
  <Section>
    <a href="http://europe.uqiu.com/" target="_blank" rel="noreferrer">
      <img className={styles.container} src={HomeAdImage} alt="ad" />
    </a>
  </Section>
);

export default AdClassify;
