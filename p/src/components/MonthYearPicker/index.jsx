import React from 'react';
import ClassNames from 'classnames';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { useSetState } from 'ahooks';
import useSafeState from 'ahooks/lib/useSafeState';
import { empty } from '@/utils/common';

import styles from './style.scss';

const MonthYearPicker = ({ value, onChange, children }) => {
  const [date, setDate] = useSetState({ year: value?.getFullYear() || 0, month: value?.getMonth() || 0 });
  const [anchorEl, setAnchorEl] = useSafeState(null);

  // 打开
  const onOpenHandle = (el) => setAnchorEl(el.target || el);
  // 关闭
  const onCloseHandle = () => setAnchorEl(null);
  // 提交
  const onChangeHandle = (m) => {
    const now = new Date();
    now.setMonth(m);
    if (date.year) now.setFullYear(date.year);

    onCloseHandle();
    return onChange(now);
  };
  // input
  const input = React.cloneElement(children, { onClick: onOpenHandle });

  const list = [{
    label: '1月',
    value: 0
  }, {
    label: '2月',
    value: 1
  }, {
    label: '3月',
    value: 2
  }, {
    label: '4月',
    value: 3
  }, {
    label: '5月',
    value: 4
  }, {
    label: '6月',
    value: 5
  }, {
    label: '7月',
    value: 6
  }, {
    label: '8月',
    value: 7
  }, {
    label: '9月',
    value: 8
  }, {
    label: '10月',
    value: 9
  }, {
    label: '11月',
    value: 10
  }, {
    label: '12月',
    value: 11
  }];

  return (
    <>
      {input}
      <Popper open={!!anchorEl} anchorEl={anchorEl} transition placement="bottom">
        <ClickAwayListener onClickAway={onCloseHandle}>
          <div className={styles.container}>
            <div className={styles.header}>
              <span
                className={ClassNames(styles.arrow, styles.isLeft)}
                onClick={() => setDate({ year: date.year - 1 })}
              />
              <div className={styles.yearText}>{`${date.year}年`}</div>
              <span
                className={ClassNames(styles.arrow, styles.isRight)}
                onClick={() => setDate({ year: date.year + 1 })}
              />
            </div>
            <div className={styles.list}>
              {list.map((row, index) => (
                <div
                  className={ClassNames(styles.item, { [styles.isActive]: date.month === row.value })}
                  onClick={() => onChangeHandle(row.value)}
                  key={index}
                >
                  {row.label}
                </div>
              ))}
            </div>
          </div>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

MonthYearPicker.defaultProps = {
  value: new Date(),
  onChange: empty,
  children: (<input type="text" />)
};

export default MonthYearPicker;
