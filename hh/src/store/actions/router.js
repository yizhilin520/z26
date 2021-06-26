import { useDispatch } from 'react-redux';
import { SET_ROUTER_META, SET_CHANNEL, SET_CONFIG } from '../types/router';

export default () => {
  const dispatch = useDispatch();

  return {
    // 设置路由meta
    setRouterMeta: (meta) => dispatch({ type: SET_ROUTER_META, data: meta }),
    // 设置渠道
    setChannel: (channel) => dispatch({ type: SET_CHANNEL, data: channel }),
    // 配置
    setConfig: (config) => dispatch({ type: SET_CONFIG, data: config })
  };
};
