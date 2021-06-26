import React, { useRef } from 'react';
import ClassNames from 'classnames';
import { useSetState } from 'ahooks';
import { empty } from '@/utils/common';
import { useSmsCodeCountdown } from '@/utils/hooks';
import { getCode, mobileCodeLogin } from '@/servers/userServer';
import { useSnackbar } from '@/plugins';
import { HttpCode } from '@/enums';
import RenderJudge from '@/components/RenderJudge';
import FormValid from '@/components/Form/Form';
import FormItemValid from '@/components/Form/FormItem';
import { Form, FormButton, FormInput, FormItem } from './Form';

import styles from '../style/LoginWithPhone.scss';

const LoginWithPhone = ({ onSuccess }) => {
  const [formData, setFormData] = useSetState();
  const [codeCountdown, runCodeCountdown] = useSmsCodeCountdown();
  const { enqueueSnackbar } = useSnackbar();
  const formRef = useRef();

  // 验证配置
  const formRules = {
    mobile: [
      { required: true, message: '手机号不能为空' },
      { validator: (rule, value, callback) => callback(/^1[3-9]\d{9}$/.test(value) ? undefined : new Error('手机号格式错误')) }
    ],
    smsCode: [
      { required: true, message: '验证码不能为空' },
      { validator: (rule, value, callback) => callback(/^\d+$/.test(value) ? undefined : new Error('验证码只能为数字')) }
    ]
  };
  // input输入回调
  const onInputChangeHandle = (field, event) => setFormData({ [field]: event.target.value });

  // 获取验证码
  const onGetSmsCodeHandle = async () => {
    try {
      await formRef.current.validate(null, 'mobile');
    } catch (e) {
      return e;
    }
    const { mobile } = formData;

    const params = { areaCode: '+86', mobilePhone: mobile, sendType: 0 };
    const { data: { code, msg, data } } = await getCode(params).toPromise();

    if (HttpCode.SUCCESS === code) {
      return runCodeCountdown(+data || 60);
    }

    return enqueueSnackbar(msg);
  };

  // 登录
  const onSubmitHandle = async () => {
    try {
      await formRef.current.validate();
    } catch (e) {
      return e;
    }
    const { mobile, smsCode } = formData;

    const params = { mobile, smsCode };
    const { data: { code, msg, data } } = await mobileCodeLogin(params).toPromise();

    if (HttpCode.SUCCESS === code) return onSuccess(data);

    return enqueueSnackbar(msg);
  };

  return (
    <FormValid model={formData} rules={formRules} ref={formRef}>
      <Form>
        <FormItemValid prop="mobile">
          {({ message }) => (
            <FormItem message={message}>
              <FormInput
                maxLength={11}
                prefix={(<div className={styles.codeSelect}>+86</div>)}
                placeholder="请输入手机号"
                onChange={(e) => onInputChangeHandle('mobile', e)}
              />
            </FormItem>
          )}
        </FormItemValid>
        <FormItemValid prop="smsCode">
          {({ message }) => (
            <FormItem message={message}>
              <FormInput
                placeholder="请输入验证码"
                maxLength={6}
                onChange={(e) => onInputChangeHandle('smsCode', e)}
                suffix={(
                  <RenderJudge
                    value={codeCountdown.disabled}
                    active={(
                      <div className={ClassNames(styles.codeButton, styles.isDisable)}>{codeCountdown.formatText}</div>
                    )}
                    inactive={(
                      <div
                        className={styles.codeButton}
                        onClick={onGetSmsCodeHandle}
                      >
                        {codeCountdown.formatText}
                      </div>
                    )}
                  />
                )}
              />
            </FormItem>
          )}
        </FormItemValid>
        <FormItem>
          <FormButton label="登录" onClick={onSubmitHandle} />
        </FormItem>
      </Form>
    </FormValid>
  );
};

LoginWithPhone.defaultProps = {
  onSuccess: empty
};

export default LoginWithPhone;
