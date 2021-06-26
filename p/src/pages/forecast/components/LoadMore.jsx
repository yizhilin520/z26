import React from 'react';
import { Link } from 'react-router-dom';
import { empty } from '@/utils/common';
import Iconfont from '@/components/Iconfont';
import RenderJudge from '@/components/RenderJudge';

import styles from '../style/LoadMore.scss';

const LoadMore = ({ label, url, onClick }) => {
  const component = (
    <>
      <span>{label}</span>
      <Iconfont name="bq_ee" className={styles.icon} />
    </>
  );
  const LinkComponent = () => (
    <Link className={styles.link} to={url} onClick={onClick}>
      {component}
    </Link>
  );
  const DivComponent = () => (
    <div className={styles.link} onClick={onClick}>
      {component}
    </div>
  );

  return (
    <div className={styles.container}>
      <RenderJudge
        value={url}
        active={(<LinkComponent />)}
        inactive={(<DivComponent />)}
      />
    </div>
  );
};

LoadMore.defaultProps = {
  label: '查看更多内容',
  onClick: empty
};

export default LoadMore;
