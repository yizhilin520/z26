import { useSelector } from 'react-redux';

export default () => {
  const { token } = useSelector(({ user }) => user || {});
  return {
    // 获取token
    getUserToken: token,
    // 判断是否登录
    judgeLogin: !!token
  };
};
