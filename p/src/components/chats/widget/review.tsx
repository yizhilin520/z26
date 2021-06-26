import React, { useEffect, useContext, useState, useRef } from 'react';
import { EmitOnMsg } from '@/models/room';
import BearCard from '@/components/BearCard/UserInfoBox';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/reducers';
import { homeAction, userAction } from '@/actions';
import { generateMsgId, generateTime, secondFormatter} from '@/utils/common';
import classNames from 'classnames';
import dayJs from 'dayjs';
import RenderJudge from '@/components/RenderJudge'
import Input from './input';
import { ChatsContext } from '../index';
import style from './widget.scss';

import { useLogin } from '@/utils/hooks';
import DialogKick from '@/components/BearCard/DialogKick'
import history from '@/utils/history'

const ChatReview: React.FC = (args) => {
  const [props, setProps] = useState(args)
  const { isLogin, login } = useLogin();
  const { uid: anchorUserId, room_id, anchor, isCurrentAnchor,isManage, isKickOutIng,kickOutDiff, forbidStatus,forbidTimeDiff} = props;
  // console.log('shuju', props)

  const [userShow, setUserShow] = useState(false)
  const userInfo = useSelector(({user})=>user.userInfo);

  const { state, ioDispatch } = useContext(ChatsContext);
  const { messages, onlineCount } = state;
  const [init, setInit] = useState<boolean>(false);
  const [chatUserInfo, setChatUserInfo] = useState<any>(Object.create(null));
  // 榜单
  const dispatch = useDispatch();
  const billboard: any = useSelector((state: RootState) => state.home.billboard);
  const updateMsg: Function = (data: EmitOnMsg) => {
    const newMsg = {
      type: 'chat',
      username: data.username,
      userId: data.userId,
      messageId: data.messageId,
      action: data.message,
      messageType: data.messageType,
      msgId: generateMsgId(),
      time: generateTime(),
      ext: data.ext
    };
    ioDispatch({
      type: 'UPDATE_USER_MESSAGE',
      payload: {
        message: newMsg
      }
    });
  };
  const updateSysMsg: Function = (obj: any, action: string) => {
    const newMsg = {
      type: 'system',
      anchor: props.anchor,
      username: obj.username,
      uid: obj.uid,
      action,
      isUp: obj.isUp,
      isVip: obj.isVip,
      level: obj.level,
      msgId: generateMsgId(),
      time: generateTime(),
      messageType: obj.messageType || 0,
      ...obj
    };
    ioDispatch({
      type: 'UPDATE_SYSTEM_MESSAGE',
      payload: {
        message: newMsg
      }
    });
  };
  // 踢人弹框
  const getKickOutTime2Val=()=>{
    let result=0
    if(kickOutDiff >= 0 && kickOutDiff != null ){
      let time = dayJs((kickOutDiff*1000)+Date.now()).format('YYYY-MM-DD HH:mm:ss')
      result=time
    }

    return result
  }
  const [kickOutTime2, setKickOutTime2] = useState(getKickOutTime2Val())

  const ready = () => {
    const { socket } = state;
    setInit(true);
    socket.on('message', (data: any) => {
      // console.log('joinRoom----->', data)
      updateMsg(data);
    });
    // 对应reg
    socket.on('joinRoom', (o: any) => {
      // console.log('joinRoom----->', o)
      updateSysMsg(o, '进入直播间');
    });
    // 离开房间
    // socket.on('leaveRoom', (o: any) => {
    //   updateSysMsg(o, 'login')
    // })
    // 用户人数
    socket.on('onlineCount', (count: any) => {
      ioDispatch({
        type: 'UPDATE_ONLINE_COUNT',
        payload: {
          onlineCount: count
        }
      });
    });
    // 登录后更新注册信息
    socket.on('updateReg', (o: any) => {
      updateSysMsg(o, '登录成功');
    });
    // 禁言/踢人
    socket.on('back', data=>{
      const {messageType, userId, ext:{timeOut, optType}={}}=data||{}
      if(messageType === -1 && userInfo.uid === userId){
        if(optType === '2') {
          // 踢人
          setKickOutTime2(dayJs(Number(timeOut)).format('YYYY-MM-DD HH:mm:ss'))
        }
        if(optType === '1'){
          //禁言
          setProps({
            ...props||{},
            forbidStatus: true
          })
        }
      }
    })

    // 解禁
    socket.on('unback', data=>{
      const {roomId, userId}=data||{}
      if(Number(roomId) === Number(props.room_id) && userInfo.uid === userId){
        setProps({
          ...props||{},
          forbidStatus: false
        })
      }
    })
  };
  if (!init) ready();



  const [billboardType, setBillboardType] = useState([{
    id: 1, label: '周贡献榜', type: 0, active: true
  }, {
    id: 2, label: '月贡献榜', type: 1, active: false
  }]);

  // const [initState, setInitState] = useState(false)
  // const scrollToMessageList = useRef(null)
  // useEffect(() => {
  //   if (initState) return
  //   setInitState(true)

  //   // window.scrollTo(0, scrollToMessageList.current.scrollTop + 50)
  // }, [])
  // 如果主播id存在拉榜单

  useEffect(() => {
    anchorUserId && getBillboard({});
  }, []);
  // 获取榜单数据
  const getBillboard = ({ id = 1, type = 0 }) => {
    setBillboardType([...billboardType.map((i) => {
      if (i.id === id) return { ...i, active: true };
      return { ...i, active: false };
    })]);
    dispatch({
      type: `home/${homeAction.GET_BILLBOARD}`,
      payload: { anchorUserId, type }
    });
  };
  // 点击其它用户弹窗
  const _getChatUserInfo = (userId: string) => {
    if (!isLogin) return login();
    if( userId === userInfo?.uid){
      return false
    }
    dispatch({
      type: `user/${userAction.GET_CHAT_USER_INFO}`,
      payload: { userId, roomId: room_id },
      callback: (res: any) => {
        if (res.code === 200) {
          setUserShow(true)
          setChatUserInfo({ ...res.data, randomstr: generateMsgId() });
        }
      }
    });
  };
  // anchorUserId && getBillboard({})
  // 关闭弹窗
  const UserInfoClose = () => {
    setUserShow(false)
  }
//  屏蔽其它用户
  const[ShieldVal, setShieldVal] = useState({userIdIs:'', isShield:true, timestamp:0})
  const ChangUserInfo =(id) =>{
    setShieldVal({...id})
  }
  // console.log('messages', messages)


    const onKickok = () =>{
      history.push('/live/list')
    }

  return (
    <>
      <div className={style.roomright}>
        <div className={style.flexWrap}>
          <div className={style.deveto}>

            {/* 如果贡献榜是空则不展示 */}
            {
            billboard?.length >= 3 && (
            <>
              <div className={style.devetoTop}>
                {/* 共享榜按钮 */}
                <div className={style.devetoTopTitle}>
                  <div className={style.devetoBtnGroup}>
                    {
                      billboardType.map((item) => (
                        <div className={`${style.devetoBtn} ${item.active ? style.devetoBtnActive : ''}`} key={item.id} onClick={() => getBillboard(item)}>{item.label}</div>
                      ))
                    }
                  </div>
                </div>
                <div className={style.devetoListTop}>
                  {
                    billboard.map((item: any, index: number) => (
                      index < 3 ? (
                        <div key={index} className={style.devetoListItem}>
                          <div className={style.avatar}>
                            <img src={item.headImg} alt="头像" />
                          </div>
                          <div className={style.avatarBg}>
                            {
                                index == 0 ? (
                                  <img src="/static/images/room/dengji1.webp" alt="头像框" />
                                ) : index == 1 ? (
                                  <img src="/static/images/room/dengji2.webp" alt="头像框" />
                                ) : index == 2 ? (
                                  <img src="/static/images/room/dengji3.webp" alt="头像框" />
                                ) : ''
                              }
                          </div>
                          <div className={style.level}>
                            LV
                            {item.level||1}
                          </div>
                          <div className={classNames(style.ellipsis, style.nickname)}>
                            {item.nickName}
                          </div>
                          <div className={style.reward}>
                            {item.totalAmount}
                          </div>
                        </div>
                      ) : ''
                    ))
                  }
                </div>
              </div>
              <div className={style.devetoListOther}>
                <div className={style.devetiListOtherWrap}>
                  {
                    billboard.map((item: any, index: number) => (
                      index > 2 ? (
                        <div key={index} className={style.otherItem}>
                          <span className={`${style.listItem} ${style.rank}`}>{index + 1}</span>
                          <span className={`${style.listItem} ${style.avatar}`}>
                            <img src={item.headImg} alt="头像" />
                          </span>
                          <span className={`${style.listItem} ${style.userName}`}>{item.nickName}</span>
                          <span className={`${style.listItem} ${style.level}`}>
                            <span className={style.levelIcon}>
                              <img src="/static/images/room/diwei.webp" alt="排行" />
                            </span>
                            <span>
                              LV
                              {item.level||1}
                            </span>
                          </span>
                          <span className={`${style.listItem} ${style.empty}`} />
                          <span className={`${style.listItem} ${style.reward}`}>{item.totalAmount}</span>
                        </div>
                      ) : ''
                    ))
                  }
                </div>
              </div>
            </>
            )
            || <></>
          }
            <div className={style.devetoListMiddle}>
              <div className={style.chatBtn}>聊天室</div>
              <div className={style.chatCount}>
                <div className={style.allPeople}>
                  <img src="/static/images/room/all-people.webp" alt="icon" />
                </div>
                {onlineCount}
              </div>
            </div>
          </div>
          <div className={`${style.roomRen} ${style.showDeveto}`}>
            <div className={style.gongGao}>
              <span className={style.icon} />
              <span>
                U球直播倡导绿色直播，文明观看，如出现低俗，黄暴，涉赌等内容，欢迎举报。请勿轻信各类诱导诱骗，内部渠道优惠充值，私下交易等行为。
              </span>
            </div>
            {/* 主播欢迎语 */}

            {/*<RenderJudge*/}
            {/*  value={userInfo && anchor && anchor?.uid !== userInfo?.uid}*/}
            {/*  active={(*/}
            {/*    <div className={style.zhubowelcome}>*/}
            {/*      <img src={anchor?.user_img} className={style.welcomeImg} alt="主播"/>*/}
            {/*      <div className={style.welcomeText}>主播-{anchor?.nickname} 欢迎@{userInfo.nickName}进入直播间</div>*/}
            {/*    </div>*/}
            {/*  )}*/}
            {/*/>*/}

            <ul className={style.roomMsg}>
              {
              userShow?
               <BearCard {...{ ...chatUserInfo, room_id, isCurrentAnchor, isManage, randomstr: generateMsgId() }} UserInfoClose={UserInfoClose} ChangUserInfo={ChangUserInfo} />
              : <></>
            }
              {
              messages.map((item: any, index: number) => {
                if (item.messageType == '0') return <RoomIn {...{ ...item, callback: _getChatUserInfo }} key={index} />;
                if (item.messageType == '1') return <Message2 {...{ ...item, callback: _getChatUserInfo, ...ShieldVal }} key={index} />;
                if (item.messageType == '2') return <Gift {...{ ...item, callback: _getChatUserInfo }} key={index} />;
                if (item.messageType == '3') return <Forbidden {...{ ...item, callback: _getChatUserInfo }} key={index} />;
                if (item.messageType == '6') return <RobotMessage {...{ ...item, callback: _getChatUserInfo }} key={index} />;
              })
            }
              {/* <User /> */}
            </ul>
          </div>
          <Input {...props} />

          <div className={`${style.forbiddenMain} ${forbidStatus===true? '':style.forbidIsShow}`}>
            <div className={style.forbiddenWrap}></div>
            <p className={style.forbiddenText}>您已被禁言</p>
          </div>
        </div>

      </div>
       <DialogKick visible={!!kickOutTime2}>
            <div className={style.kickUser}>
              <p className={style.kickText}>
                {/*您已被踢出该直播间，{kickOutTime2}时间内无法进入该直播间！*/}
                您已被踢出该直播间，无法进入该直播间！
              </p>
              <div className={style.kickBtn}>
                  <button className={`${style.kickOk}`} onClick={onKickok}>确定</button>
              </div>
            </div>
        </DialogKick>
    </>
  );
};

const Gift = (props: any) => {
  // giftId: 4246197678224384
  // giftName: "战靴"
  // giftQuantity: 520
  // roomId: 230694
  // userHead: "http://www.doudong999.top/cloud-east-ulive/3f7229f3de1ddb35/c17d5b59f6fe22f2/2d153d97e142b578/20210308/43415251-9181-41cc-9224-e10482b9daeb.jpg?version=3"
  // userId: "1342809520757350402"
  // userNickName: "test1"
  const {userId, userNickName, giftName, giftQuantity}=props?.ext||{}
  return (
    <>
      <li className={style.gift} onClick={() => props.callback(userId)}>
      <span className={style.userName}>
        感谢
        {userNickName}
        :
        {' '}
      </span>
        <span>{`送出 ${giftQuantity} 个 ${giftName}`}</span>
        {/*<span>{props.time}</span>*/}
      </li>
    </>
  );
}
const Forbidden = (props: any) => (
  <>
    <li className={style.forbidden} onClick={() => props.callback(props.userId)}>
      <span className={style.userName}>{props.userName}</span>
      因
      <span className={style.cause}>{props.cause}</span>
      已被禁言
      <span className={style.causeTime}>{props.causeTimeShow}</span>
      ！
    </li>
  </>
);
const RobotMessage=({username,action})=>{
 return (
   <li className={style.msg}>
     <span className={style.text}>
      <span className={style.userName} style={{cursor: 'default'}}>{`${username}: `}</span>
       <span>{action}</span>
       </span>
   </li>
 )
}
const Message2 = (props: any) => {
  const { isUp, isVip, level } = props?.ext || {};
  const {userIdIs, isShield, timestamp,} = props;

  return (
    <>
    {
      // 屏蔽其它用户
      isShield === false && userIdIs === props.userId ?
      null
      :
      <li className={style.msg} onClick={() => props.callback(props.userId)}>
        <span>
          {isUp ? <span className={style.isUp}>主播</span> : ''}
          {/* {isVip ? <span className={style.level}>LV {level}</span> : ''} */}
          <span className={style.level}>
            LV
            {level||1}
          </span>
          <span className={isUp ? style.isUpText : style.text}>
            <span className={style.userName}>
              {props.username}
              :
              {' '}
            </span>
            {props.action}
          </span>
        </span>
      </li>
    }
    </>
  );
};
const RoomIn = (props: any) => (

  <>
    <li className={style.roomIn} onClick={() => props.callback(props.uid)}>
      {
        props.isVip
          ? (
            <span>
              <span className={style.level}>
                LV
                {props.level||1}
              </span>
              <span className={style.userName}>{props.username}</span>
              <span className={style.text}>{props.action}</span>
            </span>
          )
          : (
            <RenderJudge
              value={props?.anchor}
              active={(
                <div className={style.zhubowelcome}>
                  <img src={props?.anchor?.user_img} className={style.welcomeImg} alt="主播"/>
                  <div className={style.welcomeText}>主播-{props?.anchor?.nickname} 欢迎@{props.username}进入直播间</div>
                </div>
              )}
            />
          )
      }
    </li>
  </>
);

export default ChatReview;
