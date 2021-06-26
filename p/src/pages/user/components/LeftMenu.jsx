import React, { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ClassNames from 'classnames';
import { useRequest } from 'ahooks';
import { getTreasureChestList } from '@/servers/userServer';
import Dialog from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/core/styles';
import { getCalcLevel } from '@/utils/common';
import RenderJudge from '@/components/RenderJudge';
import Image from '@/components/Image';
import SignIn from '@/components/SignIn';
import UserDefaultImage from '@/assets/images/user_default_image.png';
import upgradeImg1 from '@/pages/user/images/upgrade1.png';
import upgradeImg2 from '@/pages/user/images/upgrade2.png';
import upgradeImg3 from '@/pages/user/images/upgrade3.png';
import upgradeImg4 from '@/pages/user/images/upgrade4.png';

import AnchorDialog from './BeAnchorDialog';

import styles from '../style/LeftMenu.scss';

const MaterialDialog = withStyles(() => ({
  paper: {
    borderRadius: 10,
    boxShadow: 'none'
  }
}))(Dialog);

// 升级弹窗
const UpgradeDialog = ({ visible, onClose }) => (
  <MaterialDialog open={visible}>
    <div className={styles.upgradeWrapper}>
      <div className={styles.upgradeTitle}>如何快速升级</div>
      <div className={styles.upgradeBody}>
        <div className={styles.upgradeMethod}>
          <img src={upgradeImg1} />
          <span>赠送主播礼物，经验嗖嗖长</span>
        </div>
        <div className={styles.upgradeMethod}>
          <img src={upgradeImg2} />
          <span>购买预测方案，收米+升级双重礼</span>
        </div>
        <div className={styles.upgradeMethod}>
          <img src={upgradeImg3} />
          <span>观看主播直播，经验送不停</span>
        </div>
        <div className={styles.upgradeMethod}>
          <img src={upgradeImg4} />
          <span>每日签到，经验等你收割</span>
        </div>
      </div>
      <div className={styles.upgradeFooter} onClick={onClose}>知道了</div>
    </div>
  </MaterialDialog>
);

const LeftMenu = ({ userName, userImage, joinDay, list, value, className, isAnchor, levelId, hasStationMsg }) => {
  const { uid } = useSelector(({ user }) => user.userInfo || {});
  const [showDialog, setShowDialog] = useState(false);
  const anchorRef = useRef();
  // 打开成为主播框
  const onOpenAnchorDialog = () => anchorRef.current.open();
  const calcLevel = getCalcLevel(levelId);

  // 获取是否已经签到了
  const signInRef = useRef();
  const [signInStatus, setSignInStatus] = useState(false);
  const { data: signInData } = useRequest(() => getTreasureChestList({ id: uid }).toPromise());
  const isSignIn = useMemo(() => signInStatus || (signInData || {}).isOpen, [signInData, signInStatus]);
  // 打开签到
  const onOpenSignInHandle = () => signInRef.current.open();
  // 签到提交后
  const onSignInSubmitHandle = () => setSignInStatus(true);

  return (
    <div className={ClassNames(styles.container, className, 'module-leftMenu')}>
      <div className={styles.userInfo}>
        <RenderJudge
          value={isSignIn}
          active={(<div className={styles.signIn} onClick={onOpenSignInHandle}>已签到</div>)}
          inactive={(<div className={styles.signIn} onClick={onOpenSignInHandle}>签到</div>)}
        />
        <Image
          src={userImage}
          defaultImage={UserDefaultImage}
          alt={userName}
          className={ClassNames(styles.userImage, `borderLv${calcLevel}`)}
        />
        <div className={styles.userName}>
          <span>{userName}</span>
          <div className={ClassNames(styles.level, `lvLabel${calcLevel}`)} onClick={() => setShowDialog(true)}>
            {`LV${levelId}`}
          </div>
        </div>
        <div className={styles.joinLabel}>
          <RenderJudge
            value={joinDay}
            active={`已加入U球${joinDay}天～`}
          />
        </div>
      </div>
      <div className={styles.menu}>
        {list.map((row, index) => (
          <div className={styles.item} key={index}>
            <Link
              to={`/user/${row.value}`}
              className={ClassNames(styles.inner, { [styles.isActive]: row.value === value })}
            >
              <img className={styles.icon} src={row.icon} />
              <div className={ClassNames(styles.label, { [styles.unread]: row.value === 'news' && hasStationMsg === 1 })}>{row.label}</div>
            </Link>
          </div>
        ))}
        {/* 成为主播 */}
        <RenderJudge
          value={!isAnchor}
          active={(<div className={styles.button} onClick={onOpenAnchorDialog}>成为主播</div>)}
        />
        <AnchorDialog ref={anchorRef} />
        <UpgradeDialog visible={showDialog} onClose={() => setShowDialog(false)} />
        <SignIn ref={signInRef} onSubmit={onSignInSubmitHandle} />
      </div>
    </div>
  );
};

LeftMenu.defaultProps = {
  list: []
};

export default LeftMenu;
