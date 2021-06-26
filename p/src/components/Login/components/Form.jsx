import React from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import RenderJudge from '@/components/RenderJudge';

import styles from '../style/Form.scss';

export const Form = ({ children }) => (
  <div className={styles.form}>
    {children}
    <div className={styles.protocol}>
      <span className={styles.text}>登录注册即同意</span>
      <Link className={ClassNames(styles.text, styles.isLink)} to="/protocol/user" target="_blank">《用户协议》</Link>
    </div>
  </div>
);

export const FormItem = ({ children, message }) => (
  <div className={styles.item}>
    {children}
    <RenderJudge
      value={message}
      active={(
        <div className={styles.message}>{message}</div>
      )}
    />
  </div>
);

export const FormInput = ({ placeholder, prefix, suffix, type, ...props }) => (
  <div className={styles.input}>
    <RenderJudge
      value={prefix}
      active={(
        <div className={styles.prefix}>
          {prefix}
        </div>
      )}
    />
    <input className={styles.inputInner} type={type} placeholder={placeholder} {...props} />
    <RenderJudge
      value={suffix}
      active={(
        <div className={styles.suffix}>
          {suffix}
        </div>
      )}
    />
  </div>
);

export const FormButton = ({ label, disable, ...props }) => (
  <div className={ClassNames(styles.button, { [styles.isDisable]: disable })} {...props}>{label}</div>
);
