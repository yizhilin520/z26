/**
 * @intro: 路由相关管理器.
 */
import { parseURL, getRequestUrlParams } from '@/common/utils';
import { SET_CHANNEL, SET_ROUTER_META, SET_CONFIG } from '../types/router';

const LOCAL_CHANNEL_KEY = '_router_channel';
const DEFAULT_CHANNEL = 'default';

const defaultState = {
  channel: (() => {
    const { origin } = parseURL(document.referrer);
    if (origin === window.location.origin) return DEFAULT_CHANNEL;
    const { channel } = getRequestUrlParams(window.location.search);
    if (channel) {
      localStorage.setItem(LOCAL_CHANNEL_KEY, channel);
      return channel;
    }

    return localStorage.getItem(LOCAL_CHANNEL_KEY) || DEFAULT_CHANNEL;
  })(),
  meta: {},
  config: {}
};

export default (state = defaultState, { type, data }) => {
  const newState = { ...state };
  switch (type) {
    case SET_ROUTER_META:
      newState.meta = data || {};
      break;
    case SET_CHANNEL:
      newState.channel = data || DEFAULT_CHANNEL;
      localStorage.setItem(LOCAL_CHANNEL_KEY, newState.channel);
      break;
    case SET_CONFIG:
      newState.config = data || {};
      break;
    default:
      return newState;
  }
  return newState;
};
