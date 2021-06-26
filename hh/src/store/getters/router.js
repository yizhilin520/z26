import { useSelector } from 'react-redux';

export default () => {
  const { meta, channel, config } = useSelector(({ router }) => router || {});
  return {
    // 获取路由meta
    getRouterMeta: meta || {},
    // 渠道
    getChannel: channel,
    // 配置
    getConfig: config
  };
};
