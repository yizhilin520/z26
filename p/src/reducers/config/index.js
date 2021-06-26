/**
 * @intro: 配置相关管理器.
 */
import { SET_GLOBAL_SWITCH_CONFIG } from './types';

const defaultState = {
  // 全局开关
  globalSwitch: {}
};

export default (state = defaultState, { type, data }) => {
  const newState = { ...state };
  switch (type) {
    case SET_GLOBAL_SWITCH_CONFIG:
      newState.globalSwitch = data || {};
      break;
    default:
      return newState;
  }
  return newState;
};
