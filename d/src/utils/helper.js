export default class helper {
  // 日期转化
  static dateFormat(t, style = 1) {
    const d = new Date();
    d.setTime(t);
    if (style === 2) {
      return `${d.getFullYear()}-${this.padLeadingZero(
        d.getMonth() + 1
      )}-${this.padLeadingZero(d.getDate())}`;
    } else if (style === 3) {
      return `${d.getFullYear()}-${this.padLeadingZero(d.getMonth() + 1)}`;
    }
    return `${d.getFullYear()}-${this.padLeadingZero(
      d.getMonth() + 1
    )}-${this.padLeadingZero(
      d.getDate()
    )} ${d.getHours()}:${this.padLeadingZero(
      d.getMinutes()
    )}:${this.padLeadingZero(d.getSeconds())}`;
  }
  // 补0
  static padLeadingZero(value) {
    if (value > 0) {
      return value > 9 ? value : `0${value}`;
    }
    return value;
  }
  // 判断是否为纯整数
  static checkInteger(value) {
    let reg = /^[1-9]\d*$|^0$/; // 注意：故意限制了 0321 这种格式，如不需要，直接reg=/^\d+$/;
    if (reg.test(value) === true) {
      return true;
    } else {
      return false;
    }
  }

  // 判断是否为数字
  static checkRate(value) {
    let re = /^[0-9]+(.[0-9]{0,3})?$/;
    if (re.test(value)) {
      return true;
    }
    return false;
  }
  // 判断是否为数字，并且可能为1位2位小数
  static checkRate2(value) {
    let re = /^[0-9]+(.[0-9]{1,2})?$/;
    if (re.test(value)) {
      return true;
    }
    return false;
  }

  // 验证金额
  /**
   * 数字校验（项目中用于校验金额的）：
    任意正整数，正小数（小数位不超过2位）
    var isNum=/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    可以匹配：
    1 | 1.0  | 1.01 | 0.00
    不能匹配：
    0. | .0 | 0.001 | -1 | +1
   * 
   * **/
  static checkMoney(val) {
    let reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    if (reg.test(value)) {
      return true;
    }
    return false;
  }

  //将秒数转换为时分秒格式
  static formatSeconds(value) {
    let theTime = parseInt(value); // 秒
    let middle = 0; // 分
    let hour = 0; // 小时

    if (theTime > 60) {
      middle = parseInt(theTime / 60);
      theTime = parseInt(theTime % 60);
      if (middle > 60) {
        hour = parseInt(middle / 60);
        middle = parseInt(middle % 60);
      }
    }
    let result = "" + this.padLeadingZero(parseInt(theTime)) + "秒";
    if (middle > 0) {
      if (hour > 0) {
        result = "" + this.padLeadingZero(parseInt(middle)) + "分" + result;
      } else {
        result = "" + parseInt(middle) + "分" + result;
      }
    }
    if (hour > 0) {
      result = "" + parseInt(hour) + "小时" + result;
    }
    return result;
  }
}
