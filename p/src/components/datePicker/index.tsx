import React, { useState } from 'react';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';

import { zhCN } from 'date-fns/locale';

import 'react-datepicker/dist/react-datepicker.css';
import './date.css';

registerLocale('zhCN', zhCN);

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';
const getWeekByDay = (dayValue: any) => {
  const day = new Date(Date.parse(dayValue.replace(/-/g, '/')));
  const today = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  return today[day.getDay()];
};
const DatePickers = (props: any) => {
  const [startDate, setStartDate] = useState<any>();
  const setDate = (dayValue: any) => {
    setStartDate(dayValue);
    props.activeTabs(dayValue);
  };
  return (
    <div className="warp11">
      <DatePicker
        selected={startDate}
        onChange={(date) => setDate(date)}
        dateFormat="yyyy/MM/dd"
        placeholderText="日历"
        locale="zhCN"
      />
    </div>
  );
};

export default DatePickers;
