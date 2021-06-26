import React from 'react';
import ClassNames from 'classnames';
import RenderJudge from '@/components/RenderJudge';
import DefaultNotDataImage from '@/assets/images/default_not_data_image.png';

import styles from './style/index.scss';

const EmptyData = ({ image, text, className, ...props }) => (
  <div className={ClassNames(styles.container, className)} {...props}>
    <img className={styles.image} src={image} />
    <RenderJudge
      value={text}
      active={(<div className={styles.text}>{text}</div>)}
    />
  </div>
);

EmptyData.defaultProps = {
  image: DefaultNotDataImage,
  text: '暂无数据'
};

export default EmptyData;
