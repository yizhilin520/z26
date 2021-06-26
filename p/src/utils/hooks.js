import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useCountDown,
  useDocumentVisibility,
  useEventListener,
  useInterval,
  usePersistFn,
  useRequest as useAntRequest,
  useScroll,
  useSetState,
  useThrottleFn,
  useTimeout,
  useUnmount,
  useUnmountedRef,
  useUpdateEffect
} from 'ahooks';
import useSafeState from 'ahooks/lib/useSafeState';
// eslint-disable-next-line import/extensions
import SocketClient from 'socket.io-client';
import { HttpCode } from '@/enums';
import { UPDATE_OPEN_LOGIN } from '@/actions/homeAtion';
import { UPDATE_LoginOut_REDUCER } from '@/actions/userAtion';
import { dataActionReport } from '@/servers/report';
import { empty, getReportDataOptions } from './common';

export {
  useUnmountedRef,
  useSafeState,
  usePersistFn,
  useSetState,
  useTimeout,
  useInterval,
  useScroll
};

/**
 * 请求封装
 * @param fetchHandle 请求函数
 * @param reqData 请求数据
 * @param callback  回调
 * @param {useManual:手动调用}
 * @return {data:数据, loading:加载状态, error：请求错误, mutate: 手动触发}
 */
export const useRequest = (fetchHandle, reqData, callback = empty, { useManual } = {}) => {
  const [data, setData] = useSafeState();
  const [loading, setLoading] = useSafeState(true);
  const [error, setError] = useSafeState();

  const reqCallback = usePersistFn(callback);

  const requestHandle = usePersistFn(async (d = reqData) => {
    setLoading(true);
    try {
      const { data: rD } = await fetchHandle(d) || {};
      const rData = rD || {};
      const { code, data: resData, msg } = rData;
      if (code === HttpCode.SUCCESS) {
        setData(await reqCallback(resData) || resData);
      } else {
        setError(new Error(msg));
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    if (!useManual) {
      (async () => {
        await requestHandle(reqData);
      })();
    }
  }, []);

  return {
    data, loading, error, mutate: requestHandle
  };
};

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
 * 加载更多
 * @param container
 * @param method
 * @param disable
 * @param threshold
 * @param delay
 */
export const useLoadMore = ({ container = document, loadMore = empty, disable = false, threshold = 40, delay = 100 }) => {
  const { run } = useThrottleFn((top) => {
    const { documentElement, body } = document;

    const clientHeight = container.clientHeight || documentElement.clientHeight || body.clientHeight;
    const scrollHeight = container.scrollHeight || documentElement.scrollHeight || body.scrollHeight;

    if (scrollHeight - top <= clientHeight + threshold) loadMore();
  }, { wait: delay });

  useScroll(
    container,
    ({ top }) => {
      if (disable) return;

      run(top);

      return true;
    }
  );
};

/**
 * 登录相关
 */
export const useLogin = () => {
  const dispatch = useDispatch();
  const { token } = useSelector(({ user }) => (user.userInfo || {}));
  const loginOrRegisterHandle = (activeIndex) => dispatch({
    type: `home/${UPDATE_OPEN_LOGIN}`,
    payload: { activeIndex }
  });
  // 登录
  const loginHandle = () => loginOrRegisterHandle(0);
  // 注册
  const registerHandle = () => loginOrRegisterHandle(1);
  // 退出登录
  const logoutHandle = () => dispatch({ type: `user/${UPDATE_LoginOut_REDUCER}`, payload: { userInfo: {} } });

  return {
    isLogin: !!token,
    login: loginHandle,
    logout: logoutHandle,
    register: registerHandle
  };
};

/**
 * 使用vue组件
 * @param container 要挂载的节点
 * @param component vue 组件
 * @param props vue 组件属性
 */
export const useVueComponent = (container, component, props = {}) => {
  const [instance, setInstance] = useSafeState();

  useEffect(() => {
    const target = 'current' in container ? container.current : container;
    if (!target) return;
    import(/* webpackChunkName: "vue" */'vue').then((res) => {
      const Vue = res.default || res;

      const ins = new Vue({ render: (h) => h(component, props.props ? props : { props }) }).$mount();
      // for vue don't replace mountNode
      target.innerHTML = '';
      target.appendChild(ins.$el);

      setInstance(ins);
    });

    return () => instance && instance.$destroy();
  }, [container]);

  // 组件默认是$children属性的第0个
  return instance?.$children[0];
};

/**
 * 短信验证码倒计时钩子
 * @param formatter: function|undefined
 * @returns {[{countdown: number, formatText: (*|string), disabled: boolean}, ((function(*=): void)|*)]}
 */
export const useSmsCodeCountdown = ({ formatter } = {}) => {
  const [countdown, setCountdown] = useSafeState(0);
  const [timer, setTimer] = useSafeState(null);

  const defaultFormatter = (num) => {
    if (num) return `重新获取(${num}s)`;
    return '获取验证码';
  };

  const clearTimeoutHandle = usePersistFn(() => clearTimeout(timer));

  const runHandle = usePersistFn((num) => {
    setCountdown(num);
    clearTimeoutHandle();
    if (num > 0) setTimer(setTimeout(() => runHandle(num - 1), 1000));
  });

  const formatText = typeof formatter === 'function' ? formatter(countdown) : defaultFormatter(countdown);
  return [{ countdown, disabled: !!countdown, formatText }, runHandle];
};

/**
 * 页面数据上报钩子
 * @param action 动作
 * @param ready 只有当 ready 为 true 时，才会发触发，默认为true
 * @param params 统计参数
 */
export const usePageViewDataReport = (action, { ready, params } = { ready: true }) => {
  const { uid } = useSelector(({ user }) => (user.userInfo || {}));
  const { channel } = useSelector(({ router }) => (router || {}));
  const paramsArr = Array.isArray(params) ? params : [params];
  const [nowTime, setNowTime] = useSafeState(Date.now());

  const { run } = useAntRequest(
    (q) => dataActionReport(q).toPromise(),
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
      channel,
      duration: Math.ceil((now - nowTime) / 1000),
      userid: uid
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

/**
 * 规定时间内的可操作性
 * @param time  规定时间(毫秒)
 * @param number  次数
 * @param handle  可以操作的函数
 * @param disable 禁用的函数
 * @returns {(function(...[*]=): (void))|*} 触发方法
 */
export const useTimeInnerOperable = ({ time = 10 * 1000, number = 3, handle = empty, disable = empty } = {}) => {
  const [numberCount, setNumberCount] = useState(0);
  const [countdown, setTargetDate] = useCountDown({
    onEnd: () => setNumberCount(0)
  });

  const handleFn = usePersistFn(handle);
  const disableFn = usePersistFn(disable);

  return (...args) => {
    if (numberCount >= number) return disableFn(countdown);
    setNumberCount((v) => v + 1);
    if (!countdown) setTargetDate(Date.now() + time);
    return handleFn.apply(handle, args);
  };
};
