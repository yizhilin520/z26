import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ClassNames from 'classnames';
import phoneAreaCodeList from '@/utils/phoneAreaCode';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Iconfont from '@/components/Iconfont';
import RenderJudge from '@/components/RenderJudge';

import { useInterval, useSafeState } from '@/utils/hooks';
import { bindPhone, getCode } from '@/servers/userServer';
import { UPDATE_LOGIN_REDUCER } from '@/actions/userAtion';
import { HttpCode } from '@/enums';
import styles from '../style/BindPhone.scss';

const PhoneCodeSelect = ({ value, onChange }) => {
  const onChangeHandle = (v) => onChange(v);
  return (
    <ClickAwayListener onClickAway={() => onChangeHandle(value)}>
      <div className={styles.codeContainer}>
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

const BindPhone = ({ onChangeListView }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(({ user }) => user || {});
  const [showCode, setShowCode] = useState(false);
  const [phoneCode, setPhoneCode] = useState('86');
  const [message, setMessage] = useState({});
  const [value, setValue] = useState({});
  const [countdown, setCountdown] = useSafeState(0);
  // 打开手机区域码框
  const onShowCodeHandle = () => setShowCode(true);
  // 手机区域码改变
  const onPhoneCodeChange = (v) => {
    setPhoneCode(v);
    setShowCode(false);
  };
  // input输入回调
  const onInputChangeHandle = (field, event) => setValue({ ...value, [field]: event.target.value });
  // 手机号码验证
  const phoneNumValid = () => {
    const { mobilePhone } = value;
    if (!mobilePhone) {
      setMessage({ mobilePhone: '手机号不能为空' });
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(mobilePhone)) {
      setMessage({ mobilePhone: '手机号格式错误' });
      return;
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
      setMessage({});
      return setCountdown(+data || 120);
    }

    return setMessage({ smsCode: msg });
  };
  // 提交
  const onSubmitHandle = async () => {
    const { mobilePhone, smsCode } = value;
    if (!phoneNumValid()) return;
    if (!smsCode) return setMessage({ smsCode: '验证码不能为空' });
    if (!/\d/.test(smsCode)) return setMessage({ smsCode: '验证码只能为数字' });

    const params = { mobilePhone, smsCode };
    const { data: { code, msg } } = await bindPhone(params).toPromise();

    if (HttpCode.SUCCESS === code) {
      dispatch({
        type: `user/${UPDATE_LOGIN_REDUCER}`,
        payload: { data: { ...userInfo, mobilePhone } }
      });
      return onChangeListView();
    }

    return setMessage({ smsCode: msg });
  };
  return (
    <div className={styles.container}>
      <div className={styles.title}>绑定手机</div>
      <Iconfont name="close" className={styles.close} onClick={onChangeListView} />
      <div className={styles.wrapper}>
        <div className={styles.item}>
          <div className={styles.content}>
            <div className={styles.areaCode} onClick={onShowCodeHandle}>
              <div className={styles.label}>{`+${phoneCode}`}</div>
              <Iconfont name="xiala" className={styles.icon} />
            </div>
            <input
              className={styles.input}
              placeholder="请输入手机号"
              onChange={(e) => onInputChangeHandle('mobilePhone', e)}
            />
          </div>
          <RenderJudge
            value={showCode}
            active={<PhoneCodeSelect value={phoneCode} onChange={onPhoneCodeChange} />}
          />
          <div className={styles.message}>{message.mobilePhone}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.content}>
            <input
              className={styles.input}
              placeholder="请输入验证码"
              value={value.smsCode || ''}
              maxLength={6}
              onChange={(e) => {
                const newText = e.target.value.replace(/[^\d]+/, '');

                return setValue({ ...value, smsCode: newText });
              }}
            />
            <RenderJudge
              value={countdown}
              active={<div className={ClassNames(styles.codeButton, styles.isDisable)}>{`重新获取(${countdown}s)`}</div>}
              inactive={<div className={styles.codeButton} onClick={onGetSmsCodeHandle}>获取验证码</div>}
            />
          </div>
          <div className={styles.message}>{message.smsCode}</div>
        </div>
        <div className={styles.submit} onClick={onSubmitHandle}>确认</div>
      </div>
    </div>
  );
};

export default BindPhone;
