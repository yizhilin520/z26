import React from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import Iconfont from '@/components/Iconfont';

import styles from '../style/BreadCrumbs.scss';

const ItemTag = ({ url, className, children }) => {
  if (url) return (<Link to={url} className={className}>{children}</Link>);

  return (<div className={className}>{children}</div>);
};

const BreadCrumbs = ({ list }) => {
  const dataList = [{ label: '首页', url: '/forecast/home' }].concat(list);
  return (
    <div className={styles.container}>
      {dataList.map((row, index) => (
        <ItemTag className={ClassNames(styles.item, styles.isActive)} url={row.url} key={index}>
          <span className={styles.label}>{row.label}</span>
          <Iconfont name="bq_ee" className={styles.icon} />
        </ItemTag>
      ))}
    </div>
  );
};

BreadCrumbs.defaultProps = {
  list: []
};

export default BreadCrumbs;
