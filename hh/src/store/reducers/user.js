import { SET_USER_TOKEN } from '../types/user';

const LOCAL_TOKEN_KEY = '_user_token';
const defaultStore = {
  token: localStorage.getItem(LOCAL_TOKEN_KEY)
};

export default (state = defaultStore, { type, data }) => {
  const newState = { ...state };
  switch (type) {
    // 设置token
    case SET_USER_TOKEN:
      if (data) {
        localStorage.setItem(LOCAL_TOKEN_KEY, data);
      } else {
        localStorage.removeItem(LOCAL_TOKEN_KEY);
      }
      newState.token = data || null;
      break;
    default:
      return newState;
  }
  return newState;
};
