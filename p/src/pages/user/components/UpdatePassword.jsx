import React, { forwardRef, useImperativeHandle, useState, useMemo } from 'react';
import ClassNames from 'classnames';
import { empty } from '@/utils/common';
import MD5 from 'md5';
import RenderJudge from '@/components/RenderJudge';
import { changePassword } from '@/servers/userServer';
import { HttpCode } from '@/enums';
import Dialog from './Dialog';
import iconEye from '@/pages/user/images/icon_eye.png';
import iconEyeClose from '@/pages/user/images/icon_eye_close.png';
import { confiPassWord, validatePwd } from '@/utils/regular'

import styles from '../style/UpdatePassword.scss';

const UpdatePassword = forwardRef(({pwdFlag, onShowMsg}, ref) => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState({});
  const [hiddenObj, setHiddenObj] = useState({
    oldPwd: true,
    newPwd: true,
    confirmPwd: true
  });
  // 密码
  const [errorRsg, setErrorRsg] =useState({
    errorStat: true,
    errorText:'',
    text: [
      '密码不能为空',
      '密码不能包含中文',
      '请输入6-12位包含字母或数字的密码',
      ''
    ]
  });
  const [errorRsg2, setErrorRsg2] =useState({
    errorStat: true,
    errorText:'',
    text: [
      '密码不能为空',
      '密码不能包含中文',
      '请输入6-12位包含字母或数字的密码',
      ''
    ]
  });
  const [errorRsg3, setErrorRsg3] =useState({
    errorStat: true,
    errorText: '',
    text: [
      '密码不能为空',
      '两次密码输入不一致',
      ''
    ]
  });

  // 6-12位字母或数字的正则
  const passwordReg = /^[A-Za-z0-9]{6,12}$/;

  // 打开
  const onOpenHandle = () => {
    setValue({});
    setVisible(true);
    setHiddenObj({
      oldPwd: true,
      newPwd: true,
      confirmPwd: true
    });
  };
  // 关闭
  const onCloseHandle = () => setVisible(false);
  // 提交
  const onSubmitHandle = async () => {
    if (isBtnDisable) return;
    if (pwdFlag && !errorRsg.errorStat) return;
    if (!errorRsg2.errorStat) return;
    if (!errorRsg3.errorStat) return;

    const { oldPassword, newPassword, confirmPassword } = value;
    const params = {
      newPassword: MD5(newPassword),
      confirmPassword: MD5(confirmPassword),
      pwdFlag
    };
    if (pwdFlag) params.oldPassword = MD5(oldPassword);
    const { data: { code, msg } } = await changePassword(params).toPromise();

    if (HttpCode.SUCCESS === code) {
      onShowMsg({
        open: true,
        msg: '操作成功'
      });
      return onCloseHandle();
    }
    onShowMsg({
      open: true,
      msg
    });
  };

  // 旧密码
  const oldPasssBlur = (val) =>{
    value.oldPassword = val;
    setValue({...value});
    let test = validatePwd(value.oldPassword);
    errorRsg.errorStat = test[0];
    errorRsg.errorText = errorRsg.text[test[1]];
    setErrorRsg({...errorRsg});
  };
  // 新密码
  const newPasssBlur = (val) =>{
    value.newPassword = val;
    setValue({...value});
    let test = validatePwd(value.newPassword);
    errorRsg2.errorStat = test[0];
    errorRsg2.errorText = errorRsg2.text[test[1]];
    setErrorRsg2({...errorRsg2});
  };
  // 确认密码
  const twoPasssBlur = (val) =>{
    value.confirmPassword = val;
    setValue({...value});
    let test = confiPassWord(value.newPassword, value.confirmPassword);
    errorRsg3.errorStat = test[0];
    errorRsg3.errorText = errorRsg3.text[test[1]];
    setErrorRsg3({...errorRsg3});
  };
  const handleEyeClick = (key) => {
    hiddenObj[key] = !hiddenObj[key];
    setHiddenObj({...hiddenObj});
  };
  const isBtnDisable = useMemo(() => {
    return !value.newPassword || !value.confirmPassword || (pwdFlag && !value.oldPassword)
  }, [value]);
  
  useImperativeHandle(ref, () => ({
    open: onOpenHandle,
    close: onCloseHandle
  }));

  return (
    <Dialog title="修改密码" visible={visible} onClose={onCloseHandle} width={380}>
      <div className={styles.pwdForm}>
        <RenderJudge
          value={pwdFlag}
          active={(
            <div className={ClassNames(styles.inputItem, {[styles.error]: !errorRsg.errorStat})}>
              <div className={styles.label}>旧密码：</div>
              <div className={styles.inputArea}>
                <input
                  className={styles.phoneinput1}
                  type={hiddenObj.oldPwd ? 'password' : 'text'}
                  maxLength={12}
                  placeholder='请输入旧密码'
                  onBlur={(e) =>{oldPasssBlur(e.target.value)}}
                  onChange={(e) =>{oldPasssBlur(e.target.value)}}
                />
                <img className={styles.icon} src={hiddenObj.oldPwd ? iconEyeClose : iconEye} onClick={() => handleEyeClick('oldPwd')} />
                <p className={styles.errorTip}>{errorRsg.errorText}</p>
              </div>
            </div>
          )}
        />
        <div className={ClassNames(styles.inputItem, {[styles.error]: !errorRsg2.errorStat})}>
          <div className={styles.label}>新密码：</div>
          <div className={styles.inputArea}>
            <input
              className={styles.phoneinput1}
              type={hiddenObj.newPwd ? 'password' : 'text'}
              maxLength={12}
              placeholder='请输入新密码'
              onBlur={(e) =>{newPasssBlur(e.target.value)}}
              onChange={(e) =>{newPasssBlur(e.target.value)}}
            />
            <img className={styles.icon} src={hiddenObj.newPwd ? iconEyeClose : iconEye} onClick={() => handleEyeClick('newPwd')} />
            <p className={styles.errorTip}>{errorRsg2.errorText}</p>
          </div>
        </div>
        <div className={ClassNames(styles.inputItem, {[styles.error]: !errorRsg3.errorStat})}>
          <div className={styles.label}>确认密码：</div>
          <div className={styles.inputArea}>
            <input
              className={styles.phoneinput1}
              type={hiddenObj.confirmPwd ? 'password' : 'text'}
              maxLength={12}
              placeholder='请输入确认密码'
              onBlur={(e) =>{twoPasssBlur(e.target.value)}}
              onChange={(e) =>{twoPasssBlur(e.target.value)}}
            />
            <img className={styles.icon} src={hiddenObj.confirmPwd ? iconEyeClose : iconEye} onClick={() => handleEyeClick('confirmPwd')} />
            <p className={styles.errorTip}>{errorRsg3.errorText}</p>
          </div>
        </div>
        <div
          className={ClassNames(styles.confirmBtn, {[styles.disabled]: isBtnDisable})}
          onClick={onSubmitHandle}
        >确认</div>
      </div>
    </Dialog>
  );
});

UpdatePassword.defaultProps = {
  onSubmit: empty
};

export default UpdatePassword;
