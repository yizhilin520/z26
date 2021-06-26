import mean from 'lodash/mean';
import { getPercentage, getReturnRateValue, getWinRateLabel } from './formatter';

export default class ScoreCompute {
  constructor(data) {
    this.initHome = [];
    this.initSum = [];
    this.initGuest = [];
    this.timelyHome = [];
    this.timelySum = [];
    this.timelyGuest = [];

    this.push = this.push.bind(this);
    this.compute = this.compute.bind(this);

    data.forEach((row) => {
      const [, , , standardDisk] = row || [];
      const [, initHome, initSum, initGuest, timelyHome, timelySum, timelyGuest] = standardDisk || [];
      this.push(initHome, initSum, initGuest, timelyHome, timelySum, timelyGuest);
    });
  }

  push(initHome, initSum, initGuest, timelyHome, timelySum, timelyGuest) {
    if (initHome) this.initHome.push(initHome);
    if (initSum) this.initSum.push(initSum);
    if (initGuest) this.initGuest.push(initGuest);
    if (timelyHome) this.timelyHome.push(timelyHome);
    if (timelySum) this.timelySum.push(timelySum);
    if (timelyGuest) this.timelyGuest.push(timelyGuest);
  }

  compute(computeCb, label) {
    const computeHandle = (v) => {
      const val = computeCb(v);
      if (val) {
        // 浮点型保留两位小数，其他整数不处理
        const isFloat = val % 1 !== 0;

        return isFloat ? Math.round(val * 100) / 100 : val;
      }
      return '-';
    };

    const initHome = computeHandle(this.initHome);
    const initSum = computeHandle(this.initSum);
    const initGuest = computeHandle(this.initGuest);
    const timelyHome = computeHandle(this.timelyHome);
    const timelySum = computeHandle(this.timelySum);
    const timelyGuest = computeHandle(this.timelyGuest);

    const initRerunRateValue = getReturnRateValue(initHome, initGuest, initSum);
    const initRerunPercentage = getPercentage(initRerunRateValue);
    const initHomePercentage = getWinRateLabel(initRerunRateValue, initHome);
    const initGuestPercentage = getWinRateLabel(initRerunRateValue, initGuest);
    const initSumPercentage = getWinRateLabel(initRerunRateValue, initSum);

    const timelyRerunRateValue = getReturnRateValue(timelyHome, timelyGuest, timelySum);
    const timelyRerunPercentage = getPercentage(timelyRerunRateValue);
    const timelyHomePercentage = getWinRateLabel(timelyRerunRateValue, timelyHome);
    const timelyGuestPercentage = getWinRateLabel(timelyRerunRateValue, timelyGuest);
    const timelySumPercentage = getWinRateLabel(timelyRerunRateValue, timelySum);

    return {
      label,
      initHome,
      initSum,
      initGuest,
      timelyHome,
      timelySum,
      timelyGuest,
      initHomePercentage,
      initSumPercentage,
      initGuestPercentage,
      initRerunPercentage,
      timelyRerunPercentage,
      timelyHomePercentage,
      timelyGuestPercentage,
      timelySumPercentage
    };
  }

  get max() {
    const getMax = (v) => Math.max.apply(null, v);

    return this.compute(getMax, '最高值');
  }

  get min() {
    const getMin = (v) => Math.min.apply(null, v);

    return this.compute(getMin, '最低值');
  }

  get mean() {
    return this.compute(mean, '平均值');
  }
}
