import React from 'react';
import { Link } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import KickImage from '../images/kick_image.png';

import styles from '../style/KickOutIng.scss';

const KickOutIng = () => (
  <Dialog open maxWidth={false} scroll="body">
    <div className={styles.container}>
      <img src={KickImage} className={styles.image} />
      <div className={styles.title}>您已被踢出该直播间</div>
      <div className={styles.text}>无法进入该直播间！</div>
      <Link className={styles.button} to="/live/list">确定</Link>
    </div>
  </Dialog>
);

export default KickOutIng;
