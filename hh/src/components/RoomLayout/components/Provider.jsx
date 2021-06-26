import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { usePersistFn } from 'ahooks';
import useSafeState from 'ahooks/lib/useSafeState';
import { empty, getRandomNumber } from '@/common/utils';
import { useWebsocketPush } from '@/common/hooks';
import Toast from '@/components/Toast';

const Provider = ({ chatId, children }) => {
  const toastRef = useRef();
  // 消息列表
  const [messageList, setMessageList] = useSafeState([]);
  // socket实例
  const [socketInstance, setSocketInstance] = useSafeState();

  // 添加消息
  const addMessage = (msg) => setMessageList([...messageList.concat(msg)]);
  // 普通消息
  const simpleMessageHandle = usePersistFn((m) => {
    // 添加到消息列表
    return addMessage(m);
  });
  // 错误消息
  const errorMessageHandle = usePersistFn(({ err }) => toastRef.current.open({ text: err, duration: 2000 }));
  // 机器人消息
  const robotMessageHandle = usePersistFn((m) => {
    // 添加到消息列表
    return addMessage(m);
  });
  // 礼物消息
  const giftMessageHandle = usePersistFn((m) => {
    // 添加到消息列表
    return addMessage(m);
  });
  // 预测购买消息
  const forecastPurchaseMessageHandle = usePersistFn((m) => {
    const { ext } = m || {};
    const { roomId } = ext || {};
    if (!(new RegExp(`^${roomId}$`).test(chatId))) return;

    // 添加到消息列表
    return addMessage(m);
  });

  // 消息回调
  const socketMessageHandle = usePersistFn((m) => {
    const { messageType, err } = m;

    // 错误信息
    if (err) return errorMessageHandle(m);
    // 普通发言消息
    if (messageType === 1) return simpleMessageHandle(m);
    // 机器人消息
    if (messageType === 6) return robotMessageHandle(m);
    // 礼物消息
    if (messageType === 2) return giftMessageHandle(m);
    // 预测购买消息
    if (messageType === 9) return forecastPurchaseMessageHandle(m);
  });
  // 连接回调
  const socketConnectHandle = usePersistFn((d, socket) => {
    // 连接房间
    socket.emit('reg', {
      token: getRandomNumber(),
      roomId: chatId,
      user: {
        uid: null,
        username: `访客_${getRandomNumber()}`, // 用户名
        isUp: 0, // 是否是主播自己 1是 0 否
        isVip: 0, // 是否是会员 1是 0 否
        level: 0 // 用户级别 默认1
      }
    });
    setSocketInstance(socket);
  });
  // 进入房间回调
  const socketJoinRoomHandle = usePersistFn((m) => {
    // 添加到消息列表
    return addMessage({ ...m, messageType: 'joinRoom' });
  });

  // 连接websocket
  useWebsocketPush(
    '/chat',
    {
      message: socketMessageHandle,
      connect: socketConnectHandle,
      // onlineCount: setOnlineHandle,
      joinRoom: socketJoinRoomHandle,
      // back: socketBackHandle,
      // unback: socketUnBackHandle
    }
  );

  return (
    <>
      {children({ messages: messageList, socket: socketInstance })}
      <Toast ref={toastRef} />
    </>
  );
};

Provider.defaultProps = {
  children: empty
};

Provider.propTypes = {
  chatId: PropTypes.number.isRequired,
  children: PropTypes.func
};

export default Provider;
