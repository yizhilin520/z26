import React from 'react';
import ClassNames from 'classnames';

import styles from '../style/Layout.scss';

const Layout = ({ className, anchor, player, animation, gift, message }) => (
  <div className={ClassNames(styles.container, className)}>
    <div className={styles.player}>
      {/* 主播 */}
      {anchor}
      <div className={styles.video}>
        <div className={styles.videoInner}>
          {/* 播放器 */}
          {player}
          {/* 动画 */}
          {animation}
        </div>
      </div>
      {/* 礼物 */}
      {gift}
    </div>
    <div className={styles.message}>
      {/* 消息 */}
      {message}
    </div>
  </div>
);

export default Layout;
