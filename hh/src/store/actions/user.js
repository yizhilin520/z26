import { useDispatch } from 'react-redux';
import { SET_USER_TOKEN } from '../types/user';

export default () => {
  const dispatch = useDispatch();

  return {
    // 设置token
    setUserToken: (token) => dispatch({ type: SET_USER_TOKEN, data: token })
  };
};
