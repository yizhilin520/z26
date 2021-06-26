import { useDispatch } from 'react-redux';
import { SET_ROUTER_META, SET_CHANNEL } from '@/reducers/router/types';

export default () => {
  const dispatch = useDispatch();

  return {
    // 设置路由meta信息
    setRouterMeta: (meta = {}) => dispatch({ type: SET_ROUTER_META, data: meta }),
    // 设置渠道
    setChannel: (channel) => dispatch({ type: SET_CHANNEL, data: channel })
  };
};
