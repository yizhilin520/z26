import React from 'react';
import ClassNames from 'classnames';

import styles from '../style/Section.scss';

const Section = ({ className, children }) => (
  <section className={ClassNames(styles.container, className, 'module-section')}>{children}</section>
);

export default Section;
