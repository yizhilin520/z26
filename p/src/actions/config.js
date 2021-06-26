import { useDispatch } from 'react-redux';
import { SET_GLOBAL_SWITCH_CONFIG } from '@/reducers/config/types';

export default () => {
  const dispatch = useDispatch();

  return {
    // 设置开关
    setGlobalSwitchConfig: (data = {}) => dispatch({ type: SET_GLOBAL_SWITCH_CONFIG, data })
  };
};
