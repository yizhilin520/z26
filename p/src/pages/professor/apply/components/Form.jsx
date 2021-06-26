import React from 'react';
import RenderJudge from '@/components/RenderJudge';

import styles from '../style/Form.scss';

const Form = ({ children }) => (
  <div className={styles.form}>{children}</div>
);

const Item = ({ labelWidth,labelText, inputWidth, label, message, children }) => (
  <div className={styles.item}>
    <RenderJudge
      value={label}
      active={<div className={styles.label} style={{ width: labelWidth }}>
        {labelText? <span className={styles.star}>* </span> :null}
        {label}
        </div>}
    />
    <div className={styles.content} style={{width:inputWidth}} >
      {children}
      <div className={styles.message}>{message}</div>
    </div>
  </div>
);

const Input = ({ placeholder, prefix, inputTag, suffix, type, maxLengthNub, ...props }) => (
  <div className={styles.input}>
    <RenderJudge
      value={prefix}
      active={(
        <div className={styles.prefix}>
          {prefix}
        </div>
      )}
    />
    <RenderJudge
      value={inputTag === 'input'}
      active={<input className={styles.inputInner} type={type} placeholder={placeholder} {...props} />}
    />
    <RenderJudge
      value={inputTag === 'textarea'}
      active={<textarea className={styles.textarInner} autoComplete="off" spellCheck="false" maxLength={maxLengthNub} placeholder={placeholder} {...props} />}
    />
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

Input.defaultProps = {
  placeholder: '请输入',
  inputTag: 'input',
  type: 'text'
};

const Button = ({ children, ...props }) => (
  <div className={styles.button} {...props}>{children}</div>
);

Form.Item = Item;
Form.Input = Input;
Form.Button = Button;

export default Form;
