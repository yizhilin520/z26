import React from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import RenderJudge from '@/components/RenderJudge';
import NowPlayingIcon from '@/components/NowPlayingIcon';
import Iconfont from '@/components/Iconfont';
import Image from '@/components/Image';
import PlayIcon from '@/assets/images/VideoCard/play_icon.png';
import DefaultImage from '@/assets/images/default_image.jpg';
import UserDefaultImage from '@/assets/images/user_default_image.png';

import styles from './style.scss';

const VideoCard = ({
  className,
  style,

  label,
  image,
  defaultImage,
  type,
  playing,
  url,
  target,
  headImage,
  userName,
  heat,
  tag,
  children
}) => {
  const Element = url ? Link : 'div';

  return (
    <Element to={url} target={target} className={ClassNames(styles.container, className)} style={style}>
      <div className={styles.imageWrapper}>
        <Image
          className={styles.image}
          src={image}
          defaultImage={defaultImage}
          alt={label}
        />
        <div className={styles.imageHover}>
          <img className={styles.playImage} src={PlayIcon} alt={label} />
        </div>
        <RenderJudge
          value={playing}
          active={<NowPlayingIcon className={styles.playStatus} />}
        />
      </div>
      <div className={styles.detail}>
        <div className={styles.title}>
          <RenderJudge
            value={type}
            active={<div className={styles.type}>{type}</div>}
          />
          <div className={styles.label}>{label}</div>
        </div>
        <div className={styles.meta}>
          <Image
            className={styles.userImage}
            src={headImage}
            defaultImage={UserDefaultImage}
            alt={userName}
          />
          <div className={styles.userName}>{userName}</div>
          <RenderJudge
            value={typeof heat === 'undefined'}
            inactive={(
              <>
                <Iconfont name="huo" className={styles.heatIcon} />
                <div className={styles.heatLabel}>{heat}</div>
              </>
            )}
          />
          <RenderJudge
            value={tag}
            active={<div className={styles.tagLabel}>{tag}</div>}
          />
        </div>
      </div>
      {children}
    </Element>
  );
};

VideoCard.defaultProps = {
  playing: false,
  target: '_blank',
  defaultImage: DefaultImage
};

VideoCard.tag = {
  1: '足球',
  2: '篮球',
  3: '电竞',
  100: '娱乐'
};

export default VideoCard;
