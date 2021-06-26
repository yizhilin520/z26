import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

import styles from '../style/BufferLoading.scss';

const CircularLoading = withStyles(() => ({
  colorPrimary: {
    color: '#fff'
  }
}))(CircularProgress);

const BufferLoading = () => (
  <div className={styles.container}>
    <CircularLoading thickness={2.6} />
  </div>
);

export default BufferLoading;
