import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ClassNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import RenderJudge from '@/components/RenderJudge';
import { UPDATE_LOGIN_REDUCER } from '@/actions/userAtion';
import { getCalcLevel } from '@/utils/common';
import UserDefaultImage from '@/assets/images/user_default_image.png';
import Image from '@/components/Image';

import { withStyles } from '@material-ui/core/styles';
import styles from './style.scss';

const MaterialDialog = withStyles(() => ({
  container: {
    backgroundColor: 'rgba(0,0,0,.3)'
  },
  paper: {
    boxShadow: 'none',
    margin: 'auto',
    background: 'none',
    borderRadius: 0,
    overflowY: 'initial'
  }
}))(Dialog);

const UpgradeDialog = forwardRef((props, ref) => {
  // {currentLevel=10, optType=10, levelPrivileges=[
  // {iconUrl=xxx, code=change_card, content=改名卡, secondContent=Lv5解锁, level=5, status=1}
  // ],
  // type=10,
  // userId=1395625250400845825
  // }
  const [data, setData] = useState({});
  const [visible, setVisible] = useState(false);
  const userInfo = useSelector(({ user }) => user.userInfo || {});
  const dispatch = useDispatch();

  const list = useMemo(() => {
    const localLevel = userInfo.level || 0;
    const levelPrivileges = data?.levelPrivileges || [];
    const currentLevel = data?.currentLevel || 0;
    const currentCalcLevel = getCalcLevel(currentLevel);
    const localCalcLevel = getCalcLevel(localLevel);
    const showLocalAssets = (localLevel < 9 && currentLevel >= 9) || (currentLevel >= 10 && currentCalcLevel > localCalcLevel);

    if (showLocalAssets) {
      // 跨等级的身份勋章和头像框权益本地判断currentLevel是否为11 21 31 41 51 显示对应的本地资源
      return levelPrivileges.concat([{
        content: '获得身份徽章',
        customImage: (
          <div className={ClassNames(styles.levelImage, `lvLabel${currentCalcLevel}`)}>{`LV ${currentLevel}`}</div>
        )
      }, {
        content: '专属头像框',
        customImage: (<Image
          src={userInfo.headImage}
          defaultImage={UserDefaultImage}
          style={{ borderRadius: '100%', padding: '2px' }}
          className={ClassNames(styles.image, `borderLv${currentCalcLevel}`)}
        />)
      }]);
    }

    return levelPrivileges;
  }, [data]);

  // 打开
  const onOpenHandle = (d) => {
    setData(d || {});
    return setVisible(true);
  };
  // 关闭
  const onCloseHandle = () => {
    const levelId = data?.currentLevel || userInfo.levelId;
    // 更新用户信息
    dispatch({
      type: `user/${UPDATE_LOGIN_REDUCER}`,
      payload: { data: { ...userInfo, levelId, level: levelId } }
    });
    return setVisible(false);
  };

  useImperativeHandle(ref, () => ({
    open: onOpenHandle,
    close: onCloseHandle
  }));

  return (
    <MaterialDialog open={visible} maxWidth={false} scroll="body" hideBackdrop>
      <div className={styles.container}>
        <div className={styles.title}>
          <span className={styles.label}>升级至</span>
          <span className={ClassNames(styles.label, styles.isPrimary)}>{`Lv${data.currentLevel || 1}`}</span>
        </div>
        <div className={styles.summary}>恭喜您升级啦，继续加油，更多福利等你拿</div>
        <RenderJudge
          value={list.length}
          active={(
            <>
              <div className={styles.wrapper}>
                {list.map((row, index) => (
                  <div className={styles.item} key={index}>
                    <div className={styles.text}>{row.content}</div>
                    <RenderJudge
                      value={row.customImage}
                      active={row.customImage}
                      inactive={(
                        <img className={styles.image} src={row.iconUrl} />
                      )}
                    />
                  </div>
                ))}
              </div>
              <div className={styles.button} onClick={onCloseHandle}>开心收下</div>
            </>
          )}
          inactive={(
            <div className={styles.button} onClick={onCloseHandle}>知道了</div>
          )}
        />
      </div>
    </MaterialDialog>
  );
});

export default UpgradeDialog;
