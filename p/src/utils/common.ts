// @ts-ignore
import dayJs from 'dayjs';
import UaParserJs from 'ua-parser-js';
import { getDeviceId } from './require';
import { IsURL } from './regular';

const uaParserJs = new UaParserJs(navigator.userAgent);

export const empty = () => {
};

const mapTag = '[object Map]';
const setTag = '[object Set]';
const arrayTag = '[object Array]';
const objectTag = '[object Object]';
const argsTag = '[object Arguments]';

const boolTag = '[object Boolean]';
const dateTag = '[object Date]';
const numberTag = '[object Number]';
const stringTag = '[object String]';
const symbolTag = '[object Symbol]';
const errorTag = '[object Error]';
const regexpTag = '[object RegExp]';
const funcTag = '[object Function]';

const deepTag = [mapTag, setTag, arrayTag, objectTag, argsTag];

function forEach(array: Array<any>, iteratee: any) {
  let index = -1;
  const { length } = array;
  while (++index < length) {
    iteratee(array[index], index);
  }
  return array;
}

function isObject(target: any) {
  const type = typeof target;
  return target !== null && (type === 'object' || type === 'function');
}

function getType(target: any) {
  return Object.prototype.toString.call(target);
}

function getInit(target: any, type: any) {
  const Ctor = target.constructor;
  return new Ctor();
}

function cloneSymbol(targe: any) {
  return Object(Symbol.prototype.valueOf.call(targe));
}

function cloneReg(targe: any) {
  const reFlags = /\w*$/;
  const result = new targe.constructor(targe.source, reFlags.exec(targe));
  result.lastIndex = targe.lastIndex;
  return result;
}

function cloneFunction(func: any) {
  // const bodyReg = /(?<={)(.|\n)+(?=})/m;
  const bodyReg = new RegExp('(?<={)(.|\\n)+(?=})', 'm');
  // const paramReg = /(?<=\().+(?=\)\s+{)/;
  const paramReg = new RegExp('(?<=\().+(?=\)\s+{)');
  const funcString = func.toString();
  if (func.prototype) {
    const param = paramReg.exec(funcString);
    const body = bodyReg.exec(funcString);
    if (body) {
      if (param) {
        const paramArr = param[0].split(',');
        return new Function(...paramArr, body[0]);
      }
      return new Function(body[0]);
    }
    return null;
  }
  return eval(funcString);
}

function cloneOtherType(targe: any, type: any) {
  const Ctor = targe.constructor;
  switch (type) {
    case boolTag:
    case numberTag:
    case stringTag:
    case errorTag:
    case dateTag:
      return new Ctor(targe);
    case regexpTag:
      return cloneReg(targe);
    case symbolTag:
      return cloneSymbol(targe);
    case funcTag:
      return cloneFunction(targe);
    default:
      return null;
  }
}

export const deepCopy = (target: any, map = new WeakMap()) => {
  // 克隆原始类型
  if (!isObject(target)) {
    return target;
  }

  // 初始化
  const type = getType(target);
  let cloneTarget: any;
  if (deepTag.includes(type)) {
    cloneTarget = getInit(target, type);
  } else {
    return cloneOtherType(target, type);
  }

  // 防止循环引用
  if (map.get(target)) {
    return map.get(target);
  }
  map.set(target, cloneTarget);

  // 克隆set
  if (type === setTag) {
    target.forEach((value: any) => {
      cloneTarget.add(deepCopy(value, map));
    });
    return cloneTarget;
  }

  // 克隆map
  if (type === mapTag) {
    target.forEach((value: any, key: any) => {
      cloneTarget.set(key, deepCopy(value, map));
    });
    return cloneTarget;
  }

  // 克隆对象和数组
  const keys = type === arrayTag ? undefined : Object.keys(target);
  forEach(keys || target, (value: any, key: any) => {
    if (keys) {
      key = value;
    }
    cloneTarget[key] = deepCopy(target[key], map);
  });

  return cloneTarget;
};

// 获取比分参数
export const queryMatch = (params: string) => {
  const query: any = {};
  params.replace('?', '').split('&').forEach((item: any) => {
    const items = item.split('=');
    query[items[0]] = items[1];
  });
  return { ...query };
};

// 生成消息id
export const generateMsgId = () => String(new Date().getTime()) + Math.floor(Math.random() * 899 + 100);
// UUID
export const generateUUID: Function = () => {
  let d: number = new Date().getTime();
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now(); // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r: number = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};

// 时间格式
export const generateTime = () => {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const hourText = hour === 0 ? '00' : String(hour);
  const minuteText = minute < 10 ? `0${minute}` : String(minute);
  return `${hourText}:${minuteText}`;
};

/**
 * 秒格式化成分秒
 * @param second 秒
 * @param format 格式化 HH:mm:ss
 */
export const secondFormatter = (second, format = 'mm:ss') => {
  const h = Math.floor(second / 3600) < 10 ? `0${Math.floor(second / 3600)}` : Math.floor(second / 3600);
  const m = Math.floor((second / 60 % 60)) < 10 ? `0${Math.floor((second / 60 % 60))}` : Math.floor((second / 60 % 60));
  const s = Math.floor((second % 60)) < 10 ? `0${Math.floor((second % 60))}` : Math.floor((second % 60));

  return format.replace(/HH/g, h).replace(/mm/g, m).replace(/ss/g, s);
};

/**
 * 比分数据格式化
 * @param data []
 * @doc http://yapi.qihang2021.cn:3000/project/35/interface/api/417
 */
export const scoreDataFormat = (data: any[]) => {
  const [
    eventId, // 赛事ID	0
    startTime, // 开赛时间	1
    homeTeamName, // 主队名称	2
    awayTeamName, // 客队名称	3
    leagueName, // 联赛名称	4
    homeTeamId, // 主队ID	5
    awayTeamId, // 客队ID	6
    leagueId, // 联赛ID	7
    leagueLevel, // 联赛等级	8
    leagueColors, // 联赛颜色	9
    leagueLogo, // 联赛logo	10
    homeTeamRanking, // 主队排名	11
    awayTeamRanking, // 客队排名	12
    eventType, // 赛事类型	13
    f14, // 14
    extendedDescription, // 扩展说明	15
    theGameIsDividedIntoSeveralQuarters, // 比赛分几节	16
    isThereANanoAnimation, // 是否有纳米动画	17
    whetherToUseLiveVideo, // 是否用视频直播	18
    isItPopular, // 是否热门	19
    neutral, // 是否中立场	20
    gameTime, // 比赛进行时间(s)	21
    bigState, // 大状态	22
    smallState, // 小状态	23
    whetherThereIsIntelligence, // 是否有情报	24
    popularity, // 人气	25
    sortCode, // 排序码	26
    score, // 比分	27	比分
    exponent, // 指数	28	指数
    totalLens, // 总伦次	29
    currentRound, // 当前轮次	30
    anchorList, // 主播列表	31
    homeTeamLogo, // 主队logo	32
    awayTeamLogo, // 客队logo	33
    animationUrl// 动画地址 34
  ] = data || [];

  let scoreObj = {};
  if (eventType === 1) {
    // 比分（足球）
    const [
      homeTeamCurrentScore, // 全场主队得分:	0
      awayTeamCurrentScore, // 全场客队得分	1
      homeTeamHalfScore, // 半场主队得分	2
      awayTeamHalfScore, // 半场客队得分	3
      homeTeamRedCard, // 主队红牌	4
      awayRedCard, // 客队红牌	5
      homeTeamYellowCard, // 主队黄牌	6
      awayTeamYellowCard, // 客队黄牌	7
      homeTeamCornerKick, // 主队角球	8
      awayTeamCornerKick// 客队角球	9
    ] = score || [];

    scoreObj = {
      homeTeamCurrentScore, // 全场主队得分:	0
      awayTeamCurrentScore, // 全场客队得分	1
      homeTeamHalfScore, // 半场主队得分	2
      awayTeamHalfScore, // 半场客队得分	3
      homeTeamRedCard, // 主队红牌	4
      awayRedCard, // 客队红牌	5
      homeTeamYellowCard, // 主队黄牌	6
      awayTeamYellowCard, // 客队黄牌	7
      homeTeamCornerKick, // 主队角球	8
      awayTeamCornerKick// 客队角球	9
    };
  }
  if (eventType === 2) {
    // 比分（篮球）
    const [
      homeTeamCurrentScore, // 主队第当前得分	0
      awayTeamCurrentScore, // 客队第当前得分	1
      homeTeamScoredInTheFirstQuarter, // 主队第一节得分	2
      awayTeamScoredInTheFirstQuarter, // 客队第一节得分	3
      homeTeamScoredTheSecondQuarter, // 主队第二节得分	4
      awayTeamScoredTheSecondQuarter, // 客队第二节得分	5
      homeTeamScoreInTheThirdQuarter, // 主队第三节得分	6
      awayTeamScoredTheThirdQuarter, // 客队第三节得分	7
      homeTeamScoredTheFourthQuarter, // 主队第四节得分	8
      awayTeamScoredInTheFourthQuarter, // 客队第四节得分	9
      homeTeamOvertimeScore, // 主队加时得分	10
      awayTeamOvertimeScore// 客队加时得分	11
    ] = score || [];

    scoreObj = {
      homeTeamCurrentScore, // 主队第当前得分	0
      awayTeamCurrentScore, // 客队第当前得分	1
      homeTeamScoredInTheFirstQuarter, // 主队第一节得分	2
      awayTeamScoredInTheFirstQuarter, // 客队第一节得分	3
      homeTeamScoredTheSecondQuarter, // 主队第二节得分	4
      awayTeamScoredTheSecondQuarter, // 客队第二节得分	5
      homeTeamScoreInTheThirdQuarter, // 主队第三节得分	6
      awayTeamScoredTheThirdQuarter, // 客队第三节得分	7
      homeTeamScoredTheFourthQuarter, // 主队第四节得分	8
      awayTeamScoredInTheFourthQuarter, // 客队第四节得分	9
      homeTeamOvertimeScore, // 主队加时得分	10
      awayTeamOvertimeScore// 客队加时得分	11
    };
  }

  const [
    matchID, // 比赛ID	0
    homeTeamOdds, // 主队赔率	1
    asianHandicap, // 亚盘盘口	2
    awayTeamOdds, // 客队赔率	3
    asianHandicapInChinese, // 亚盘盘口中文表示	4
    homeBidder, // 标盘主	5
    awayBidder, // 标盘客	6
    standardAnd, // 标盘和	7
    bigOdds, // 大赔率	8
    sizeIndex, // 大小指标	9
    smallOdds, // 小赔率	10
    sizeIndicatorInChinese// 大小指标中文表示	11
  ] = exponent || [];

  return {
    eventId, // 赛事ID	0
    startTime, // 开赛时间	1
    homeTeamName, // 主队名称	2
    awayTeamName, // 客队名称	3
    leagueName, // 联赛名称	4
    homeTeamId, // 主队ID	5
    awayTeamId, // 客队ID	6
    leagueId, // 联赛ID	7
    leagueLevel, // 联赛等级	8
    leagueColors, // 联赛颜色	9
    leagueLogo, // 联赛logo	10
    homeTeamRanking, // 主队排名	11
    awayTeamRanking, // 客队排名	12
    eventType, // 赛事类型	13
    f14, // 14
    extendedDescription, // 扩展说明	15
    theGameIsDividedIntoSeveralQuarters, // 比赛分几节	16
    isThereANanoAnimation, // 是否有纳米动画	17
    whetherToUseLiveVideo, // 是否用视频直播	18
    isItPopular, // 是否热门	19
    neutral, // 是否中立场	20
    gameTime, // 比赛进行时间(s)	21
    bigState, // 大状态	22
    smallState, // 小状态	23
    whetherThereIsIntelligence, // 是否有情报	24
    popularity, // 人气	25
    sortCode, // 排序码	26
    score: scoreObj, // 比分	27
    // 指数	28
    exponent: {
      matchID, // 比赛ID	0
      homeTeamOdds, // 主队赔率	1
      asianHandicap, // 亚盘盘口	2
      awayTeamOdds, // 客队赔率	3
      asianHandicapInChinese, // 亚盘盘口中文表示	4
      homeBidder, // 标盘主	5
      awayBidder, // 标盘客	6
      standardAnd, // 标盘和	7
      bigOdds, // 大赔率	8
      sizeIndex, // 大小指标	9
      smallOdds, // 小赔率	10
      sizeIndicatorInChinese// 大小指标中文表示	11
    },
    totalLens, // 总伦次	29
    currentRound, // 当前轮次	30
    anchorList, // 主播列表	31
    homeTeamLogo, // 主队logo	32
    awayTeamLogo, // 客队logo	33
    animationUrl// 动画地址 34
  };
};

/**
 * 比赛指数数据格式化
 * @param data []
 * @doc http://yapi.qihang2021.cn:3000/project/35/interface/api/443
 */
export const scoreMatchOddFormat = (data = []) => {
  const [
    companyId, // 赔率公司ID
    companyName, // 赔率公司名称
    handicap, // 让球
    standard, // 标准盘
    bigSmall// 大小
  ] = data || [];
  const [
    atypeOfPlay, // 玩法类型
    ainitialHome, // 初赔主
    ainitialIndex, // 初盘盘口
    ainitialGuest, // 初赔客
    atimelyHome, // 及时赔主
    atimelyIndex, // 及时盘口
    atimelyGuest, // 及时赔客
    achangeTime // 变化时间
  ] = handicap || [];
  const [
    btypeOfPlay, // 玩法类型
    binitialHome, // 初赔主
    binitialSum, // 初赔和
    binitialGuest, // 初赔客
    btimelyHome, // 及时赔主
    btimelySum, // 及时赔和
    btimelyGuest, // 及时赔客
    bchangeTime// 变化时间
  ] = standard || [];
  const [
    ctypeOfPlay, // 玩法类型
    cinitialBig, // 初赔大
    cinitialBigSmall, // 初盘大小
    cinitialSmall, // 初赔小
    ctimelyBig, // 及时赔大
    ctimelyBigSmall, // 及时盘大小
    ctimelySmall, // 及时赔小
    cchangeTime// 变化时间
  ] = bigSmall || [];

  return {
    // 赔率公司ID
    companyId,
    // 赔率公司名称
    companyName,
    // 让球
    handicap: {
      typeOfPlay: atypeOfPlay, // 玩法类型
      initialHome: ainitialHome, // 初赔主
      initialIndex: ainitialIndex, // 初盘盘口
      initialGuest: ainitialGuest, // 初赔客
      timelyHome: atimelyHome, // 及时赔主
      timelyIndex: atimelyIndex, // 及时盘口
      timelyGuest: atimelyGuest, // 及时赔客
      changeTime: achangeTime // 变化时间
    },
    // 标准盘
    standard: {
      typeOfPlay: btypeOfPlay, // 玩法类型
      initialHome: binitialHome, // 初赔主
      initialSum: binitialSum, // 初赔和
      initialGuest: binitialGuest, // 初赔客
      timelyHome: btimelyHome, // 及时赔主
      timelySum: btimelySum, // 及时赔和
      timelyGuest: btimelyGuest, // 及时赔客
      changeTime: bchangeTime// 变化时间
    },
    // 大小
    bigSmall: {
      typeOfPlay: ctypeOfPlay, // 玩法类型
      initialBig: cinitialBig, // 初赔大
      initialBigSmall: cinitialBigSmall, // 初盘大小
      initialSmall: cinitialSmall, // 初赔小
      timelyBig: ctimelyBig, // 及时赔大
      timelyBigSmall: ctimelyBigSmall, // 及时盘大小
      timelySmall: ctimelySmall, // 及时赔小
      changeTime: cchangeTime// 变化时间
    }
  };
};

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

/**
 * 监听事件
 * @element dom
 * @event 事件名字
 * @handler 事件回调
 */
export const addEventListener = (() => {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  }
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
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  }
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

export const number2Chines = (n) => {
  const changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const unit = ['', '十', '百', '千', '万'];
  const num = Number.parseInt(n);
  const getWan = (temp) => {
    const strArr = temp.toString().split('').reverse();
    let newNum = '';
    for (let i = 0; i < strArr.length; i += 1) {
      newNum = (i === 0 && strArr[i] === 0 ? '' : (i > 0 && strArr[i] == 0 && strArr[i - 1] === 0 ? '' : changeNum[strArr[i]] + (strArr[i] === 0 ? unit[0] : unit[i]))) + newNum;
    }
    return newNum;
  };
  const overWan = Math.floor(num / 10000);
  let noWan = `${num % 10000}`;
  if (noWan.toString().length < 4) {
    noWan = `0${noWan}`;
  }
  return overWan ? `${getWan(overWan)}万${getWan(noWan)}` : getWan(num);
};

/**
 * 多级联动，根据最后一级的值获取联动数组
 * @param list 多级联动数组
 * @param value 最后一级的值
 * @param valueProp
 * @param childrenProp
 */
export const getArrayByLastValue = (list: Array<any> = [], value, valueProp = 'value', childrenProp = 'children') => {
  const len = list.length;
  if (!len) return [];

  for (let i = 0; i < len; i += 1) {
    const item = list[i];

    if (item[childrenProp]) {
      // 存在子孩子则继续递归
      const data = getArrayByLastValue(item[childrenProp], value, valueProp, childrenProp);

      if (data && data.length > 0) {
        return [item].concat(data);
      }
    } else if (item[valueProp] === value) {
      // 返回值
      return [item];
    }
  }

  return [];
};

/**
 * 获取隐藏数字 eg：getHiddenNumber('111222333', 3, 3)=>111***333
 * @param number 数字
 * @param startNum  开始值
 * @param endNum  结束值
 */
export const getHiddenNumber = (number, startNum = 4, endNum = 4) => {
  if (!number) return '';

  const numStr = String(number);
  if (numStr.length <= startNum + endNum) return numStr;

  const startStr = numStr.substr(0, startNum);
  const centerStr = numStr.substr(startNum, numStr.length - startNum - endNum);
  const endStr = numStr.substr(numStr.length - endNum);
  return `${startStr}${centerStr.replace(/\S/g, '*')}${endStr}`;
};

/**
 * 获取计算过后的等级（10的倍数）
 * @param level 原始等级
 */
export const getCalcLevel = (level) => {
  let val = Math.ceil(level / 10) * 10;
  if (Number.isNaN(val) || val < 1) val = 10;
  if (val > 50) val = 50;
  return val;
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
    platform: 'web',
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
  if (!IsURL(url)) return {};

  const aTag = document.createElement('a');
  // @ts-ignore
  aTag.href = aTag;

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
