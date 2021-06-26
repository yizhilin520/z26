import React from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import Image from '@/components/Image';
import Iconfont from '@/components/Iconfont';
import DefaultLiveCoverImage from '@/assets/images/default_live_cover_image.jpg';

import styles from './style.scss';

const VideoCard = ({ className, style, label, image, defaultImage, url, target, userName, heat, children }) => {
  const Element = url ? Link : 'div';

  return (
    <Element to={url} target={target} className={ClassNames(styles.container, className)} style={style}>
      <div className={styles.imageWrapper}>
        <Image
          className={styles.image}
          src={image}
          defaultImage={defaultImage}
        />
        <div className={styles.meta}>
          <div className={styles.userName}>{userName}</div>
          <Iconfont className={styles.icon} name="huo" />
          <div className={styles.heat}>{heat}</div>
        </div>
      </div>
      <div className={styles.title}>{label}</div>
      {children}
    </Element>
  );
};

VideoCard.defaultProps = {
  defaultImage: DefaultLiveCoverImage
};

export default VideoCard;
