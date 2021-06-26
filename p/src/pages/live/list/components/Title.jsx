import React from 'react';
import ClassNames from 'classnames';
import { empty } from '@/utils/common';
import RenderJudge from '@/components/RenderJudge';

import styles from '../style/Title.scss';

const Title = ({ label, list, value, onChange }) => {
  const onChangeHandle = (v) => {
    if (value === v) return;

    return onChange(v);
  };

  return (
    <div className={styles.container}>
      <RenderJudge
        value={list.length}
        active={(
          <div className={ClassNames(styles.label, styles.isPointer)} onClick={() => onChangeHandle(null)}>{label}</div>
      )}
        inactive={(
          <div className={styles.label}>{label}</div>
      )}
      />
      <RenderJudge
        value={list.length}
        active={(
          <div className={styles.classify}>
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
        )}
      />
    </div>
  );
};

Title.defaultProps = {
  label: null,
  list: [],
  value: null,
  onChange: empty
};

export default Title;
