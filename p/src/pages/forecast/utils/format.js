import dayJs from 'dayjs';

export const timeFormat = (date) => {
  if (!date) return;
  let result;

  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const now = new Date().getTime();
  const dayInstance = dayJs(date);
  const diffValue = now - dayInstance.valueOf();

  const dayC = Math.floor(diffValue / day);
  const hourC = Math.floor(diffValue / hour);
  const minC = Math.floor(diffValue / minute);

  if (dayC > 30) {
    result = dayInstance.format('YYYY-MM-DD HH:mm');
  } else if (dayC > 1) {
    result = `${dayC}天前发布`;
  } else if (dayC === 1) {
    result = '昨天发布';
  } else if (hourC >= 1) {
    result = `${hourC}小时前发布`;
  } else if (minC >= 5) {
    result = `${minC}分钟前发布`;
  } else {
    result = '刚刚发布';
  }

  return result;
};

/**
 * 毫秒转换
 * @param millisecond
 * @return {{hour: (string|number), minute: (string|number), second: (string|number)}}
 */
export const millisecondFormat = (millisecond) => {
  const result = millisecond / 1000;
  const h = Math.floor(result / 3600) < 10 ? `0${Math.floor(result / 3600)}` : Math.floor(result / 3600);
  const m = Math.floor((result / 60 % 60)) < 10 ? `0${Math.floor((result / 60 % 60))}` : Math.floor((result / 60 % 60));
  const s = Math.floor((result % 60)) < 10 ? `0${Math.floor((result % 60))}` : Math.floor((result % 60));

  return { hour: h || 0, minute: m || 0, second: s || 0 };
};
