import React from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import ZIndex from '@/components/zIndex';
import RenderJudge from '@/components/RenderJudge';
import Iconfont from '@/components/Iconfont';
import BackTop from '@/components/BackTop';

import QqImage from './images/qq_image.png';

import styles from './style.scss';

const SideTools = ({ backTop, children }) => (
  <ZIndex value={ZIndex.value.sideTools} className={styles.container}>
    <a href="http://europe.uqiu.com/" target="_blank" className={styles.item} rel="noreferrer">
      <Iconfont name="zuqiu" className={styles.icon} />
      <div className={styles.label}>欧洲杯</div>
    </a>
    <a href="http://www.uqiu.com/download/" target="_blank" className={styles.item} rel="noreferrer">
      <Iconfont name="shouji" className={styles.icon} />
      <div className={styles.label}>下载App</div>
    </a>
    {/* <div className={ClassNames(styles.item, styles.service)}>
      <Iconfont name="zaixiankefu" className={styles.icon} />
      <div className={styles.label}>在线客服</div>
      <div className={styles.qqContainer}>
        <a
          className={styles.qqWrapper}
          href="http://wpa.qq.com/msgrd?v=1&uin=64512598&site=http://www.uqiu.com&menu=yes"
          target="_blank"
          rel="noreferrer"
        >
          <img src={QqImage} alt="qq" className={styles.qqImage} />
          <span className={styles.qqText}>在线QQ客服:64512598</span>
        </a>
      </div>
    </div> */}
    <Link to="/feedback" target="_blank" className={styles.item}>
      <Iconfont name="yijianfankui" className={styles.icon} />
      <div className={styles.label}>意见反馈</div>
    </Link>
    <RenderJudge
      value={backTop}
      active={(
        <BackTop className={styles.item}>
          <Iconfont name="fanhuidingbu" className={styles.icon} />
          <div className={styles.label}>顶部</div>
        </BackTop>
      )}
    />
    {children}
  </ZIndex>
);

SideTools.defaultProps = {
  backTop: true
};

export default SideTools;
