import React from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import dayJs from 'dayjs';
import Iconfont from '@/components/Iconfont';
import LogoImage from '@/assets/images/header/logo_blue_image.png';
import DownloadQrCode from '@/assets/images/download_qrcode.jpg';

import styles from './style.scss';

const Footer = () => (
  <footer className={styles.container}>
    <div className={styles.wrapper}>
      <img src={LogoImage} className={styles.logo} />
      <div className={styles.menu}>
        <div className={styles.title}>直播</div>
        <Link to="/live/list/1" target="_blank" className={styles.item}>看足球</Link>
        <Link to="/live/list/2" target="_blank" className={styles.item}>看篮球</Link>
        <Link to="/live/list/3" target="_blank" className={styles.item}>看电竞</Link>
      </div>
      <div className={styles.menu}>
        <div className={styles.title}>赛事</div>
        <Link to="/score/football" target="_blank" className={styles.item}>足球比赛</Link>
        <Link to="/score/basketball" target="_blank" className={styles.item}>篮球比赛</Link>
        <div className={styles.item}>电竞比赛</div>
      </div>
      <div className={styles.download}>
        <div className={styles.textWrapper}>
          <div className={ClassNames(styles.text, styles.isTitle)}>下载U球APP</div>
          <div className={styles.text}>
            <Iconfont name="ios-circle" className={styles.textIcon} />
            <span className={styles.textBlock}>iphone版</span>
          </div>
          <div className={styles.text}>
            <Iconfont name="android-circle" className={styles.textIcon} />
            <span className={styles.textBlock}>Android版</span>
          </div>
        </div>
        <div className={styles.imageWrapper}>
          <img src={DownloadQrCode} className={styles.image} />
        </div>
      </div>
    </div>
    <div className={styles.copyright}>
      <div className={ClassNames(styles.text, styles.isLink)}>关于我们</div>
      <span className={styles.placeholder}>|</span>
      <div className={ClassNames(styles.text, styles.isLink)}>联系我们</div>
      <span className={styles.placeholder}>|</span>
      <div className={ClassNames(styles.text, styles.isLink)}>网站地图</div>
      <span className={styles.placeholder}>|</span>
      <Link to="/feedback" target="_blank" className={ClassNames(styles.text, styles.isLink)}>意见反馈</Link>
      <span className={styles.placeholder}>|</span>
      <div className={ClassNames(styles.text, styles.isLink)}>平台规则</div>
      <span className={styles.placeholder}>|</span>
      <Link to="/protocol/privacy" target="_blank" className={ClassNames(styles.text, styles.isLink)}>隐私政策</Link>
      <span className={styles.placeholder}>|</span>
      <Link to="/protocol/user" target="_blank" className={ClassNames(styles.text, styles.isLink)}>用户服务协议</Link>
    </div>
    <div className={styles.copyright}>
      <img className={styles.icon} src="//mat1.gtimg.com/www/images/qq2012/buliang.png" alt="中国互联网举报中心" />
      <div className={styles.text}>中国互联网 举报中心</div>
      <img className={styles.icon} src="//mat1.gtimg.com/www/images/qq2012/wmlogo.gif" alt="中国文明网传播文明" />
      <div className={styles.text}>中国文明网 传播文明</div>
    </div>
    <div className={styles.copyright}>
      <div className={styles.text}>{`版权所有Copyright © ${dayJs().format('YYYY')} U球直播 All Rights Reserved`}</div>
    </div>
  </footer>
);

export default Footer;
