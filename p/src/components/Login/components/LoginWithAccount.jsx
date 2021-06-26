import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import MD5 from 'md5';
import { useSetState } from 'ahooks';
import { empty } from '@/utils/common';
import { localStorageGet, localStoragePut } from '@/utils/regular';
import { useSnackbar } from '@/plugins';
import { getLogin } from '@/servers/userServer';
import { HttpCode } from '@/enums';
import FormValid from '@/components/Form/Form';
import FormItemValid from '@/components/Form/FormItem';
import { Form, FormButton, FormInput, FormItem } from './Form';

import styles from '../style/LoginWithAccount.scss';

const LoginWithAccount = ({ onSuccess }) => {
  const [formData, setFormData] = useSetState(localStorageGet('loginData') || {});
  const { enqueueSnackbar } = useSnackbar();
  const formRef = useRef();

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
      { min: 4, max: 11, message: '请输入4-11位字母或数字的用户名' }
    ],
    password: [
      { required: true, message: '密码不能为空' },
      { validator: (rule, value, callback) => callback(/.*[\u4e00-\u9fa5]+.*/.test(value) ? new Error('密码不能包含中文') : undefined) },
      { min: 6, max: 12, message: '请输入6-12位字母或数字的密码' }
    ]
  };

  // input输入回调
  const onInputChangeHandle = (field, event) => setFormData({ [field]: event.target.value });

  // 登录
  const onSubmitHandle = async () => {
    try {
      await formRef.current.validate();
    } catch (e) {
      return e;
    }
    const { account, password, storage } = formData;
    const params = { account, password: MD5(password) };
    const { data: { code, msg, data } } = await getLogin(params).toPromise();

    if (HttpCode.SUCCESS === code) {
      // 保存密码将数据存起来
      const saveData = { account, password: storage ? password : null, storage: !!storage };
      localStoragePut('loginData', saveData);
      return onSuccess(data);
    }

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
        <FormItem>
          <div className={styles.passwordContent}>
            <div
              className={ClassNames(styles.item, styles.isSave, { [styles.isActive]: formData.storage })}
              onClick={() => setFormData({ storage: !formData.storage })}
            >
              记住密码
            </div>
            <Link className={styles.item} to="/password/forgot" target="_blank">忘记密码</Link>
          </div>
        </FormItem>
        <FormItem>
          <FormButton label="登录" onClick={onSubmitHandle} />
        </FormItem>
      </Form>
    </FormValid>
  );
};

LoginWithAccount.defaultProps = {
  onSuccess: empty
};

export default LoginWithAccount;
