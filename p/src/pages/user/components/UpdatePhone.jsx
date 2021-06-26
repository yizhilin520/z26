import React, { forwardRef, useImperativeHandle, useState } from 'react';
import ClassNames from 'classnames';
import { empty } from '@/utils/common';
import { bindPhone, changePhone, getCode } from '@/servers/userServer';
import { HttpCode } from '@/enums';
import phoneAreaCodeList from '@/utils/phoneAreaCode';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Iconfont from '@/components/Iconfont';
import RenderJudge from '@/components/RenderJudge';
import { useInterval } from '@/utils/hooks';
import Dialog from './Dialog';
import Form from './Form';

import styles from '../style/UpdatePhone.scss';

const PhoneCodeSelect = ({ value, onChange }) => {
  const onChangeHandle = (v) => onChange(v);
  return (
    <ClickAwayListener onClickAway={() => onChangeHandle(value)}>
      <div className={styles.codeList}>
        {phoneAreaCodeList.map((row, index) => (
          <div
            className={ClassNames(styles.codeItem, { [styles.isActive]: value === row.phone_code })}
            onClick={() => onChangeHandle(row.phone_code)}
            key={index}
          >
            <div className={styles.codeLabel}>{row.chinese_name}</div>
            <div className={styles.codeValue}>{`+${row.phone_code}`}</div>
          </div>
        ))}
      </div>
    </ClickAwayListener>
  );
};

PhoneCodeSelect.defaultProps = {
  onChange: empty
};

const UpdatePhone = forwardRef(({ onSubmit, bindMobile, onShowMsg }, ref) => {
  const [visible, setVisible] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [phoneCode, setPhoneCode] = useState();
  const [value, setValue] = useState({});
  const [countdown, setCountdown] = useState(0);
  const [step, setStep] = useState(0);

  // 打开
  const onOpenHandle = () => {
    setPhoneCode('86');
    setValue({});
    setCountdown(0);
    setVisible(true);
    setStep(0);
  };
  // 关闭
  const onCloseHandle = () => setVisible(false);
  // 打开手机区域码框
  const onShowCodeHandle = () => setShowCode(true);
  // 手机区域码改变
  const onPhoneCodeChange = (v) => {
    setPhoneCode(v);
    setShowCode(false);
  };
  // input输入回调
  const onInputChangeHandle = (field, event) => setValue({ ...value, [field]: event.target.value });
  const handleNext = () => {
    const { oldPhone } = value;
    let flag = false, msg = '';
    if (!oldPhone) {
      flag = true;
      msg = '手机号不能为空';
    } else if (!/^1[3-9]\d{9}$/.test(oldPhone)) {
      flag = true;
      msg = '手机号格式错误';
    } else if (oldPhone != bindMobile) {
      flag = true;
      msg = '原手机号不正确';
    }
    if (flag) {
      onShowMsg({
        open: true,
        msg
      });
      return;
    }
    setStep(1);
  };
  // 手机号码验证
  const phoneNumValid = () => {
    const { mobilePhone } = value;
    let flag = false, msg = '';
    if (!mobilePhone) {
      flag = true;
      msg = '手机号不能为空';
    } else if (!/^1[3-9]\d{9}$/.test(mobilePhone)) {
      flag = true;
      msg = '手机号格式错误';
    }
    if (flag) {
      onShowMsg({
        open: true,
        msg
      });
      return false;
    }
    return true;
  };
  // 验证码倒计时
  useInterval(() => setCountdown(countdown - 1), countdown > 0 ? 1000 : null);
  // 获取验证码
  const onGetSmsCodeHandle = async () => {
    const { mobilePhone } = value;
    if (!phoneNumValid()) return;

    const params = { areaCode: `+${phoneCode}`, mobilePhone, sendType: 4 };
    const { data: { code, msg, data } } = await getCode(params).toPromise();

    if (HttpCode.SUCCESS === code) {
      return setCountdown(+data || 120);
    }

    return onShowMsg({ open: true, msg });
  };
  // 提交
  const onSubmitHandle = async () => {
    const { mobilePhone, smsCode } = value;
    if (!phoneNumValid()) return;
    if (!smsCode) return onShowMsg({ open: true, msg: '验证码不能为空' });
    if (!/\d/.test(smsCode)) return onShowMsg({ open: true, msg: '验证码只能为数字' });

    const params = { mobilePhone, smsCode };
    const apiMethod = bindMobile ? changePhone : bindPhone;
    const { data: { code, msg } } = await apiMethod(params).toPromise();

    if (HttpCode.SUCCESS === code) {
      onCloseHandle();
      onShowMsg({ open: true, msg: '操作成功' });
      return onSubmit({ mobilePhone });
    }

    return onShowMsg({ open: true, msg });
  };

  useImperativeHandle(ref, () => ({
    open: onOpenHandle,
    close: onCloseHandle
  }));

  return (
    <Dialog title={bindMobile ? '修改手机号' : '绑定手机号'} visible={visible} onClose={onCloseHandle}>
      <RenderJudge
        value={bindMobile && step === 0}
        active={(
          <Form>
            <div className={styles.step1}>
              <span>请输入原绑定手机号:</span>
              <span className={styles.hiddenMobile}>{bindMobile && bindMobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</span>
            </div>
            <Form.Input
              maxLength={11}
              placeholder="请输入手机号"
              onChange={(e) => onInputChangeHandle('oldPhone', e)}
            />
            <div className={ClassNames(styles.button, {[styles.disabled]: !value.oldPhone})} style={{marginTop: '24px'}} onClick={handleNext}>下一步</div>
          </Form>
        )}
        inactive={(
          <Form>
            <Form.Item>
              <Form.Input
                prefix={(
                  <div className={styles.areaCode} onClick={onShowCodeHandle}>
                    <div className={styles.label}>{`+${phoneCode}`}</div>
                    <Iconfont name="xiala" className={styles.icon} />
                  </div>
                )}
                maxLength={11}
                placeholder="请输入您要绑定的手机号"
                onChange={(e) => onInputChangeHandle('mobilePhone', e)}
              />
              <RenderJudge
                value={showCode}
                active={<PhoneCodeSelect value={phoneCode} onChange={onPhoneCodeChange} />}
              />
            </Form.Item>
            <div className={styles.smsWrapper}>
              <Form.Input
                placeholder="请输入验证码"
                onChange={(e) => onInputChangeHandle('smsCode', e)}
              />
              <RenderJudge
                value={countdown}
                active={<div className={ClassNames(styles.codeButton, styles.isDisable)}>{`重新获取(${countdown}s)`}</div>}
                inactive={<div className={styles.codeButton} onClick={onGetSmsCodeHandle}>获取验证码</div>}
              />
            </div>
            <div className={ClassNames(styles.button, {[styles.disabled]: !value.mobilePhone || !value.smsCode})} onClick={onSubmitHandle}>确认</div>
          </Form>
        )}
      />
    </Dialog>
  );
});

UpdatePhone.defaultProps = {
  onSubmit: empty,
  onShowMsg: empty
};

export default UpdatePhone;
