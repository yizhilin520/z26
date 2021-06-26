import React from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import ZIndex from '@/components/zIndex';
import BlueLogoImage from '@/assets/images/header/logo_blue_image.png';
import WhiteLogoImage from '@/assets/images/header/logo_white_image.png';
import MenuList from './components/MenuList';
import RightList from './components/RightList';
import { Context } from './utils/store';

import styles from './style/index.scss';

const Header = ({ logo, theme, isFixed, isHome, isLive, isScore, isForecast, animation, className }) => {
  const providerValue = {
    // 一些数据存储
    state: {
      // 主题
      theme,
      // 是否固定
      isFixed,
      // 是否是首页
      isHome,
      // 是否是直播
      isLive,
      // 是否是比分
      isScore,
      // 是否是预测
      isForecast
    }
  };
  return (
    <ZIndex tag="header" value={ZIndex.value.header} className={ClassNames(styles.container, className)}>
      <div className={ClassNames(styles.inner, styles[theme], { [styles.isFixed]: isFixed }, animation)}>
        <div className={styles.wrapper}>
          <Context.Provider value={providerValue}>
            <Link className={styles.logo} to="/">
              <img className={styles.logoImage} src={logo} alt="logo" />
            </Link>
            <MenuList />
            <RightList />
          </Context.Provider>
        </div>
      </div>
    </ZIndex>
  );
};

Header.theme = {
  white: 'white',
  transparent: 'transparent'
};

Header.animation = {
  none: null,
  fadeInDown: styles.fadeInDown
};

Header.logo = {
  blue: BlueLogoImage,
  white: WhiteLogoImage
};

Header.defaultProps = {
  theme: Header.theme.white,
  animation: Header.animation.none,
  logo: Header.logo.blue,
  isFixed: true,

  isHome: false,
  isLive: false,
  isScore: false,
  isForecast: false
};

export default Header;
