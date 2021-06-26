import React, { createContext, useEffect, useReducer, useState } from 'react';
import io from 'socket.io-client';
import Player from '@/components/player';
import deta from '@/scss/live/detail.scss';
import { ActionType, StateType } from '@/models/room';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/reducers';
import { homeAction } from '@/actions';
import Statistics from '@/components/statistics';
import RenderJudge from '@/components/RenderJudge';

import { MathNum } from '@/utils/regular';
import Gift from './widget/gift';
import Review from './widget/review';
import style from './style.scss';
import { Link } from 'react-router-dom';

const ChatsContext: any = createContext(null);
const ChatsContextConsumer: any = ChatsContext.Consumer;
// http://222.186.150.148:9092/chat
// http://222.186.150.148:8002/chat
// http://172.24.135.22:9092/chat
const initValue: StateType = {
  username: '',
  uid: '',
  socket: io(`${process.env.WEBSOCKET_PUSH_API}/chat`, {
    transports: ['websocket']
  }),
  messages: [],
  onlineUsers: [],
  onlineCount: 0,
  userhtml: ''
};

const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case 'login':
      return { ...state, ...action.payload };
    case 'UPDATE_SYSTEM_MESSAGE':
      return { ...state, ...{ messages: state.messages.concat(action.payload.message) } };
    case 'UPDATE_ONLINE_COUNT': // 总人数
      return { ...state, ...{ onlineCount: action.payload.onlineCount } };
    case 'UPDATE_USER_MESSAGE':
      return { ...state, ...{ messages: state.messages.concat(action.payload.message) } };
    default:
      return state;
  }
};

const Chats = (props: any) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  // const [init, setInit] = useState<boolean>(false)
  const [state, ioDispatch] = useReducer(reducer, initValue);
  const { title, nickname, uid, is_attention, isCurrentAnchor, anchor, match_id, room_id, chatId, isShowGift } = props;
  const { uid: userId, nickName, level, isVip, token } = userInfo;
  const [isAttention, setIsAttention] = useState<boolean>();
  const [followVisible, setFollowVisible] = useState<boolean>(false);
  const { socket } = state;

  useEffect(() => {
    // 筛选重复的链接可能存在问题
    socket.emit('reg', {
      token: userId || MathNum(),
      roomId: chatId || room_id,
      user: {
        uid: userId,
        username: nickName || `访客_${MathNum()}`, // 用户名
        isUp: isCurrentAnchor, // 是否是主播自己 true false
        isVip, // 是否是会员 1是 0 否
        level // 用户级别 默认1
      }
    });
    setTimeout(() => {
      socket.connect();
    }, 1000);

    socket.on('disconnect', () => {
      try {
        socket.removeAllListeners('message');
      } catch (e) {
      }
    });
    return () => {
      socket.disconnect(); // 关闭当前连接但不断开
    };
  }, [room_id]);

  useEffect(() => {
    let followTimeInstance = setTimeout(() => {
      setFollowVisible(true);
      followTimeInstance = setTimeout(() => {
        setFollowVisible(false);
      }, 60000);
    }, 60000);
    return () => {
      clearTimeout(followTimeInstance);
    };
  }, []);

  // 回调状态不需要存储到reducer
  const callback = (res: any) => {
    if (res?.code === 200) {
      setIsAttention(!isAttention);
    } else if (res?.code === 401) {
      dispatch({
        type: `home/${homeAction.UPDATE_OPEN_LOGIN}`,
        payload: { activeIndex: 0 }
      });
    }
  };
  return (
    <ChatsContext.Provider value={{ state, ioDispatch }}>
      <>
        {/* room */}
        <div className={deta.ctn}>
          <div className={deta.roomleft}>
            <RenderJudge
              value={!props.isMatch}
              active={(
                <div className={deta.roomtit}>
                  <div className={deta.iconctn}>
                    <img className={deta.icontu} src={anchor?.user_img} alt="" />
                    <div className={deta.icontext}>
                      <p className={deta.lqao}>{title}</p>
                      <p className={deta.dds}>
                        <span className={deta.ddname}>{anchor ? anchor.nickname : ''}</span>
                        <span className={deta.inconhome}>房间号：</span>
                        <span>{room_id}</span>
                        <span className={deta.inconhou} />
                        <span className={deta.linenumber}>{props.heat}</span>
                      </p>
                    </div>
                  </div>
                  <div className={deta.roomtitRight}>
                    {/*{*/}
                    {/*  !token?*/}
                    {/*  <div className={deta.report} onClick={() =>{ */}
                    {/*    dispatch({*/}
                    {/*      type: `home/${homeAction.UPDATE_OPEN_LOGIN}`,*/}
                    {/*      payload: { activeIndex: 0 }*/}
                    {/*    })*/}
                    {/*  }}>举报</div>*/}
                    {/*  :*/}
                    {/*  <Link className={deta.report} to={`/report/${room_id}`} target="_blank">举报</Link>*/}
                    {/*}*/}
                    {((isAttention !== false && isAttention !== true) && is_attention) || isAttention
                      ? (
                        <div
                          className={deta.guanzhu}
                        >
                          <div
                            className={deta.followButton}
                            onClick={() => {
                              dispatch({
                                type: `home/${homeAction.GET_CANCEL_FOLLOW}`,
                                payload: { attention_uid: uid },
                                callback
                              });
                            }}
                          >
                            取消
                          </div>
                        </div>
                      )
                      : (
                        <div
                          className={deta.guanzhu}
                        >
                          <div
                            className={deta.followButton}
                            onClick={() => {
                              !token
                                ? dispatch({
                                  type: `home/${homeAction.UPDATE_OPEN_LOGIN}`,
                                  payload: { activeIndex: 0 }
                                })
                                : dispatch({
                                  type: `home/${homeAction.GET_FOLLOW}`,
                                  payload: { attention_uid: uid },
                                  callback
                                });
                            }}
                          >
                            关注
                          </div>
                          <div className={deta.followHover} style={{ display: followVisible ? 'block' : 'none' }}>
                            <div className={deta.followText}>喜欢我吗？喜欢我就点个关注吧！</div>
                            <div
                              className={deta.hoverButton}
                              onClick={() => {
                                !token
                                  ? dispatch({
                                    type: `home/${homeAction.UPDATE_OPEN_LOGIN}`,
                                    payload: { activeIndex: 0 }
                                  })
                                  : dispatch({
                                    type: `home/${homeAction.GET_FOLLOW}`,
                                    payload: { attention_uid: uid },
                                    callback
                                  });
                              }}
                            >
                              关注
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}
            />
            {/* 直播间 */}
            <div className={deta.playtv}>
              <RenderJudge
                value={props.playAddr && props.playAddr.length}
                active={(
                  <Player {...{ ...props, socket }} />
                )}
              />
              <RenderJudge
                value={(!props.playAddr || !props.playAddr.length) && props.animationUrl}
                active={(
                  <iframe src={props.animationUrl} className={deta.playIframe}/>
                )}
              />
              {/* 无数据 */}
              <RenderJudge
                value={(!props.playAddr || !props.playAddr.length) && !props.animationUrl}
                active={(
                  <div className={deta.noDate}></div>
                )}
              />
            </div>
            {/* 礼物 */}
            {isShowGift && <Gift {...{ ...props, socket }} />}
            {/* 足球比分进度条 */}
            <RenderJudge
              value={props.match_id && props.live_type_id === 1}
              active={(
                <div style={{ position: 'relative', height: '150px', overflow: 'hidden' }}>
                  <Statistics {...props} />
                </div>
              )}
            />
            {/* <Gift {...Object.assign(props.data,uGlod,{socket})} /> */}
          </div>
          <div className={style.money} />
          <div className="money" />
          <Review {...props} />
        </div>
      </>
    </ChatsContext.Provider>
  );
};

export { ChatsContext, ChatsContextConsumer };
export default Chats;
