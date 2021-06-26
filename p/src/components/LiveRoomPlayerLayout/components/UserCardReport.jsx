import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useSelector } from 'react-redux';
import { empty } from '@/utils/common';
import { useRequest, useSafeState } from '@/utils/hooks';
import { getChatUserInfo } from '@/servers/userServer';
import Image from '@/components/Image';
import Iconfont from '@/components/Iconfont';
import RenderJudge from '@/components/RenderJudge';
import UserDefaultImage from '@/assets/images/user_default_image.png';
import LevelIcon from './LevelIcon';
import AddKickMute from './AddKickMute';
import { useStores } from '../utils/store';

import styles from '../style/UserCardReport.scss';

const UserCardReport = forwardRef((props, ref) => {
  const { uid } = useSelector(({ user }) => user.userInfo || {});
  const { methods, state } = useStores();
  const [data, setData] = useSafeState({});
  const [roomId, setRoomId] = useSafeState(null);
  const [visible, setVisible] = useSafeState(false);
  const addKickMuteRef = useRef();

  // 是否是自己
  const isSelf = uid === data.userId;
  // 是否有权限禁言/踢人
  const isAuthMuteOrKick = data.showNoTalk && !isSelf && !data.userIsAnthor;
  // 是否有权限屏蔽
  const isAuthShield = !isSelf && !!uid;

  const { mutate } = useRequest(
    (q) => getChatUserInfo(q).toPromise(),
    null,
    (d) => {
      setVisible(true);
      return setData(d || {});
    },
    {
      useManual: true
    }
  );

  // 关闭
  const closeHandle = () => setVisible(false);
  // 打开
  const openHandle = (userId, reqRoomId) => {
    closeHandle();
    setRoomId(reqRoomId);
    return mutate({ userId, roomId: reqRoomId });
  };

  // 禁言/解禁操作
  const onMuteHandle = () => {
    if (data.isForbidIng) return methods.unMute({ uid: data.userId, roomId }, data.account).then(closeHandle);
    return addKickMuteRef.current.open({ account: data.account, roomId, uid: data.userId, optType: 1 });
  };
  // 踢人操作
  const onKickHandle = () => addKickMuteRef.current.open({ account: data.account, roomId, uid: data.userId, optType: 2 });
  // 屏蔽/取消屏蔽操作
  const onShieldHandle = () => {
    methods.shield(data.userId);
    return closeHandle();
  };

  useImperativeHandle(ref, () => ({
    open: openHandle,
    close: closeHandle
  }));

  if (!visible) return null;

  const list = [isAuthMuteOrKick && {
    label: data.isForbidIng ? '解禁' : '禁言',
    click: onMuteHandle
  }, isAuthMuteOrKick && {
    label: '踢人',
    click: onKickHandle
  }, isAuthShield && {
    label: state.shield.includes(data.userId) ? '取消屏蔽' : '屏蔽',
    click: onShieldHandle
  }].filter(Boolean);

  return (
    <div className={styles.container}>
      <Iconfont className={styles.close} name="close" tag="div" onClick={closeHandle} />
      <Image className={styles.userImage} src={data.headImage} defaultImage={UserDefaultImage} />
      <div className={styles.userName}>{data.nickname}</div>
      <LevelIcon level={data.level} />
      <div className={styles.fans}>{`粉丝:${data.fans || 0}`}</div>
      <RenderJudge
        value={list.length}
        active={(
          <div className={styles.buttons}>
            {list.map((row, index) => (
              <div className={styles.btn} key={index} onClick={row.click}>{row.label}</div>
            ))}
          </div>
        )}
      />

      <AddKickMute ref={addKickMuteRef} onSubmit={closeHandle} />
    </div>
  );
});

UserCardReport.defaultProps = {
  onMute: empty,
  onKick: empty
};

export default UserCardReport;
