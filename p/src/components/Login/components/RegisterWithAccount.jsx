import React, { useRef } from 'react';
import MD5 from 'md5';
import { useRequest, useSetState } from 'ahooks';
import { getRandCode, getRegister } from '@/servers/userServer';
import { HttpCode } from '@/enums';
import GraphCode from '@/components/GraphCode';
import FormValid from '@/components/Form/Form';
import FormItemValid from '@/components/Form/FormItem';
import { useSnackbar } from '@/plugins';
import { empty } from '@/utils/common';
import { Form, FormButton, FormInput, FormItem } from './Form';

import styles from '../style/RegisterWithAccount.scss';

const RegisterWithAccount = ({ onSuccess }) => {
  const [formData, setFormData] = useSetState();
  const { enqueueSnackbar } = useSnackbar();
  const formRef = useRef();

  const { data: { captchaKey, imgCode } = {}, refresh } = useRequest(
    () => getRandCode().toPromise(),
    {
      initialData: {}
    }
  );

  // 验证配置
  const formRules = {
    account: [
      { required: true, message: '用户名不能为空' },
      { validator: (rule, value, callback) => callback(/.*[\u4e00-\u9fa5]+.*/.test(value) ? new Error('用户名不能包含中文') : undefined) },
      {
        validator: (rule, value, callback) => {
          const reg = new RegExp("[`~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？?]", 'g');
          if (reg.test(value)) return callback(new Error('检测到非法字符串'));

          return callback();
        }
      },
      {
        validator: (rule, value, callback) => {
          if (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,11}$/.test(value)) return callback();

          return callback(new Error('请输入4-11位字母和数字的用户名'));
        }
      }
    ],
    password: [
      { required: true, message: '密码不能为空' },
      { validator: (rule, value, callback) => callback(/.*[\u4e00-\u9fa5]+.*/.test(value) ? new Error('密码不能包含中文') : undefined) },
      { min: 6, max: 12, message: '请输入6-12位字母或数字的密码' }
    ],
    confirmPassword: [
      { required: true, message: '确认密码不能为空' },
      { validator: (rule, value, callback) => callback(value !== formData.password ? new Error('密码两次输入不一致') : undefined) }
    ],
    imgCode: [
      { required: true, message: '验证码不能为空' },
      { validator: (rule, value, callback) => callback(value.length !== 4 ? new Error('验证码为4位') : undefined) }
    ]
  };

  // input输入回调
  const onInputChangeHandle = (field, event) => setFormData({ [field]: event.target.value });
  // 注册
  const onSubmitHandle = async () => {
    try {
      await formRef.current.validate();
    } catch (e) {
      return e;
    }
    const { account, password, confirmPassword, imgCode: formImgCode } = formData;
    const params = {
      account,
      password: MD5(password),
      confirmPassword: MD5(confirmPassword),
      imgCode: formImgCode,
      captchaKey
    };
    const { data: { code, msg, data } } = await getRegister(params).toPromise();

    if (HttpCode.SUCCESS === code) return onSuccess(data);

    return enqueueSnackbar(msg);
  };

  return (
    <FormValid model={formData} rules={formRules} ref={formRef}>
      <Form>
        <FormItemValid prop="account">
          {({ message }) => (
            <FormItem message={message}>
              <FormInput
                placeholder="请输入用户名"
                maxLength={11}
                onChange={(e) => onInputChangeHandle('account', e)}
              />
            </FormItem>
          )}
        </FormItemValid>
        <FormItemValid prop="password">
          {({ message }) => (
            <FormItem message={message}>
              <FormInput
                placeholder="请输入密码"
                maxLength={12}
                type="password"
                onChange={(e) => onInputChangeHandle('password', e)}
              />
            </FormItem>
          )}
        </FormItemValid>
        <FormItemValid prop="confirmPassword">
          {({ message }) => (
            <FormItem message={message}>
              <FormInput
                placeholder="请再次输入密码"
                maxLength={12}
                type="password"
                onChange={(e) => onInputChangeHandle('confirmPassword', e)}
              />
            </FormItem>
          )}
        </FormItemValid>
        <FormItemValid prop="imgCode">
          {({ message }) => (
            <FormItem message={message}>
              <FormInput
                placeholder="请输入图形验证码"
                maxLength={4}
                suffix={(<GraphCode className={styles.code} code={imgCode} onClick={refresh} />)}
                onChange={(e) => onInputChangeHandle('imgCode', e)}
              />
            </FormItem>
          )}
        </FormItemValid>
        <FormItem>
          <FormButton label="注册" onClick={onSubmitHandle} />
        </FormItem>
      </Form>
    </FormValid>
  );
};

RegisterWithAccount.defaultProps = {
  onSuccess: empty
};

export default RegisterWithAccount;
