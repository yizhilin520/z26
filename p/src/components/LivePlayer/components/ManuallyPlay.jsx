import React from 'react';
import { useStores } from '../utils/store';

import ManuallyPlayImage from '../images/manually_play.png';

import styles from '../style/ManuallyPlay.scss';

const ManuallyPlay = () => {
  const { methods } = useStores();
  return (
    <div className={styles.container}>
      <img className={styles.image} src={ManuallyPlayImage} />
      <div className={styles.text}>你的浏览器暂不支持视频自动播放</div>
      <div className={styles.button} onClick={methods.play}>点击播放</div>
    </div>
  );
};

export default ManuallyPlay;
