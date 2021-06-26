/**
 * 获取百分比
 * @param val
 * @returns {string}
 */
export const getPercentage = (val) => {
  if (val) return `${(val * 100).toFixed(2)}%`;
  return '-';
};
/**
 * 获取返还率值  返还率（用D表示），胜，平，负的赔率分别用A，B，C表示：D = A*B*C / （A*B+B*C+A*C）
 * @param home 主胜
 * @param guest 客胜
 * @param flat  平局
 * @returns {number}
 */
export const getReturnRateValue = (home, guest, flat) => (home * guest * flat) / (home * guest + guest * flat + home * flat);

/**
 * 获取返回率文本  返还率（用D表示），胜，平，负的赔率分别用A，B，C表示：D = A*B*C / （A*B+B*C+A*C）
 * @param home 主胜
 * @param guest 客胜
 * @param flat  平局
 * @returns {string}
 */
export const getReturnRateLabel = (home, guest, flat) => getPercentage(getReturnRateValue(home, guest, flat));
/**
 * 获取胜率值
 * @param returnRate 返还率
 * @param val 主胜||平局||客胜
 */
export const getWinRateValue = (returnRate, val) => returnRate / val;

/**
 * 获取胜率文本
 * @param returnRate 返还率
 * @param val 主胜||平局||客胜
 * @returns {string}
 */
export const getWinRateLabel = (returnRate, val) => getPercentage(getWinRateValue(returnRate, val));
