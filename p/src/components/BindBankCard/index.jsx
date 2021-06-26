import React, { useRef } from 'react';
import ClassNames from 'classnames';
import { useSetState } from 'ahooks';
import { empty, getHiddenNumber } from '@/utils/common';
import { HttpCode } from '@/enums';
import { useSmsCodeCountdown } from '@/utils/hooks';
import { getCode, setBindBankCardInfo } from '@/servers/userServer';
import { useSnackbar } from '@/plugins';
import Form from '@/components/Form/Form';
import FormItem from '@/components/Form/FormItem';
import RenderJudge from '@/components/RenderJudge';

import styles from './style.scss';

// data参数为http://yapi.qihang2021.cn:3000/project/29/interface/api/873接口的入参
// idName、mobilePhone、idCard必传
const BindBankCard = ({ data, onSubmit }) => {
  const [formData, setFormData] = useSetState(data);
  const [codeCountdown, runCodeCountdown] = useSmsCodeCountdown();
  const { enqueueSnackbar } = useSnackbar();
  const formRef = useRef();

  // 验证配置
  const formRules = {
    cardNo: [
      { required: true, message: '请输入银行卡号' },
      { validator: (rule, value, callback) => callback(/^\d+$/.test(value) ? undefined : new Error('银行账号格式不正确')) },
      { min: 14, max: 19, message: '暂不支持该银行卡校验' }
    ],
    openBank: [{ required: true, message: '请输入开户银行' }],
    branchInfo: [{ required: true, message: '请输入支行地址' }],
    branchName: [{ required: true, message: '请输入支行名称' }],
    smsCode: [
      { required: true, message: '验证码不能为空' },
      { validator: (rule, value, callback) => callback(/^\d+$/.test(value) ? undefined : new Error('验证码只能为数字')) }
    ]
  };

  // input输入回调
  const onInputChangeHandle = (f, e) => setFormData({ [f]: e.target.value });

  // 获取验证码
  const onGetSmsCodeHandle = async () => {
    const params = { areaCode: '+86', mobilePhone: formData.mobilePhone, sendType: 1 };
    const { data: { code, msg, data: smsData } } = await getCode(params).toPromise();

    if (HttpCode.SUCCESS === code) {
      enqueueSnackbar('短信已发送，请注意查收您的手机');
      return runCodeCountdown(+smsData || 60);
    }

    return enqueueSnackbar(msg);
  };

  // 提交
  const onSubmitHandle = async () => {
    try {
      await formRef.current.validate();
    } catch (e) {
      return e;
    }

    const { data: { code, msg, data: bindData } } = await setBindBankCardInfo(formData).toPromise();

    if (HttpCode.SUCCESS === code) {
      enqueueSnackbar('银行卡绑定成功');
      return onSubmit(bindData);
    }

    return enqueueSnackbar(msg);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tips}>请确保您的输入的信息真实有效，如果有误，将会导致转账失败</div>
      <Form model={formData} rules={formRules} ref={formRef}>
        <div className={styles.form}>
          <FormItem prop="cardNo">
            {({ message }) => (
              <div className={styles.item}>
                <div className={styles.label}>银行帐号：</div>
                <div className={styles.content}>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="请输入银行卡号"
                    value={formData.cardNo || ''}
                    maxLength={20}
                    onChange={(e) => onInputChangeHandle('cardNo', e)}
                  />
                  <div className={ClassNames(styles.message, styles.isBottom)}>{message}</div>
                </div>
              </div>
            )}
          </FormItem>
          <FormItem prop="openBank">
            {({ message }) => (
              <div className={styles.item}>
                <div className={styles.label}>开户银行：</div>
                <div className={styles.content}>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="请输入开户银行"
                    value={formData.openBank || ''}
                    maxLength={20}
                    onChange={(e) => onInputChangeHandle('openBank', e)}
                  />
                  <div className={ClassNames(styles.message, styles.isBottom)}>{message}</div>
                </div>
              </div>
            )}
          </FormItem>
          <FormItem prop="branchInfo">
            {({ message }) => (
              <div className={styles.item}>
                <div className={styles.label}>支行地址：</div>
                <div className={styles.content}>
                  <input
                    style={{ width: '468px' }}
                    className={styles.input}
                    type="text"
                    placeholder="请输入支行地址"
                    value={formData.branchInfo || ''}
                    maxLength={20}
                    onChange={(e) => onInputChangeHandle('branchInfo', e)}
                  />
                  <div className={ClassNames(styles.message, styles.isBottom)}>{message}</div>
                </div>
              </div>
            )}
          </FormItem>
          <FormItem prop="branchName">
            {({ message }) => (
              <div className={styles.item}>
                <div className={styles.label}>支行名称：</div>
                <div className={styles.content}>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="请输入支行名称"
                    value={formData.branchName || ''}
                    maxLength={20}
                    onChange={(e) => onInputChangeHandle('branchName', e)}
                  />
                  <div className={styles.message}>举例 ：“深圳南山支行”</div>
                  <div
                    className={ClassNames(styles.message, styles.isBottom)}
                  >
                    {message || '请电话至开户行确认支行名称，填写错误将导致打款失败'}
                  </div>
                </div>
              </div>
            )}
          </FormItem>
          <div className={styles.item} style={{ marginTop: '18px' }}>
            <div className={styles.label}>开户姓名：</div>
            <div className={styles.content}>
              <div className={ClassNames(styles.input, styles.isLabel)}>{getHiddenNumber(formData.idName, 2, 0)}</div>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.label}>身份证号：</div>
            <div className={styles.content}>
              <div className={ClassNames(styles.input, styles.isLabel)}>{getHiddenNumber(formData.idCard, 4, 4)}</div>
              <div className={styles.message}>如需更换实名认证请联系客服</div>
            </div>
          </div>
          <FormItem prop="smsCode">
            {({ message }) => (
              <div className={styles.item}>
                <div className={styles.label}>验证码：</div>
                <div className={styles.content}>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="请输入验证码"
                    style={{ width: '178px' }}
                    value={formData.smsCode || ''}
                    maxLength={6}
                    onChange={(e) => onInputChangeHandle('smsCode', e)}
                  />
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
                  <div className={ClassNames(styles.message, styles.isBottom)}>
                    <span style={{ color: '#A9ADB9' }}>验证码将发送到手机</span>
                    <span
                      style={{ color: '#333', marginRight: '12px' }}
                    >
                      {getHiddenNumber(formData.mobilePhone, 3, 2)}
                    </span>
                    <span>{message || '如需更换手机号请至个人中心更换'}</span>
                  </div>
                </div>
              </div>
            )}
          </FormItem>
          <div className={styles.item}>
            <div className={styles.label} />
            <div className={styles.content}>
              <div className={styles.submit} onClick={onSubmitHandle}>立即提交</div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

BindBankCard.defaultProps = {
  onSubmit: empty
};

export default BindBankCard;
