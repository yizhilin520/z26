import React from 'react';
import ClassNames from 'classnames';
import { empty } from '@/utils/common';
import RenderJudge from '@/components/RenderJudge';

import styles from '../style/Title.scss';

const Title = ({ className, label, value, list, onChange, children }) => {
  const onChangeHandle = (v) => {
    if (value === v) return;

    return onChange(v);
  };
  return (
    <div className={ClassNames(styles.container, className)}>
      <div className={styles.label}>{label}</div>
      <RenderJudge
        value={list.length}
        active={(
          <div className={styles.wrapper}>
            {list.map((row, index) => (
              <div
                className={ClassNames(styles.item, { [styles.isActive]: row.value === value })}
                onClick={() => onChangeHandle(row.value)}
                key={index}
              >
                {row.label}
              </div>
            ))}
          </div>
        )}
      />
      {children}
    </div>
  );
};

Title.defaultProps = {
  list: [],
  onChange: empty
};

export default Title;
