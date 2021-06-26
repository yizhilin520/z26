/**
 * 设置cookie
 * @param {string} name <cookie名称>
 * @param {string} value <cookie值>
 * @param {number} dateNum <cookie有效时间数值>
 * @param {string} dateType <cookie有效时间类型>
 */
export function setCookie(
  name: string,
  value: string,
  dateNum?: number,
  dateType?: string
) {
  let cookieVal: string = `${name}=${escape(value)}`;

  if (dateNum) {
    const exp = new Date();

    exp.setTime(exp.getTime() + getDateTypeTime(dateNum, dateType));
    cookieVal += `;expires=${exp.toUTCString()}`;
  }
  document.cookie = cookieVal;
}

/*
 * 根据传入时间类型获对应取时间戳
 * @param {number} dateNum <时间数值>
 * @param {string} dateType <时间格式，如果不传默认返回天的时间戳>
 */
export function getDateTypeTime(dateNum: number, dateType?: string): number {
  const minuteTime: number = 60 * 1000;
  const hourTime: number = 60 * minuteTime;
  const dayTime: number = 24 * hourTime;

  switch (dateType) {
    case 'y':
      return dateNum * 365 * dayTime;
    case 'M':
      return dateNum * 30 * dayTime;
    case 'd':
      return dateNum * dayTime;
    case 'H':
      return dateNum * hourTime;
    case 'm':
      return dateNum * minuteTime;
    default:
      return dateNum * dayTime;
  }
}

/**
 *
 *
 * @export
 * @param {string} name
 * @returns any
 */
export function getCookie(name: string) {
  let arr: any;
  const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');

  if ((arr = document.cookie.match(reg))) {
    return unescape(arr[2]);
  } else {
    return null;
  }
}

/**
 * 创建action
 * @param type
 * @param payload
 */
export const createAction = (type: string, payload?: any) => {
  return {
    type,
    payload
  };
};
