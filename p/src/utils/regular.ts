
/**
 * @账号验证特殊字符
 */
export const checkName: ($val: string) => any | void = val => {
  const reg = new RegExp(
    "[`~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？?]"
  );
  let rs = '';
  if (val) {
    for (let i = 0; i < val.length; i++) {
      rs = rs + val.substr(i, 1).replace(reg, '');
    }
  }
  if (val === '') {
    // 用户名不能为空
    return [false, 0]
  }
  if (/.*[\u4e00-\u9fa5]+.*/.test(val)) {
    // '用户名不能包含中文'
    return [false, 1]
  }
  if (rs !== val) {
    // 检测到非法字符串
    return [false, 2]
  }
  if (val.length > 11 || val.length < 4) {
    return [false, 3]
  }
  return [true, 4]
};

/**
 * @密码采用数字字母特殊字符且长度6到12位
 */
export const validatePwd: ($val: string) => any | void = val => {
  if (val === '') {
    // 密码不能为空
    return [false, 0]
  }
  if (/.*[\u4e00-\u9fa5]+.*/.test(val)) {
    // '密码不能包含中文'
    return [false, 1]
  }
  // 6-12位包含字母和数字
  if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(val)) {
    return [false, 2]
  }
  return [true, 3]
};

/**
 * @确认密码
 */
export const confirmPassword: ($password: string, $confirmPassword: string) => any | void = (password, confirmPassword) => {
  if (confirmPassword === '') {
    // 确定密码输入为空
    return [false, 0]
  }
  if (confirmPassword !== password) {
    // 两次密码输入不一致
    return [false, 1]
  }
  return [true, 0]
};

/**
 * @注册码验证
 */
export const testImgCode: ($val: string, form: any, code: string) => any | void = (val, form, code) => {
  // 验证不通过后
  if (val.length === 4 && val.toLowerCase() !== code.toLowerCase()) {
    return [false, 0]
  }
  if (val === '') {
    return [false, 1]
  }
  if (val.length !== 4) {
    return [false, 2]
  }
  // val && randCodeBtn() // 不为空的时候重新调用
  // setRegForm(form) // 解决数据清空问题
  return [true, null]
};
/**
 * @验证邮箱格式
 */
export const checkEmail: ($val: string) => boolean = val => {
  const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
  if (!reg.test(val)) {
    console.log('请输入符合规范的邮箱账号！');
    return false;
  }
  return true;
};

/**
 * @验证电话号码
 */
export const checkPhone: ($val: string) => boolean | undefined = val => {
  if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(val)) {
    console.log('手机号码有误，请重填');
    return false;
  }
};
/**
 * @验18位身份证号码
 */
export const idCardVildate: ($cid: string) => boolean = cid => {
  const arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const arrValid = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]; // 校验码
  const reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
  if (reg.test(cid)) {
    let sum = 0;
    let index;
    for (let i = 0; i < cid.length - 1; i++) {
      sum += parseInt(cid.substr(i, 1), 10) * arrExp[i];
    }
    index = sum % 11;
    return (
      arrValid[index] === ~~cid.substr(17, 1).toUpperCase() &&
      isValidityBrithBy18IdCard(cid)
    );
  } else {
    return false;
  }
};
/**
 * @验证18位数身份证号码中的生日是否是有效生日
 */
export const isValidityBrithBy18IdCard: (
  $idCard18: string
) => boolean = idCard18 => {
  const year = ~~idCard18.substring(6, 10);
  const month = idCard18.substring(10, 12);
  const day = idCard18.substring(12, 14);
  const temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
  if (
    temp_date.getFullYear() !== parseFloat(`${year}`) ||
    temp_date.getMonth() !== parseFloat(month) - 1 ||
    temp_date.getDate() !== parseFloat(day)
  ) {
    return false;
  } else {
    return true;
  }
};

/**
 * @验证只能输入正整数
 */
export const captCha: ($val: string, $codeLength: number) => boolean = (
  val,
  codeLength
) => /^[1-9]\d*$/.test(val) && val.length === codeLength;

/**
 * @金额验证只能有两个小数点
 */
export const moneyVerification: ($money: string) => boolean = money => {
  if (money.search(/^\d*(?:\.\d{0,2})?$/) === -1) {
    console.log('金额格式不对，最多有两位小数');
    return false;
  }
  return true;
};

/**
 * @域名url正则
 */
export const IsURL: ($str_url: string) => boolean = str_url => {
  const strRegex =
    '^((https|http|ftp|rtsp|mms)?://)' +
    "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + // ftp的user@
    '(([0-9]{1,3}.){3}[0-9]{1,3}' + // IP形式的URL- 199.194.52.184
    '|' + // 允许IP和DOMAIN（域名）
    "([0-9a-z_!~*'()-]+.)*" + // 域名- www.
    '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' + // 二级域名
    '[a-z]{2,6})' + // first level domain- .com or .museum
    '(:[0-9]{1,4})?' + // 端口- :80
    '((/?)|' + // a slash isn't required if there is no file name
    "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
  const re = new RegExp(strRegex);
  if (re.test(str_url)) {
    return true;
  } else {
    return false;
  }
};

/**
 * @IP地址正则
 */
export const IsIP: ($ip: string) => boolean = ip =>
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    ip
  );

/**
 * @微信正则
 */
export const wxRegular: ($wx: string) => boolean = wx =>
  /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/.test(wx);

/**
 * @QQ正则
 */

export const qqRegular: ($qq: string) => boolean = qq =>
  /^[1-9][0-9]{4,10}$/.test(qq);

// params => "2019-04-02 17:11:55" OR 1554257391000 (毫秒) 只需调用此函数
export const time = (params: number) => {
  var date = '';
  if(!params) return '数据错误'
  if (isNaN(params)) {
    // 判断是否是时间戳
    date = params.toString();
  } else {
    date = timeFormat(params);
  }
  var year = date.substring(0, 4);
  var month = date.substring(5, 7);
  var day = date.substring(8, 10);
  var hour = date.substring(11, 13);
  var minute = date.substring(14, 16);
  var seconds = date.substring(17, 19);
  var orignDate =
    year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + seconds;
  var yesterday = GetDateStr(-1); // 昨天
  var yesterdayStr = yesterday.split('-');
  yesterdayStr[1] =
    yesterdayStr[1].length === 1 ? '0' + yesterdayStr[1] : yesterdayStr[1];
  yesterdayStr[2] =
    yesterdayStr[2].length === 1 ? '0' + yesterdayStr[2] : yesterdayStr[2];

  var today = GetDateStr(0); // 今天
  var todayStr = today.split('-');
  todayStr[1] = todayStr[1].length === 1 ? '0' + todayStr[1] : todayStr[1];
  todayStr[2] = todayStr[2].length === 1 ? '0' + todayStr[2] : todayStr[2];

  var tomorrow = GetDateStr(1); // 明天
  var tomorrowStr = tomorrow.split('-');
  tomorrowStr[1] =
    tomorrowStr[1].length === 1 ? '0' + tomorrowStr[1] : tomorrowStr[1];
  tomorrowStr[2] =
    tomorrowStr[2].length === 1 ? '0' + tomorrowStr[2] : tomorrowStr[2];

  var afterTomorrow = GetDateStr(2); // 后天
  var afterTomorrowStr = afterTomorrow.split('-');
  afterTomorrowStr[1] =
    afterTomorrowStr[1].length === 1
      ? '0' + afterTomorrowStr[1]
      : afterTomorrowStr[1];
  afterTomorrowStr[2] =
    afterTomorrowStr[2].length === 1
      ? '0' + afterTomorrowStr[2]
      : afterTomorrowStr[2];

  if (
    year === yesterdayStr[0] &&
    month === yesterdayStr[1] &&
    day === yesterdayStr[2]
  ) {
    return '昨天' + ' ' + hour + ':' + minute;
  } else if (
    year === todayStr[0] &&
    month === todayStr[1] &&
    day === todayStr[2]
  ) {
    return '今天' + ' ' + hour + ':' + minute;
  } else if (
    year === tomorrowStr[0] &&
    month === tomorrowStr[1] &&
    day === tomorrowStr[2]
  ) {
    return '明天' + ' ' + hour + ':' + minute;
  } else if (
    year === afterTomorrowStr[0] &&
    month === afterTomorrowStr[1] &&
    day === afterTomorrowStr[2]
  ) {
    return '后天' + ' ' + hour + ':' + minute;
  } else {
    return orignDate;
  }
};

// 时间戳转化成时间格式
export const timeFormat = (timestamp: number) => {
  var time = new Date(timestamp);
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var date = time.getDate();
  var hours = time.getHours();
  var minutes = time.getMinutes();
  var seconds = time.getSeconds();
  return (
    year +
    '-' +
    add0(month) +
    '-' +
    add0(date) +
    ' ' +
    add0(hours) +
    ':' +
    add0(minutes) +
    ':' +
    add0(seconds)
  );
};

// 保证不出现个位数情况
function add0(m: any) {
  return m < 10 ? '0' + m : m;
}

function GetDateStr(AddDayCount: number) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount);
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;
  var d = dd.getDate();
  return y + '-' + m + '-' + d;
}

export const sessionStoragePut = (key: any, value: any) => {
  //将对象转化成json字符串，存入sessionStorage
  sessionStorage.setItem(key, JSON.stringify(value));
};
export const sessionStorageGet = (key: any, isRemove: any = '') => {
  //从sessionStorage中取出json字符串，然后将json字符串转化成对象,并返回.
  var val: any = sessionStorage.getItem(key);
  if (val) {
    var result: any = JSON.parse(val);
    if (isRemove) {
      sessionStorage.removeItem(key);
    }
    return result;
  }
}

// 永久存储
export const localStoragePut = (key: any, value: any) => {
  //将对象转化成json字符串，存入localStorage
  localStorage.setItem(key, JSON.stringify(value));
};
export const localStorageGet = (key: any, isRemove: any = '') => {
  //从localStorage中取出json字符串，然后将json字符串转化成对象,并返回.

  var val: any = localStorage.getItem(key);
  if (val) {
    var result: any = JSON.parse(val);
    if (isRemove) {
      localStorage.removeItem(key);
    }
    return result;
  }
}
export const getStatus = (status: any) => {
  status = parseInt(status);
  switch (status) {
    case 1:
      return '未开始';
    case 2:
      return '进行中';
    case 3:
      return '已完场';
    default:
      return '异常';
  }
};

export const getPlayStatus = (status: any) => {
  status = parseInt(status);
  switch (status) {
    case 0:
      return '未开始';
    case 1:
      return '上半场';
    case 2:
      return '下半场';
    case 11:
      return '第一节';
    case 12:
      return '第二节';
    case 13:
      return '第三节';
    case 14:
      return '第四节';
    case 20:
      return '加时';
    case 25:
      return '点球';
    case 31:
      return '中场';
    case 40:
      return '取消';
    case 41:
      return '延期';
    case 42:
      return '推迟';
    case 43:
      return '中断';
    default:
      return '完场';
  }
};

/**
 * @昵称验证
 */
export const checkNickname: ($val: string) => any | void = val => {
  const reg = new RegExp(
    "[`~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？?]"
  );
  let rs = '';
  if (val) {
    for (let i = 0; i < val.length; i++) {
      rs = rs + val.substr(i, 1).replace(reg, '');
    }
  }
  if (val === '') {
    // 用户名不能为空
    return [false, 0]
  }
  if (rs !== val) {
    // 检测到非法字符串
    return [false, 1]
  }
  if (val.length > 11 || val.length < 4) {
    return [false, 2]
  }
  return [true, 3]
};

/**
 * @确认密码
 */
export const confiPassWord: ($password: string, $confirmPassword: string) => any | void = (password, confirmPassword) => {
  if (confirmPassword === '') {
    // 确定密码输入为空
    return [false, 0]
  }
  if (confirmPassword !== password) {
    // 两次密码输入不一致
    return [false, 1]
  }
  return [true, 2]
};

/**
 * @手机验证
 */
export const validatePhone: ($val: string) => any | void = val => {
  if (val === '') {
    // 不能为空
    return [false, 0]
  }
  if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(val)) {
    // '手机号格式错误'
    return [false, 1]
  }
  return [true, 2]
};
/**
 * @验证码
 */
export const checkSmsCode: ($val: string) => any | void = val => {
  if (val === '') {
    // 不能为空
    return [false, 0]
  }
  if (!/^[0-9]{1,6}$/.test(val)) {
    // '验证码只能为数字'
    return [false, 1]
  }
  return [true, 2]
};


/**
 * @设置随机数
 */
export const MathNum = () => {
  return String(new Date().getTime()) + Math.floor(Math.random() * 899 + 100)
}

/**
 * @QQ验证
 */
 export const validateQq: ($val: string) => any | void = val => {
  if (val === '') {
    // 不能为空
    return [false, 0]
  }
  if (!/^[1-9][0-9]{4,10}$/.test(val)) {
    // 'qq号错误'
    return [false, 1]
  }
  return [true, 2]
};