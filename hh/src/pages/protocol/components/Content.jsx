import React from 'react';

import styles from '../style/Content.scss';

const Content = ({ children }) => (<div className={styles.container}>{children}</div>);

Content.Item = ({ children }) => (<div className={styles.item}>{children}</div>);

Content.Bold = ({ children }) => (<b className={styles.bold}>{children}</b>);

export default Content;
