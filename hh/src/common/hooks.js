import { useEffect } from 'react';
import SocketClient from 'socket.io-client';
import { useDocumentVisibility, useEventListener, usePersistFn, useRequest, useUnmount, useUpdateEffect } from 'ahooks';
import useSafeState from 'ahooks/lib/useSafeState';
import { dataActionReport } from '@/services/report';
import useRouterStore from '@/store/getters/router';
import { empty, getReportDataOptions } from './utils';

/**
 * websocket推送
 * @param _path 路径
 * @param msgCallback 消息回调
 * @return socket.io-client实例
 */
export const useWebsocketPush = (_path = '/', msgCallback = empty) => {
  const [instance, setInstance] = useSafeState();

  const listenObj = typeof msgCallback === 'function' ? { message: msgCallback } : msgCallback;
  const msgCallbackHandle = usePersistFn((handle, data, socket) => {
    if (typeof handle === 'function') handle(data, socket);
  });

  useEffect(() => {
    const socketInstance = SocketClient(
      `${process.env.WEBSOCKET_PUSH_API}${_path}`,
      { transports: ['websocket', 'xhr-polling', 'jsonp-polling'] }
    );

    Object.keys(listenObj).forEach((name) => {
      socketInstance.on(name, (str) => {
        let result;
        try {
          result = JSON.parse(str);
        } catch (e) {
          result = str;
        }
        msgCallbackHandle(listenObj[name], result, socketInstance);
      });
    });

    setInstance(socketInstance);

    return () => {
      if (socketInstance) socketInstance.disconnect();
    };
  }, []);

  return instance;
};

/**
 * 页面数据上报钩子
 * @param action 动作
 * @param ready 只有当 ready 为 true 时，才会发触发，默认为true
 * @param params 统计参数
 */
export const usePageViewDataReport = (action, { ready, params } = { ready: true }) => {
  const routerStore = useRouterStore();
  const paramsArr = Array.isArray(params) ? params : [params];
  const [nowTime, setNowTime] = useSafeState(Date.now());

  const { run } = useRequest(
    (q) => dataActionReport(q),
    {
      ready: action && ready,
      manual: true
    }
  );

  const reportHandle = () => {
    const now = Date.now();
    run(paramsArr.map((row) => (getReportDataOptions({
      ...row || {},
      action,
      event_type: 'pageview',
      channel: routerStore.getChannel,
      duration: Math.ceil((now - nowTime) / 1000)
    }))));
    setNowTime(now);
  };

  const documentVisibility = useDocumentVisibility();

  useUnmount(reportHandle);

  useEventListener('beforeunload', reportHandle, { target: window });

  useUpdateEffect(() => {
    if (documentVisibility === 'hidden') reportHandle();
  }, [documentVisibility]);
};
