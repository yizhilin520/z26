/**
 * @intro: 路由相关管理器.
 */
import { getRequestUrlParams, parseURL } from '@/utils/common';
import { SET_CHANNEL, SET_ROUTER_META } from './types';

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
  meta: {}
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
    default:
      return newState;
  }
  return newState;
};
