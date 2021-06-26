import React, { createContext, useEffect, useReducer, useState } from "react";
import Player from "@/components/player";
import deta from "@/scss/live/detail.scss";
import ClassNames from "classnames";
import { ActionType, StateType } from "@/models/room";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/reducers";
import { homeAction } from "@/actions";
import Statistics from "@/components/statistics";
import RenderJudge from "@/components/RenderJudge";

import { useRequest, useScroll } from "@/utils/hooks";
import { getLiveList } from "@/servers/homeServer";

import DefaultImage from "@/assets/images/default_image.jpg";

import styles from "./style.scss";

const ChatsContext = createContext(null);
const ChatsContextConsumer = ChatsContext.Consumer;
const initValue = {
  username: "",
  uid: "",
  messages: [],
  onlineUsers: [],
  onlineCount: 0,
  userhtml: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "login":
      return { ...state, ...action.payload };
    case "UPDATE_SYSTEM_MESSAGE":
      return {
        ...state,
        ...{ messages: state.messages.concat(action.payload.message) },
      };
    case "UPDATE_ONLINE_COUNT": // 总人数
      return { ...state, ...{ onlineCount: action.payload.onlineCount } };
    case "UPDATE_USER_MESSAGE":
      return {
        ...state,
        ...{ messages: state.messages.concat(action.payload.message) },
      };
    default:
      return state;
  }
};

const Chats = (props) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  // const [init, setInit] = useState<boolean>(false)
  const [state, ioDispatch] = useReducer(reducer, initValue);
  const {
    title,
    nickname,
    uid,
    is_attention,
    isCurrentAnchor,
    anchor,
    match_id,
    room_id,
    chatId,
    isShowGift,
  } = props;
  const { uid: userId, nickName, level, isVip, token } = userInfo;
  const [isAttention, setIsAttention] = useState();
  const [followVisible, setFollowVisible] = useState(false);

  const [selectIndex, setSelectIndex] = useState(null);
  const { data = {} } = useRequest((q) => getLiveList(q).toPromise(), {
    page: 1,
    size: 10,
  });
  const rows = data.rows || [];
  // 永远显示六条
  const list = rows.concat(new Array(10 - rows.length).fill(0));

  const currentData = list[selectIndex];

  const [isData, setIsData] = useState(false);

  const nextProps = isData ? currentData : props;
  console.log(currentData);

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
  const callback = (res) => {
    if (res?.code === 200) {
      setIsAttention(!isAttention);
    } else if (res?.code === 401) {
      dispatch({
        type: `home/${homeAction.UPDATE_OPEN_LOGIN}`,
        payload: { activeIndex: 0 },
      });
    }
  };
  return (
    <ChatsContext.Provider value={{ state, ioDispatch }}>
      <>
        {/* room */}
        <div className={ClassNames(deta.ctn, styles.container)}>
          <div className={ClassNames(deta.roomleft, styles.roomLeft)}>
            <RenderJudge
              value={!props.isMatch}
              active={
                <div className={deta.roomtit}>
                  <div className={deta.iconctn}>
                    <img
                      className={deta.icontu}
                      src={anchor?.user_img}
                      alt=""
                    />
                    <div className={deta.icontext}>
                      <p className={deta.lqao}>{title}</p>
                      <p className={deta.dds}>
                        <span className={deta.ddname}>
                          {anchor ? anchor.nickname : ""}
                        </span>
                        <span className={deta.inconhome}>房间号：</span>
                        <span>{room_id}</span>
                        <span className={deta.inconhou} />
                        <span className={deta.linenumber}>{props.heat}</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    {(isAttention !== false &&
                      isAttention !== true &&
                      is_attention) ||
                    isAttention ? (
                      <div className={deta.guanzhu}>
                        <div
                          className={deta.followButton}
                          onClick={() => {
                            dispatch({
                              type: `home/${homeAction.GET_CANCEL_FOLLOW}`,
                              payload: { attention_uid: uid },
                              callback,
                            });
                          }}
                        >
                          取消
                        </div>
                      </div>
                    ) : (
                      <div className={deta.guanzhu}>
                        <div
                          className={deta.followButton}
                          onClick={() => {
                            !token
                              ? dispatch({
                                  type: `home/${homeAction.UPDATE_OPEN_LOGIN}`,
                                  payload: { activeIndex: 0 },
                                })
                              : dispatch({
                                  type: `home/${homeAction.GET_FOLLOW}`,
                                  payload: { attention_uid: uid },
                                  callback,
                                });
                          }}
                        >
                          关注
                        </div>
                        <div
                          className={deta.followHover}
                          style={{ display: followVisible ? "block" : "none" }}
                        >
                          <div className={deta.followText}>
                            喜欢我吗？喜欢我就点个关注吧！
                          </div>
                          <div
                            className={deta.hoverButton}
                            onClick={() => {
                              !token
                                ? dispatch({
                                    type: `home/${homeAction.UPDATE_OPEN_LOGIN}`,
                                    payload: { activeIndex: 0 },
                                  })
                                : dispatch({
                                    type: `home/${homeAction.GET_FOLLOW}`,
                                    payload: { attention_uid: uid },
                                    callback,
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
              }
            />
            {/* 直播间 */}
            <div className={deta.playtv}>
              <Player {...{ ...nextProps }} />
            </div>
          </div>
          <div className={styles.rightBar}>
            <div className={styles.liveTitle}>直播推荐</div>
            <div className={styles.slide}>
              {list.map((row, index) => (
                <div
                  className={ClassNames(styles.item, {
                    [styles.isActive]: index === selectIndex,
                  })}
                  key={index}
                >
                  <RenderJudge
                    value={row}
                    active={
                      <div
                        className={styles.inner}
                        onClick={() => {
                          setSelectIndex(index);
                          setIsData(true);
                          console.log(11111111111);
                        }}
                      >
                        <img
                          className={styles.image}
                          src={
                            row.room_img || row.screenshot_url || DefaultImage
                          }
                          alt={row.title}
                        />
                        <div className={styles.title}>{row.title}</div>
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    </ChatsContext.Provider>
  );
};

export { ChatsContext, ChatsContextConsumer };
export default Chats;
