import React, { useState } from 'react';
import ClassNames from 'classnames';
import { empty } from '@/utils/common';
import RenderJudge from '@/components/RenderJudge';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Iconfont from '@/components/Iconfont';

import styles from './index.scss';

const Select = ({ label, value, width, list, onChange, placeholder, arrow, inputStyle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { label: labelText } = list.find((row) => row.value === value) || {};

  const onChangeHandle = (v) => {
    if (v !== value) onChange(v);

    return setAnchorEl(null);
  };

  return (
    <>
      <div className={styles.anchor} onClick={(event) => setAnchorEl(event.currentTarget)}>
        <RenderJudge
          value={label}
          active={label}
          inactive={(
            <div className={styles.wrapper}>
              <input
                placeholder={placeholder}
                style={{ width: `${width}px`, ...inputStyle }}
                className={styles.input}
                readOnly="readonly"
                value={labelText || ''}
              />
              <Iconfont name="xiala" className={ClassNames(styles.suffixIcon, { [styles.isActive]: !!anchorEl })} />
            </div>
          )}
        />
      </div>
      <Popper
        className={ClassNames(styles.container, { [styles.isArrow]: arrow })}
        open={!!anchorEl}
        anchorEl={anchorEl}
        transition
        disablePortal
        style={{ width: `${width}px` }}
        placement="bottom-start"
      >
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
          <div className={styles.content}>
            {list.map((row, index) => (
              <div
                className={ClassNames(styles.item, { [styles.isActive]: value === row.value })}
                onClick={() => onChangeHandle(row.value)}
                key={index}
              >
                {row.label}
              </div>
            ))}
          </div>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

Select.defaultProps = {
  placeholder: '请选择',
  arrow: true,
  width: 180,
  list: [],
  onChange: empty
};

export default Select;
