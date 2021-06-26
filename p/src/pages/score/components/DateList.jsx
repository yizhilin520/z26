import React from 'react';
import ClassNames from 'classnames';
import dayJs from 'dayjs';
import DatePicker, { registerLocale } from 'react-datepicker';
import { zhCN } from 'date-fns/locale';
import { empty } from '@/utils/common';
import Iconfont from '@/components/Iconfont';

import 'react-datepicker/dist/react-datepicker.css';
import '@/components/datePicker/date.scss';

import styles from '../style/DateList.scss';

registerLocale('zhCN', zhCN);

const dayJsInstance = dayJs();
const weekLabelArr = ['周天', '周一', '周二', '周三', '周四', '周五', '周六'];

const DateList = ({ value, isReverse, onChange }) => {
  const onChangeHandle = (v) => {
    if (value === v) return;

    return onChange(v);
  };

  const onDatePickerChangeHandle = (d) => onChangeHandle(dayJs(d).format('YYYYMMDD'));

  return (
    <div className={styles.container}>
      {weekLabelArr.map((row, index) => {
        const indexVal = weekLabelArr.length - 1;
        let currentInstance = dayJsInstance;
        if (isReverse) {
          // [11,12,13,...,今天]
          if (index !== indexVal) currentInstance = currentInstance.subtract(indexVal - index, 'day');
        } else if (index) {
          // [今天,11,12,13,...]
          currentInstance = currentInstance.add(index, 'day');
        }
        const isItToday = dayJsInstance.isSame(currentInstance);
        const rowVal = currentInstance.format('YYYYMMDD');

        return (
          <div
            className={ClassNames(styles.date, { [styles.isActive]: value === rowVal })}
            onClick={() => onChangeHandle(rowVal)}
            key={index}
          >
            <div className={styles.value}>{currentInstance.format('MM/DD')}</div>
            <div className={styles.label}>{isItToday ? '今天' : weekLabelArr[currentInstance.format('d')]}</div>
          </div>
        );
      })}
      <DatePicker
        selected={dayJs(value).toDate()}
        dateFormat="yyyy-MM-dd"
        placeholderText="结束日期"
        locale="zhCN"
        maxDate={isReverse ? new Date() : null}
        minDate={isReverse ? null : new Date()}
        onChange={onDatePickerChangeHandle}
        customInput={(
          <div className={styles.datePicker}>
            <Iconfont name="rili" className={styles.pickerIcon} />
            <div className={styles.pickerLabel}>日历</div>
            <Iconfont name="bq_ee" className={styles.pickerArrow} />
          </div>
        )}
        popperModifiers={{
          offset: {
            enabled: true,
            offset: '-115px'
          }
        }}
      />
    </div>
  );
};

DateList.defaultProps = {
  onChange: empty
};

export default DateList;
