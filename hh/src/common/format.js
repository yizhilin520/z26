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
  const m = Math.floor(((result / 60) % 60)) < 10 ? `0${Math.floor(((result / 60) % 60))}` : Math.floor(((result / 60) % 60));
  const s = Math.floor((result % 60)) < 10 ? `0${Math.floor((result % 60))}` : Math.floor((result % 60));

  return { hour: h || 0, minute: m || 0, second: s || 0 };
};

/**
 * 根据像素值转换成视图大小的像素值
 * @param num
 * @returns {number}
 */
export const viewSizeFormat = (num) => num / (750 / document.documentElement.clientWidth);
// 比分小状态格式化
export const scoreSmallStatusFormat = (status) => {
  const s = Number(status);
  const statusTextObj = {
    0: '未开始',
    1: '上半场',
    2: '下半场',
    11: '第一节',
    12: '第二节',
    13: '第三节',
    14: '第四节',
    20: '加时',
    21: '加时上半场',
    22: '加时下半场',
    25: '点球',
    31: '中场',
    40: '取消',
    41: '延期',
    42: '推迟',
    43: '中断',
    100: '完场',
    11100: '第一节 完',
    12100: '第二节 完',
    13100: '第三节 完',
    14100: '第四节 完',
    20100: '加时 完',
    21100: '加时上半场 完',
    22100: '加时下半场 完'
  };
  const label = statusTextObj[s];

  if (!label) {
    return {
      label: '异常',
      status,
      disable: true
    };
  }

  if (s !== 0 && s !== 40 && s !== 41 && s !== 42 && s !== 43) {
    return ({
      label,
      status,
      disable: false
    });
  }

  return {
    label,
    status,
    disable: true
  };
};
