import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ClassNames from 'classnames';
import { useRequest } from '@/utils/hooks';
import { getCalcLevel } from '@/utils/common';
import { UPDATE_LOGIN_REDUCER } from '@/actions/userAtion';
import { getOpensNotification, getUserInfo, updateOpensNotification, updatePublicField } from '@/servers/userServer';
import { HttpCode } from '@/enums';
import Snackbar from '@material-ui/core/Snackbar';
import Image from '@/components/Image';
import UserDefaultImage from '@/assets/images/user_default_image.png';
import LoginLog from './LoginLog';
import UpdateNickname from './UpdateNickname';
import UpdatePhone from './UpdatePhone';
import UpdatePassword from './UpdatePassword';
import UpdateUserImage from './UpdateUserImage';

import styles from '../style/InfoPage.scss';

const InfoPage = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(({ user }) => user.userInfo);
  const [data, setData] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    msg:''
  });
  const [notification, setNotification] = useState({});
  useRequest(
    (q) => getUserInfo(q).toPromise(),
    {},
    (d) => {
      setData(d || {});
    }
  );
  useRequest(
    (q) => getOpensNotification(q).toPromise(),
    {},
    (d) => {
      setNotification(d || {});
    }
  );
  const nicknameRef = useRef();
  const phoneRef = useRef();
  const passwordRef = useRef();
  const userImageRef = useRef();

  const calcLevel = getCalcLevel(userInfo.levelId);

  // 修改用户字段
  const updateUserInfoField = (obj) => updatePublicField(obj)
    .toPromise()
    .then(({ data: { code, msg } }) => {
      if (HttpCode.SUCCESS === code) return data;

      return Promise.reject(msg);
    });

  // 打开修改昵称
  const onOpenUpdateNicknameHandle = () => nicknameRef.current.open();
  // 打开手机修改
  const onOpenUpdatePhoneHandle = () => phoneRef.current.open();
  // 打开密码修改
  const onOpenUpdatePasswordHandle = () => passwordRef.current.open();
  // input上传文件点击
  const onUploadFileChange = (e) => {
    const file = Array.prototype.slice.call(e.target.files)[0];
    e.target.value = null;
    return userImageRef.current.open(URL.createObjectURL(file));
  };
  // 设置基础设置
  const onSetNotificationHandle = async (f, v) => {
    const params = { [f]: v };
    const { data: { code } = {} } = await updateOpensNotification(params).toPromise();
    if (HttpCode.SUCCESS === code) {
      setNotification({
        ...notification,
        ...params
      });
    }
  };
  // 更新全局用户信息
  const updateGlobUserInfo = (d) => dispatch({
    type: `user/${UPDATE_LOGIN_REDUCER}`,
    payload: { data: d }
  });

  // 弹框修改成功后的回调
  const onSubmitHandle = (obj) => {
    setData({
      ...data,
      ...obj
    });

    const prop = {
      headImage: 'headImage',
      mobilePhone: 'mobilePhone',
      nickname: 'nickName',
      sex: 'sex'
    };
    const result = { ...userInfo };
    let saveFlag = false;
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const propValue = prop[key];
      if (propValue) {
        result[propValue] = value;
        saveFlag = true;
      }
    });
    if (saveFlag) updateGlobUserInfo(result);
  };

  // 性别修改
  const onGenderHandle = async (sex) => {
    if (sex === data.sex) return;
    const params = { sex };
    await updateUserInfoField(params);

    return onSubmitHandle(params);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>账号设置</div>
      <div className={styles.accountBox}>
        <div className={styles.item}>
          <div className={styles.label}>账号：</div>
          <div className={styles.value}>{data.account}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>昵称：</div>
          <div className={styles.value}>{data.nickname}</div>
          <div className={styles.link} onClick={onOpenUpdateNicknameHandle}>修改</div>
        </div>
        {/* <div className={styles.item}>
          <div className={styles.label}>手机：</div>
          <div className={styles.value}>{data.mobilePhone}</div>
        </div> */}
        <div className={styles.item}>
          <div className={styles.label}>性别：</div>
          <div className={styles.value}>
            <div
              className={ClassNames(styles.checkbox, { [styles.isActive]: data.sex === 0 })}
              onClick={() => onGenderHandle(0)}
            >
              男
            </div>
            <div
              className={ClassNames(styles.checkbox, { [styles.isActive]: data.sex === 1 })}
              onClick={() => onGenderHandle(1)}
            >
              女
            </div>
          </div>
        </div>
      </div>
      {/* <div className={styles.bind}> */}
      {/*  <Iconfont name="weixin" className={styles.icon} /> */}
      {/*  <div className={styles.label}>微信</div> */}
      {/*  <div className={styles.value}>ID:XYING</div> */}
      {/*  <div className={ClassNames(styles.button, styles.isActive)}>已绑定</div> */}
      {/* </div> */}
      {/* <div className={styles.bind}> */}
      {/*  <Iconfont name="qq" className={styles.icon} /> */}
      {/*  <div className={styles.label}>QQ</div> */}
      {/*  <div className={styles.value}>ka****@gmal.com</div> */}
      {/*  <div className={ClassNames(styles.button)}> */}
      {/*    <Iconfont name="jia" className={styles.buttonIcon} /> */}
      {/*    <span>绑定</span> */}
      {/*  </div> */}
      {/* </div> */}
      <div className={styles.title}>基础设置</div>
      <div className={styles.basisBox}>
        <div className={styles.item}>
          <div className={styles.label}>关注主播开播提醒</div>
          <div
            className={ClassNames(styles.switch, { [styles.isActive]: notification.anchorStartNotice })}
            onClick={(e) => onSetNotificationHandle('anchorStartNotice', !notification.anchorStartNotice)}
          />
        </div>
        <div className={styles.item}>
          <div className={styles.label}>赛程-红黄牌通知</div>
          <div
            className={ClassNames(styles.switch, { [styles.isActive]: notification.scheduleCardNotice })}
            onClick={(e) => onSetNotificationHandle('scheduleCardNotice', !notification.scheduleCardNotice)}
          />
        </div>
        <div className={styles.item}>
          <div className={styles.label}>赛程-进球通知</div>
          <div
            className={ClassNames(styles.switch, { [styles.isActive]: notification.scheduleGoalNotice })}
            onClick={(e) => onSetNotificationHandle('scheduleGoalNotice', !notification.scheduleGoalNotice)}
          />
        </div>
      </div>
      <div className={styles.title}>安全设置</div>
      <div className={styles.safeBox}>
        <div className={styles.item}>
          <div className={styles.label}>手机号码</div>
          <div className={styles.inner}>
            <div className={styles.placeholder}>**********</div>
            <div className={styles.button} onClick={onOpenUpdatePhoneHandle}>{data.mobilePhone ? '修改' : '绑定'}</div>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>登录密码</div>
          <div className={styles.inner}>
            <div className={styles.placeholder}>**********</div>
            <div className={styles.button} onClick={onOpenUpdatePasswordHandle}>{data.pwdFlag === 1 ? '修改' : '设置'}</div>
          </div>
        </div>
      </div>
      <div className={styles.userImageBox}>
        <Image className={ClassNames(styles.image, `borderLv${calcLevel}`)} src={data.headImage} defaultImage={UserDefaultImage} />
        <div className={styles.button}>
          <span className={styles.label}>修改头像</span>
          <input
            type="file"
            accept="image/jpg,image/jpeg,image/png"
            className={styles.input}
            onChange={onUploadFileChange}
          />
        </div>
      </div>
      <LoginLog />
      <UpdateNickname ref={nicknameRef} onSubmit={onSubmitHandle} onShowMsg={setSnackbar} />
      <UpdateUserImage ref={userImageRef} onSubmit={onSubmitHandle} />
      <UpdatePhone ref={phoneRef} onSubmit={onSubmitHandle} bindMobile={userInfo.mobilePhone} onShowMsg={setSnackbar} />
      <UpdatePassword ref={passwordRef} pwdFlag={data.pwdFlag} onShowMsg={setSnackbar} />
      <Snackbar
        autoHideDuration={1000}
        onClose={() => {
          setSnackbar({ ...snackbar, open: false });
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbar.open}
        message={snackbar.msg}
        key={'default'}
      />
    </div>
  );
};

export default InfoPage;
