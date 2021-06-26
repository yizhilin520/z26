import React from 'react';
import { useSelector } from 'react-redux';
import { empty, generateMsgId } from '@/utils/common';
import { useSnackbar } from '@/plugins';
import { HttpCode } from '@/enums';
import { MathNum } from '@/utils/regular';
import { useLogin, usePersistFn, useSafeState, useSetState, useWebsocketPush } from '@/utils/hooks';
import { cancelFollow, getFollow, userGiveGifts } from '@/servers/homeServer';
import { getkickOutUser, getShutUpForbidSendMsg, unForbidSendMsg } from '@/servers/userServer';
import Layout from './Layout';
import { Context } from '../utils/store';

const Provider = ({ className, data: propsData, chatId, methods, components, onKick }) => {
  const [data, setData] = useSetState(propsData || {});
  const [socketInstance, setSocketInstance] = useSafeState();
  const {
    online_count,
    forbidStatus,
    is_attention,
    anchor,
    room_id,
    ugoldNum,
    ubeanNum,
    isKickOutIng,
    isCurrentAnchor
  } = data;
  const { uid: anchorUid } = anchor || {};
  const { uid: userId, nickName, level, isVip } = useSelector(({ user }) => user.userInfo);
  const { isLogin, login } = useLogin();
  const { enqueueSnackbar } = useSnackbar();
  // socket连接用户名
  const socketUsername = nickName || `访客_${MathNum()}`;
  const [state, setState] = useSetState({
    chatId,
    message: [{ messageType: 'joinRoom', username: socketUsername, isUp: anchorUid === userId }],
    online: online_count || 0,
    kickOut: !!isKickOutIng,
    mute: !!forbidStatus,
    follow: !!is_attention,
    shield: [],
    // 错误消息
    errMessage: []
  });

  // 请求封装
  const requestHandle = async (requestFn = empty, params) => {
    const req = requestFn(params);

    return new Promise((resolve) => {
      req.toPromise()
        .then(({ data: { code, msg, data: rData } }) => {
          if (HttpCode.SUCCESS === code) return resolve(rData);

          enqueueSnackbar(msg);
        });
    });
  };

  // 设置在线人数
  const setOnlineHandle = usePersistFn((online) => setState({ online }));
  // 关注
  const followHandle = usePersistFn(() => {
    if (!isLogin) return login();

    const { follow } = state;
    const handle = follow ? cancelFollow : getFollow;

    return requestHandle(handle, { attention_uid: anchorUid }).then(() => setState({ follow: !follow }));
  });
  // 送礼
  const giveGiftHandle = usePersistFn(({ giftId, giftQuantity, price, waysToPurchase }) => {
    const params = {
      giftId,
      giftQuantity,
      roomId: room_id,
      price
    };

    if (!isLogin) return login();
    const totalPrice = price * giftQuantity;
    if (waysToPurchase === 0 && ugoldNum < totalPrice) return enqueueSnackbar('金币余额不足');
    if (waysToPurchase === 1 && ubeanNum < totalPrice) return enqueueSnackbar('金豆余额不足');
    return requestHandle(userGiveGifts, params)
      .then((res) => {
        // 送礼成功减少金币
        if (waysToPurchase === 0) setData({ ugoldNum: ugoldNum - price * giftQuantity });
        // 送礼成功减少金豆
        if (waysToPurchase === 1) setData({ ubeanNum: ubeanNum - price * giftQuantity });
        return res;
      });
  });
  // 发送消息
  const sendMessageHandle = usePersistFn((m) => {
    if (!socketInstance) return;

    return socketInstance.emit('message', {
      messageId: generateMsgId(), // 消息唯一ID
      username: nickName, // 进入直播间但是未登录统一username为'访客'
      messageType: 1, // 1文本, 2礼物, 3表情, 4登录, 5登出
      userId,
      message: m, // 文本或者礼物对应的key值和表情
      ext: {
        isUp: isCurrentAnchor, // 是否是主播自己 1是 0 否
        isVip, // 是否是会员 1是 0 否
        level // 用户级别 默认1
      }
    });
  });
  // 设置消息
  const setMessageHandle = usePersistFn((message = []) => setState({ message }));
  // 添加消息
  const addMessage = usePersistFn((msg) => setState({ message: state.message.concat(msg) }));
  // 踢人
  const kickOutHandle = usePersistFn((params, account) => requestHandle(getkickOutUser, params).then(() => enqueueSnackbar(`您将 ${account} 踢出了您的直播间`)));
  // 禁言
  const muteHandle = usePersistFn((params, account) => requestHandle(getShutUpForbidSendMsg, params).then(() => enqueueSnackbar(`用户 ${account} 已被禁言`)));
  // 解禁
  const unMuteHandle = usePersistFn((params, account) => requestHandle(unForbidSendMsg, params).then(() => enqueueSnackbar(`用户 ${account} 已被解除禁言`)));

  // 屏蔽/解除屏蔽
  const shieldHandle = usePersistFn((shieldUserId) => {
    const { shield } = state;
    if (shield.includes(shieldUserId)) {
      setState({ shield: shield.filter((row) => row !== shieldUserId) });
    } else {
      enqueueSnackbar('屏蔽成功');
      setState({ shield: shield.concat([shieldUserId]) });
    }
  });
  // 发送动画
  const pushAnimationHandle = usePersistFn((id) => {
    try {
      methods.pushAnimation(id);
    } catch (e) {
    }
  });

  // 发送弹幕
  const pushDanmakuHandle = usePersistFn((d) => {
    try {
      methods.pushDanmaku(d);
    } catch (e) {
    }
  });

  // 普通消息
  const simpleMessageHandle = usePersistFn((m) => {
    const { shield } = state;
    const { userId: msgUserId } = m;
    if (shield.includes(msgUserId)) return;

    // 添加到消息列表
    addMessage(m);
    // 发送弹幕
    return pushDanmakuHandle(m);
  });

  const setErrMessageHandle = (errMessage = []) => setState({ errMessage });
  // 错误消息
  const errorMessageHandle = usePersistFn(({ err }) => {
    if (!err) return;

    return setErrMessageHandle(state.errMessage.concat([err]));
  });
  // 机器人消息
  const robotMessageHandle = usePersistFn((m) => {
    // 添加到消息列表
    addMessage(m);
    // 发送弹幕
    return pushDanmakuHandle(m);
  });
  // 礼物消息
  const giftMessageHandle = usePersistFn((m) => {
    const { ext } = m;
    const { giftId } = ext || {};

    // 添加到消息列表
    addMessage(m);
    // 动画
    if (giftId) pushAnimationHandle(giftId);
    // 发送弹幕
    return pushDanmakuHandle(m);
  });
  // 预测购买消息
  const forecastPurchaseMessageHandle = usePersistFn((m) => {
    const { ext } = m || {};
    const { roomId } = ext || {};
    if (!(new RegExp(`^${roomId}$`).test(room_id))) return;

    // 添加到消息列表
    addMessage(m);
    // 发送弹幕
    return pushDanmakuHandle(m);
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
      token: userId || MathNum(),
      roomId: chatId,
      user: {
        uid: userId,
        username: socketUsername, // 用户名
        isUp: isCurrentAnchor, // 是否是主播自己 true false
        isVip, // 是否是会员 1是 0 否
        level // 用户级别 默认1
      }
    });
    setSocketInstance(socket);
  });
  // 进入房间回调
  const socketJoinRoomHandle = usePersistFn((m) => addMessage({ ...m, messageType: 'joinRoom' }));
  // 禁言/踢人回调
  const socketBackHandle = usePersistFn((m) => {
    const { messageType, userId: msgUserId, ext: { optType } = {} } = m || {};
    if (messageType === -1 && msgUserId === userId) {
      if (optType === '2') {
        // 踢人
        setState({ kickOut: true });
        onKick();
      }
      if (optType === '1') {
        // 禁言
        setState({ mute: true });
      }
    }
  });
  // 解禁回调
  const socketUnBackHandle = usePersistFn((m) => {
    const { roomId, userId: msgUserId } = m || {};
    if (new RegExp(`^${roomId}$`).test(room_id) && msgUserId === userId) {
      setState({ mute: false });
    }
  });

  // 连接websocket
  useWebsocketPush(
    '/chat',
    {
      message: socketMessageHandle,
      connect: socketConnectHandle,
      onlineCount: setOnlineHandle,
      // joinRoom: socketJoinRoomHandle,
      back: socketBackHandle,
      unback: socketUnBackHandle
    }
  );

  const storeVal = {
    data,
    components,
    state,
    methods: {
      // 设置在线人数
      online: setOnlineHandle,
      // 关注
      follow: followHandle,
      // 送礼
      giveGift: giveGiftHandle,
      // 发送消息
      sendMessage: sendMessageHandle,
      // 设置消息
      setMessage: setMessageHandle,
      // 添加消息
      addMessage,
      // 踢人
      kickOut: kickOutHandle,
      // 禁言
      mute: muteHandle,
      // 解禁
      unMute: unMuteHandle,
      // 屏蔽/解除屏蔽
      shield: shieldHandle,
      // 发送弹幕
      pushDanmaku: pushDanmakuHandle,
      // 发送动画
      pushAnimation: pushAnimationHandle,
      // 设置错误消息
      setErrMessage: setErrMessageHandle
    }
  };
  return (
    <Context.Provider value={storeVal}>
      <Layout
        className={className}
        anchor={components.anchor}
        animation={components.animation}
        gift={components.gift}
        message={components.message}
        player={components.player}
      />
    </Context.Provider>
  );
};

Provider.defaultProps = {
  methods: {},
  components: {},
  onKick: empty
};

export default Provider;
