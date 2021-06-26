import React, { useEffect, useRef } from 'react';
import CopyToClipboard from 'copy-to-clipboard';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';import { useLogin, usePersistFn, useTimeInnerOperable } from '@/utils/hooks';
import { getCalcLevel } from '@/utils/common';
import RenderJudge from '@/components/RenderJudge';
import Image from '@/components/Image';
import UserDefaultImage from '@/assets/images/user_default_image.png';
import ClassNames from 'classnames';
import { useSnackbar } from '@/plugins';
import AnchorIcon from './AnchorIcon';
import LevelIcon from './LevelIcon';
import UserCardReport from './UserCardReport';
import { useStores } from '../utils/store';

import NoticeIcon from '../images/notice_icon.png';
import qqImg from '@/assets/images/liveContact/icon_qq.png';
import wxImg from '@/assets/images/liveContact/icon_wx.png';

import styles from '../style/Message.scss';

const ErrMessageSnackbar = withStyles({
  root: {
    position: 'absolute',
    bottom: 'auto',
    top: '-50px'
  }
})(Snackbar);

const Message = () => {
  const { data, state, methods, components } = useStores();
  const { anchor = {}, isCurrentAnchor, isManage, isSuperManage } = data;
  const { message: messageList, online, mute, errMessage } = state;
  const currentErrMessage = errMessage[0];
  const { isLogin, login } = useLogin();
  const { enqueueSnackbar } = useSnackbar();
  const userCardReportRef = useRef();
  const inputRef = useRef();
  const messageRef = useRef();
  const messageTimeInnerOperable = useTimeInnerOperable({
    time: 10 * 1000,
    number: 3,
    handle: (value) => {
      methods.sendMessage(value);

      inputRef.current.value = '';
      inputRef.current.focus();
    },
    disable: () => enqueueSnackbar('您发言太频繁，休息一会再发送吧')
  });
  const isHasClickUser = isCurrentAnchor || isManage || isSuperManage || isLogin;

  // 打开用户卡片
  const onOpenUserCardReportHandle = (userId) => {
    if (!isLogin) return login();
    if (!isHasClickUser) return;

    return userCardReportRef.current.open(userId, anchor.room_id);
  };

  // 发送消息
  const onSendMessageHandle = usePersistFn(() => {
    if (!isLogin) return login();
    const { value } = inputRef.current;
    if (!value) return;

    return messageTimeInnerOperable(value);
  });

  // 回车键绑定
  const onKeyPressHandle = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      return onSendMessageHandle();
    }
    return false;
  };

  const handleCopy = (v) => {
    if (!v) return;
    CopyToClipboard(v);
    enqueueSnackbar('复制成功');
  };

  // 错误消息关闭
  const onErrMessageClose = () => {
    errMessage.splice(0, 1);
    return methods.setErrMessage(errMessage);
  };  useEffect(() => {
    if (messageList.length) {
      const { scrollHeight } = messageRef.current;
      if (scrollHeight) messageRef.current.scrollTop = scrollHeight;
    }
  }, [messageList]);

  return (
    <div className={styles.container}>
      {components.notice}
      {components.billboard}
      <div className={styles.title}>
        <div className={styles.titleLabel}>聊天室</div>
        <div className={styles.titleOnline}>{online}</div>
      </div>
      {/* 主播联系方式 */}
      <RenderJudge
        value={anchor.wxqqShowStatus == 1 && (anchor.qqNo || anchor.wxNo)}
        active={(
          <div className={styles.contactContainer}>
            <RenderJudge
              value={anchor.qqNo}
              active={(
                <div className={styles.contactItem}>
                  <img src={qqImg} className={styles.contactIcon} />
                  <span className={styles.contactTxt}>主播QQ号</span>
                  <div className={styles.btnCopy} onClick={() => handleCopy(anchor.qqNo)}>复制</div>
                </div>
              )}
            />
            <RenderJudge
              value={anchor.wxNo}
              active={(
                <div className={styles.contactItem}>
                  <img src={wxImg} className={styles.contactIcon} />
                  <span className={styles.contactTxt}>主播微信号</span>
                  <div className={styles.btnCopy} onClick={() => handleCopy(anchor.wxNo)}>复制</div>
                </div>
              )}
            />
          </div>
        )}
      />
      <div className={styles.notify}>U球直播倡导绿色直播，文明观看，如出现低俗，黄暴，涉赌等内容，欢迎举报。请勿轻信各类诱导诱骗，内部渠道优惠充值，私下交易等行为。</div>
      <div className={styles.content}>
        <div className={styles.inner} ref={messageRef}>
          {messageList.map((row, index) => {
            const rRow = row || {};
            const { messageType, message, userId, username, cause, causeTimeShow, ext } = rRow;
            const { level, isUp, giftQuantity, giftName, userNickName, userHead, msg } = ext || {};
            return (
              <React.Fragment key={index}>
                {/* 欢迎消息 */}
                <RenderJudge
                  value={messageType === 'joinRoom' && !rRow.isUp && anchor.nickname}
                  active={(
                    <div className={ClassNames(styles.message, styles.system)}>
                      <Image className={styles.userImage} src={anchor.user_img} defaultImage={UserDefaultImage} />
                      <span
                        className={styles.label}
                        style={{ color: '#FF7A19' }}
                      >
                        {`主播-${anchor.nickname} 欢迎@${row.username}进入直播间`}
                      </span>
                    </div>
                  )}
                />
                {/* 进入直播间消息 */}
                <RenderJudge
                  value={messageType === 0}
                  active={(
                    <div className={ClassNames(styles.message, styles.into)}>
                      <span className={styles.label} style={{ color: '#b2a7ff' }}>欢迎:</span>
                      <span className={styles.label} style={{ color: '#f79524' }}>{username}</span>
                      <span className={styles.label}>进入直播间</span>
                    </div>
                  )}
                />
                {/* 机器人发言 */}
                <RenderJudge
                  value={messageType === 6}
                  active={(
                    <div className={ClassNames(styles.message, `msgBgLv${getCalcLevel(level)}`)}>
                      <LevelIcon level={level || 1} />
                      <span className={ClassNames(styles.label, styles.user)}>{`${username}：`}</span>
                      <span className={styles.label}>{message}</span>
                    </div>
                  )}
                />
                {/* 用户发言 */}
                <RenderJudge
                  value={messageType === 1}
                  active={(
                    <div className={ClassNames(styles.message, `msgBgLv${getCalcLevel(level)}`)}>
                      <RenderJudge
                        value={isUp}
                        active={(<AnchorIcon />)}
                      />
                      <LevelIcon level={level || 1} />
                      <span
                        className={ClassNames(styles.label, styles.user, styles.isPointer)}
                        onClick={() => onOpenUserCardReportHandle(userId)}
                      >
                        {`${username}：`}
                      </span>
                      <span className={styles.label}>{message}</span>
                    </div>
                  )}
                />
                {/* 禁言 */}
                <RenderJudge
                  value={messageType === 3}
                  active={(
                    <div className={ClassNames(styles.message, styles.system)}>
                      <span
                        className={styles.label}
                        style={{ color: '#FF7A19' }}
                      >
                        {`${username}因${cause} 已被禁言${causeTimeShow}！`}
                      </span>
                    </div>
                  )}
                />
                {/* 送礼 */}
                <RenderJudge
                  value={messageType === 2}
                  active={(
                    <div className={ClassNames(styles.message, `msgBgLv${getCalcLevel(level)}`)}>
                      <RenderJudge
                        value={isUp}
                        active={(<AnchorIcon />)}
                      />
                      <LevelIcon level={level || 1} />
                      <span
                        className={ClassNames(styles.label, styles.user, styles.isPointer)}
                        onClick={() => onOpenUserCardReportHandle(userId)}
                      >
                        {`${userNickName}：`}
                      </span>
                      <span className={styles.label}>
                        {`送出 ${giftQuantity} 个 ${giftName}`}
                      </span>
                    </div>
                  )}
                />
                {/* 预测购买消息 */}
                <RenderJudge
                  value={messageType === 9}
                  active={(
                    <div className={ClassNames(styles.message, styles.system)}>
                      <Image className={styles.noticeIcon} src={NoticeIcon} />
                      <span className={styles.label} style={{ color: '#FF7A19' }}>{`${userNickName} ${msg}`}</span>
                    </div>
                  )}
                />
              </React.Fragment>
            );
          })}
        </div>
        <UserCardReport ref={userCardReportRef} />
      </div>
      <div className={styles.sendChat}>
        <RenderJudge
          value={currentErrMessage}
          active={(
            <ErrMessageSnackbar
              open
              autoHideDuration={2000}
              message={currentErrMessage}
              onClose={onErrMessageClose}
              key={currentErrMessage}
            />
          )}
        />
        <textarea
          className={styles.sendInput}
          ref={inputRef}
          placeholder="请输入文字"
          maxLength={40}
          onKeyPress={onKeyPressHandle}
        />
        <div className={styles.sendBtn} onClick={onSendMessageHandle}>发送</div>
      </div>
      <RenderJudge
        value={mute}
        active={(
          <div className={styles.muteWrapper}>
            <div className={styles.muteContent}>您已被禁言</div>
          </div>
        )}
      />
    </div>
  );
};

export default Message;
