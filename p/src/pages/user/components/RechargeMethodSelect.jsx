import React from 'react';
import { empty } from '@/utils/common';
import Iconfont from '@/components/Iconfont';
import Select from '@/components/Select';

import styles from '../style/RechargeMethodSelect.scss';

const RechargeMethodSelect = ({ label, icon, value, list, onChange }) => {
  const { label: showLabel } = list.find(({ value: val }) => val === value) || { label: '全部' };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Iconfont name={icon} className={styles.icon} />
        <div className={styles.label}>{`${label}：`}</div>
        <Select
          value={value}
          list={list}
          onChange={onChange}
          width={90}
          arrow={false}
          label={(
            <div className={styles.select}>
              <span className={styles.selectLabel}>{showLabel}</span>
              <Iconfont name="xiala" className={styles.selectIcon} />
            </div>
          )}
        />
      </div>
    </div>
  );
};

RechargeMethodSelect.defaultProps = {
  list: [],
  onChange: empty
};

export default RechargeMethodSelect;
