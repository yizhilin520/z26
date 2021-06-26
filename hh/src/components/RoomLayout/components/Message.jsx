import React, { useEffect, useRef } from 'react';
import { empty } from '@/common/utils';
import CopyToClipboard from 'copy-to-clipboard';
import ClassNames from 'classnames';
import Toast from '@/components/Toast';
import RenderJudge from '@/components/RenderJudge';
import Image from '@/components/Image';
import DefaultUserImage from '@/assets/images/default_user_image.png';
import GiftIcon from '../images/gift_icon.png';
import NoticeIcon from '../images/notice_icon.png';
import qq from '../images/qq.png';
import wechat from '../images/wechat.png';

import styles from '../style/Message.scss';

const Message = ({ list, anchor, onMessage, onGift }) => {
  const messageRef = useRef();
  const toastRef = useRef();

  const { qqNo, wxNo, wxqqShowStatus } = anchor;

  useEffect(() => {
    if (list.length) {
      const { scrollHeight } = messageRef.current;
      if (scrollHeight) messageRef.current.scrollTop = scrollHeight;
    }
  }, [list]);

  const handleCopy = (v) => {
    CopyToClipboard(v);
    toastRef.current.open({ text: '复制成功', duration: 2000 });
  };

  return (
    <div className={styles.container} ref={messageRef}>
      <Toast ref={toastRef} />
      <div className={styles.wrapper}>
        <RenderJudge
          value={wxqqShowStatus === '1' && (qqNo || wxNo)}
          active={(
            // qq和微信只有一个存在时,使用styles.onlyOne类名样式
            <div className={ClassNames(styles.box, { [styles.onlyOne]: (qqNo && !wxNo) || (wxNo && !qqNo) })}>
              <RenderJudge
                value={qqNo}
                active={(
                  <div className={styles.contact}>
                    <div className={styles.left}>
                      <Image className={styles.contactImage} src={qq} />
                      <span className={styles.label}>主播QQ号</span>
                    </div>
                    <span className={styles.copy} onClick={() => handleCopy(qqNo)}>复制</span>
                  </div>
                )}
              />
              <RenderJudge
                value={wxNo}
                active={(
                  <div className={styles.contact}>
                    <div className={styles.left}>
                      <Image className={styles.contactImage} src={wechat} />
                      <span className={styles.label}>主播微信号</span>
                    </div>
                    <span className={styles.copy} onClick={() => handleCopy(wxNo)}>复制</span>
                  </div>
                )}
              />
            </div>
          )}
        />

        <div className={styles.message}>
          <img className={styles.noticeIcon} src={NoticeIcon} />
          <span
            className={styles.label}
            style={{ color: '#4F82FF' }}
          >
            U球直播倡导绿色直播，文明观看，如出现低俗，黄暴，涉赌等内容，欢迎举报。请勿轻信各类诱导诱骗，内部渠道优惠充值，私下交易等行为。
          </span>
        </div>
        {list.map((row, index) => {
          const rRow = row || {};
          const { messageType, message, username, cause, causeTimeShow, ext } = rRow;
          const { isUp, giftQuantity, giftName, userNickName, msg } = ext || {};

          return (
            <React.Fragment key={index}>
              {/* 欢迎消息 */}
              <RenderJudge
                value={messageType === 'joinRoom' && !rRow.isUp && anchor.nickname}
                active={(
                  <div className={styles.message} style={{ backgroundColor: '#e8e8fc' }}>
                    <Image className={styles.userImage} src={anchor.user_img} defaultImage={DefaultUserImage} />
                    <span className={styles.label} style={{ color: '#4F82FF' }}>{anchor.nickname}</span>
                    <span className={styles.label}>{`欢迎@${rRow.username}进入直播间`}</span>
                  </div>
                )}
              />
              {/* 禁言 */}
              <RenderJudge
                value={messageType === 3}
                active={(
                  <div className={styles.message}>
                    <span
                      className={styles.label}
                      style={{ color: '#fe3a3a' }}
                    >
                      {`系统消息：${username}因${cause} 已被禁言${causeTimeShow}！`}
                    </span>
                  </div>
                )}
              />
              {/* 送礼 */}
              <RenderJudge
                value={messageType === 2}
                active={(
                  <div className={styles.message}>
                    <RenderJudge
                      value={isUp}
                      active={(<div className={styles.anchorIcon}>主播</div>)}
                    />
                    <span className={styles.label} style={{ color: '#4F82FF' }}>{`${userNickName}:`}</span>
                    <span className={styles.label}>{`赠送主播 ${giftQuantity} 个 ${giftName}`}</span>
                  </div>
                )}
              />
              {/* 预测购买消息 */}
              <RenderJudge
                value={messageType === 9}
                active={(
                  <div className={styles.message}>
                    <img className={styles.noticeIcon} src={NoticeIcon} />
                    <span className={styles.label} style={{ color: '#4F82FF' }}>{`${userNickName} ${msg}`}</span>
                  </div>
                )}
              />
              {/* 用户发言 */}
              <RenderJudge
                value={messageType === 1}
                active={(
                  <div className={styles.message} style={{ backgroundColor: '#e8e8fc' }}>
                    <RenderJudge
                      value={isUp}
                      active={(<div className={styles.anchorIcon}>主播</div>)}
                    />
                    <span className={styles.label} style={{ color: '#4F82FF' }}>{`${username}:`}</span>
                    <span className={styles.label}>{message}</span>
                  </div>
                )}
              />
              {/* 机器人发言 */}
              <RenderJudge
                value={messageType === 6}
                active={(
                  <div className={styles.message} style={{ backgroundColor: '#e8e8fc' }}>
                    <span className={styles.label} style={{ color: '#4F82FF' }}>{`${username}:`}</span>
                    <span className={styles.label}>{message}</span>
                  </div>
                )}
              />
            </React.Fragment>
          );
        })}
      </div>
      <div className={styles.footer}>
        <div className={styles.leave}>LV 1</div>
        <div className={styles.input} onClick={onMessage}>我也来说几句</div>
        <img className={styles.gift} src={GiftIcon} onClick={onGift} />
      </div>
    </div>
  );
};

Message.defaultProps = {
  list: [],
  anchor: {},
  onMessage: empty,
  onGift: empty
};

export default Message;
