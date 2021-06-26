import dayJs from 'dayjs';
import UaParserJs from 'ua-parser-js';
// eslint-disable-next-line import/no-cycle
import { getDeviceId } from './fetch';
import { isUrl } from './verify';

/**
 * @intro: 工具类.
 */

const uaParserJs = new UaParserJs(navigator.userAgent);
/**
 * 获取UUID
 * @returns {string}  uuid
 */
export const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  // eslint-disable-next-line no-bitwise
  const r = Math.random() * 16 | 0;
  // eslint-disable-next-line no-bitwise,no-mixed-operators
  const v = c === 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});
/**
 * 监听事件
 * @element dom
 * @event 事件名字
 * @handler 事件回调
 */
export const addEventListener = (() => {
  if (document.addEventListener) {
    // eslint-disable-next-line func-names
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  }
  // eslint-disable-next-line func-names
  return function (element, event, handler) {
    if (element && event && handler) {
      element.attachEvent(`on${event}`, handler);
    }
  };
})();

/**
 * 移除事件
 * @element dom
 * @event 事件名字
 * @handler 事件回调
 */
export const removeEventListener = (() => {
  if (document.removeEventListener) {
    // eslint-disable-next-line func-names
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  }
  // eslint-disable-next-line func-names
  return function (element, event, handler) {
    if (element && event) {
      element.detachEvent(`on${event}`, handler);
    }
  };
})();

/**
 * 只监听一次事件
 * @element dom
 * @event 事件名字
 * @handler 事件回调
 */
export const addOnceEventListener = (el, event, fn) => {
  // eslint-disable-next-line func-names
  const listener = function () {
    // eslint-disable-next-line prefer-rest-params
    if (fn) fn.apply(this, arguments);

    removeEventListener(el, event, fn);
  };
  addEventListener(el, event, listener);
};

/**
 * 获取url请求的参数
 * @param url
 * @return {}
 */
export const getRequestUrlParams = (url) => {
  const result = {};

  if (!url) return result;
  const urlSearchParams = new URLSearchParams(url.substr(url.indexOf('?')));

  urlSearchParams.forEach(((value, key) => {
    result[key] = value;
  }));

  return result;
};
/**
 * 空函数
 */
export const empty = () => {
};

/**
 * 获取随机数
 */
export const getRandomNumber = () => String(new Date().getTime()) + Math.floor(Math.random() * 899 + 100);

// 比分小状态格式化
export const scoreStatusFormat = (status) => {
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
  return label;
};

/**
 * 秒格式化成分秒
 * @param second 秒
 * @param format 格式化 HH:mm:ss
 */
export const secondFormatter = (second, format = 'mm:ss') => {
  const h = Math.floor(second / 3600) < 10 ? `0${Math.floor(second / 3600)}` : Math.floor(second / 3600);
  const m = Math.floor(((second / 60) % 60)) < 10 ? `0${Math.floor(((second / 60) % 60))}` : Math.floor(((second / 60) % 60));
  const s = Math.floor((second % 60)) < 10 ? `0${Math.floor((second % 60))}` : Math.floor((second % 60));

  return format.replace(/HH/g, h).replace(/mm/g, m).replace(/ss/g, s);
};

/**
 * 获取数据采集配置
 * @param opt
 */
export const getReportDataOptions = (opt) => {
  const { name, version } = uaParserJs.getOS();
  const { screen, location } = window;
  const { width: screenWidth, height: screenHeight } = screen;

  return {
    action: null,
    event_type: null,
    channel: null,
    refer: null,
    event_value: null,
    algorithm: null,
    duration: 0,
    country: null,
    region: null,
    city: null,
    userid: null,
    app_version: null,
    type: null,
    brand: null,
    other_info: null,
    ip: null,
    mac: null,
    androidid: null,
    sportType: null, //  运动类型  1 足球  2:篮球
    page_title: document.title,
    ...opt || {},
    platform: 'h5',
    page: location.href,
    deviceid: getDeviceId(),
    os_version: `${name}${version}`,
    resolution: `${screenWidth}x${screenHeight}`,
    time: dayJs().format('YYYY-MM-DD HH:mm:ss'),
    userAgent: uaParserJs.getUA()
  };
};

/**
 * 解析一个url地址(返回参数和location一样)
 * @param url
 */
export const parseURL = (url) => {
  if (!isUrl(url)) return {};

  const aTag = document.createElement('a');
  aTag.href = url;

  const { hash, host, hostname, href, origin, pathname, port, protocol, search } = aTag;

  return {
    hash,
    host,
    hostname,
    href,
    origin,
    pathname,
    port,
    protocol,
    search,
    params: getRequestUrlParams(search)
  };
};
