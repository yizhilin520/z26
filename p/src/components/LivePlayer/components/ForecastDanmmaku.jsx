import React from 'react';
import Image from '@/components/Image';
import UserDefaultImage from '@/assets/images/user_default_image.png';

import styles from '../style/ForecastDanmmaku.scss';

const ForecastDanmmaku = ({ userName, userImage, text }) => (
  <div className={styles.container}>
    <Image className={styles.userImage} src={userImage} defaultImage={UserDefaultImage} />
    <div className={styles.text}>{`${userName} ${text}`}</div>
  </div>
);
export default ForecastDanmmaku;
