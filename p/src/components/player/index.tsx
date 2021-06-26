import React, { useEffect, useRef, useState } from 'react';
import ClassNames from "classnames";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import RDPlayer from 'react-dplayer';
import DPlayer from 'dplayer';
import deta from '@/scss/live/detail.scss';
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import { useSafeState } from '@/utils/hooks';
import Snackbar from '@material-ui/core/Snackbar';
import { RootState } from '@/reducers';
import GuideLogin from '@/components/GuideLogin';
import RenderJudge from '@/components/RenderJudge';
import { destoryPlayer, initFlvType, sendDmk, setStateArrayOfActive, updateDmkOpacity, updateVolume } from './function';
import style from './style.scss';
import LivePlayType from '../LivePlayType';
import LivePlayer from '@/components/LivePlayer'
import './ctrl.scss'

const CustomSnackbar = withStyles({
  root: {
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }
})(Snackbar);

const Regulate = (props: any) => {
  const min = props.min ? props.min : 0;
  const max = props.max ? props.max : 100;
  const proportion = ((props.value - min) / (max - min)) * 100;
  return (
    <input
      className={`${deta.regulate__simple} ${props.className}`}
      style={{
        background: `linear-gradient(to right, #3977fe ${proportion}%,#909090 0)`
      }}
      type="range"
      min={min}
      max={max}
      step="1"
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
};

interface RefEl {
  // isHiddenChat: boolean
  [name: string]: any;
}

let dp: any;
let flvPlayer: any;
const Player = (props: any) => {
  // console.log('直播间',props)
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [initDmkState, setInitDmkState] = useState(false);
  const [showRecommend, setShowRecommend] = useState(props?.status === 0);
  const [errorMessage, setErrorMessage] = useSafeState({});
  // 判断首页还是房间
  const isHome = props.isHome || false;

  // 接收弹幕
  const iniDmk = () => {
    if (props && !props.isHiddenChat) {
      if (initDmkState) return;
      setInitDmkState(true);
      if (props?.socket) {
        props.socket.on('message', (data: any) => {
          // 消息
          if (data.messageType === 1) {
            sendDmk(dp, data?.message, {
              color: '#ffc71c',
              type: 'right',
              border: data.userId === userInfo.uid ? '1px solid #3977fe' : 'none'
            });
          }
          // 礼物
          if (data.messageType === 2) {
            const { userNickName, giftQuantity, giftName } = data.ext || {};
            sendDmk(dp, `${userNickName} 送出 ${giftQuantity} 个 ${giftName}`, {
              color: '#ffc71c',
              type: 'right',
              border: data.userId === userInfo.uid ? '1px solid #3977fe' : 'none'
            });
          }
          // 错误信息
          if (data.err) {
            setErrorMessage({ value: data.err, visible: true, key: Date.now() });
          }
        });
      }
    }
  };
  const sendSocketData = ({ messageType = 1, message = '' }) => {
    const messageId = String(new Date().getTime()) + Math.floor(Math.random() * 899 + 100);
    const username = (userInfo && userInfo.nickName) || '访客';
    const userId = '456';
    const data = {
      messageId, // 消息唯一ID,
      username, // 用户名,
      messageType, // 1文本, 2礼物, 3表情 4禁言 5解禁 6机器人发言
      message,
      userId
      // ext:{}     // 扩展
    };
    props.socket.emit('message', data);
  };

  const [videoPaused, setVideoPaused] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState<boolean>(false); // '',web,browser
  const pleyerEl: RefEl = useRef<Element>(null);
  const controlEl: RefEl = useRef<Element>(null);
  const [videoActive, setVideoActive] = useState(true);

  const [danmakus, setDanmakus] = useState([
    {
      id: 1,
      label: 'Close弹幕',
      active: false,
      className: 'dpsettingNo'
    },
    {
      id: 2,
      label: 'Less弹幕',
      active: false,
      className: 'dpsettingLess'
    },
    {
      id: 3,
      label: 'More弹幕',
      active: true,
      className: ''
    }
  ]);

  const initQuality = (data: any[]) => {
    const list = data.map((item: { name: any; playUrl: any }, index: number) => {
      if (index === 0) {
        return { id: index, active: true, label: item.name, url: item.playUrl };
      }
      return { id: index, active: false, label: item.name, url: item.playUrl };
    });
    setQuality(list);
  };
  const [quality, setQuality] = useState<any>([]);
  // 视频质量
  const handleQuality = ({ id = 0 }) => {
    setStateArrayOfActive(quality, 'id', id, setQuality);
    initPlayer();
  };
  const [volume, setVolume] = useState(70);
  // 设置音量
  const handleVolume = (value: any) => {
    setVolume(Number(value));
    updateVolume(dp, Number(value) / 100);
  };
  // 弹幕透明度
  const [dmkOpacity, setDmkOpacity] = useState(100);
  const handleSetDmkOpacity = (value: any) => {
    setDmkOpacity(Number(value));
    updateDmkOpacity(dp, Number(value) / 100);
  };
  const initPlayer = () => {
    destoryPlayer(dp, flvPlayer);
    setVideoPaused(false);
    dp = new DPlayer({ ...setVideoOptions() });

    if (dp && dp.video) {
      dp.on('pause', () => setVideoPaused(dp.video.paused));
      dp.on('play', () => setVideoPaused(dp.video.paused));
      setVideoPaused(dp.video.paused);
    }
    pleyerEl.current.querySelector('.dplayer-mask').remove();
    pleyerEl.current.querySelector('.dplayer-controller-mask').remove();
    pleyerEl.current.querySelector('.dplayer-bezel').remove();
    pleyerEl.current.querySelector('.dplayer-controller').remove();
    pleyerEl.current.querySelector('.dplayer-notice').remove();
    if (controlEl.current) {
      pleyerEl.current.appendChild(controlEl.current);
    }
    // 删除右键
    pleyerEl.current.querySelector('.dplayer-menu').remove();
  };

  const [showDmkPanel, setShowDmkPanel] = useState(false);
  const [dmkType, setDmkType] = useState([
    { id: 1, label: '无', active: false },
    { id: 2, label: '显示弹幕', active: true }
  ]);
  const handleDmkType = ({ id = 1 }) => {
    if (id === 1) {
      dp.danmaku.clear();
      dp.danmaku.hide();
    } else if (id === 2) {
      dp.danmaku.show();
    }
    setStateArrayOfActive(dmkType, 'id', id, setDmkType);
  };

  const dmkInputRef: RefEl = useRef<Element>(null);
  const [dmkInput, setDmkInput] = useState('');
  const handleSendDmk = () => {
    const message = dmkInputRef.current.value;
    if (message) {
      sendSocketData({ message });
      setDmkInput('');
    }
  };

  const setVideoOptions = () => ({
    container: pleyerEl.current,
    autoplay: true,
    controls: true,
    live: true,
    volume: 0.7,
    video: {
      customType: {
        customFlv: (video: any, player: any) => {
          setShowRecommend(false)
          flvPlayer = initFlvType(video, player);
          flvPlayer.on('error', ()=>{
            setShowRecommend(true)
          })
        }
      },
      quality:
        props?.playAddr?.length > 0
        && props?.playAddr?.map((item: any, index: any) => ({
          name: item.name,
          url: item.playUrl,
          type: 'customFlv'
        })),
      defaultQuality: Math.max(
        quality.findIndex((i: any) => i.active),
        0
      )
    },
    danmaku: {
      id: `${+new Date()}`,
      api: `${+new Date()}`,
      maximum: 1000 // 弹幕获取的数量
    },
    contextmenu: []
  });

  // 弹幕字体大小最小12,默认13，最大40
  const [dmkFontSizes, setDmkFontSizes] = useState([
    {
      id: 1,
      label: '小',
      value: 14,
      active: true
    },
    {
      id: 2,
      label: '中',
      value: 20,
      active: false
    },
    {
      id: 3,
      label: '大',
      value: 23,
      active: false
    }
  ]);
  const [dmkFontSize, setDmkFontSize] = useState(20);
  const upDmkFontSize = (fontSize: any = 13) => {
    const danmakuContainer = pleyerEl.current.querySelector('.dplayer-danmaku');
    if (danmakuContainer) {
      danmakuContainer.style.fontSize = `${fontSize}px`;
    }
  };
  const handleSetDmkFontSize = (value: any) => {
    setDmkFontSizes([
      ...dmkFontSizes.map((item) => {
        if (item.value == value) return { ...item, active: true };
        return { ...item, active: false };
      })
    ]);
    upDmkFontSize(Number(value));
  };

  const onResetHandle = () => {
    setFullScreen(!!dp.fullScreen.isFullScreen());
  };

  useEffect(() => {
    window.addEventListener('resize', onResetHandle);

    return () => {
      destoryPlayer(dp, flvPlayer);
      window.removeEventListener('resize', onResetHandle);
    };
  }, []);

  useEffect(() => {
    if (props?.playAddr?.length) {
      initQuality(props.playAddr);
      initPlayer();
      iniDmk();
      handleSetDmkFontSize(dmkFontSize);
    }
  }, [props.playAddr]);

  const videoLine: Array<any> = [
    { text: '1', label: '线路1' },
    { text: '2', label: '线路2' }
  ];

  const [age, setAge] = React.useState('');
  const handleChange = (event: any) => {
    setAge(event.target.value);
  };

  return (
    <>
      <div className={`${deta.player} ${!isHome ? '' : deta.isHome}`}>
        <RenderJudge
          value={isHome}
          inactive={(<LivePlayType {...{ livePlayType: props?.status }} />)}
        />
        <div
          id="dplayer"
          style={{ height: props?.isHiddenChat ? '100%' : '' }}
          ref={pleyerEl}
          className={deta.video}
        />
        {/* 进入直播间 */}
        <RenderJudge
          value={isHome}
          active={(
            <Link
              className={deta.joinRoom}
              to={`/live/room/${props?.room_id}`}
              target="_blank"
            >
              进入直播间

            </Link>
          )}
        />
        {/* 登录引导 */}
        <RenderJudge
          value={isHome}
          inactive={(<GuideLogin />)}
        />
        {/* 播放mask */}
        <div className={ClassNames(deta.videoMask, 'player-ctrl')} ref={controlEl}>
          <div className={deta.playingleft}>
            <div
              className={`${deta.iconSimple} ${
                videoPaused ? deta.playBtn : deta.pause
              }`}
              data-play={videoPaused ? '播放' : '暂停'}
              onClick={() => dp.toggle()}
            />
            <div
              className={`${deta.iconSimple} ${deta.playRefre}`}
              onClick={() => initPlayer()}
            />
            {!isHome ? (
              ''
            ) : (
              <div className={deta.steamContent}>
                <div className={deta.steam}>
                  <img
                    src="/static/images/home/steam.gif"
                    className={deta.steamplay}
                  />
                  <span className={deta.steamtext}>LIVE</span>
                </div>
              </div>
            )}
            {/* <Regulate value={volume} onChange={(value: any) => handleVolume(value)} className={deta.volume} /> */}
            <div className={deta.matchName}>{props?.title}</div>
          </div>

          {/*{!props.isHiddenChat && fullScreen && (*/}
          {/*  <div className={deta.playingmiddle}>*/}
          {/*    <div>*/}
          {/*      <input*/}
          {/*        type="text"*/}
          {/*        placeholder="来个弹幕助助兴 ~ "*/}
          {/*        className={deta.dmkInput}*/}
          {/*        value={dmkInput}*/}
          {/*        ref={dmkInputRef}*/}
          {/*        onChange={(e) => setDmkInput(e.target.value)}*/}
          {/*      />*/}
          {/*    </div>*/}
          {/*    <div*/}
          {/*      className={`${deta.sendBtn}`}*/}
          {/*      onClick={() => handleSendDmk()}*/}
          {/*    >*/}
          {/*      <span>发送</span>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*)}*/}
          <div className={deta.playingright}>
            <i className={deta.laba} />
            <Regulate
              value={volume}
              onChange={(value: any) => handleVolume(value)}
              className={deta.volume}
            />

            {!isHome ? (
              <div className={deta.dmk}>
                {danmakus
                  .filter((item) => item.active)
                  .map((item, index) => (
                    <div
                      key={index}
                      className={`${deta.iconSimple} ${deta.dpsetting} ${
                        item.id == 1
                          ? deta.dpsettingNo
                          : item.id == 2
                            ? deta.dpsettingLess
                            : ''
                      }`}
                      onClick={() => setShowDmkPanel(!showDmkPanel)}
                    >
                      弹
                    </div>
                  ))}
                <div className={deta.dmkPanel}>
                  <div className={deta.dmkPanelBg} />
                  <div className={deta.dmkPanelBody}>
                    <div className={deta.dmkPanelItem}>
                      <div className={deta.dmkPanelTitle}>弹幕显示区域</div>
                      <div className={deta.dmkPaneContent}>
                        {dmkType.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleDmkType(item)}
                            className={`${deta.dmkPenelView} ${
                              item.active ? deta.dmkPenelViewActive : ''
                            }`}
                          >
                            <div />
                            <div className={deta.viewText}>{item.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={deta.dmkPanelItem}>
                      <div className={deta.dmkPanelTitle}>弹幕字号</div>
                      <div className={deta.regulateBox}>
                        {dmkFontSizes.map((item) => (
                          <div
                            key={item.id}
                            className={`${deta.dmkFontSizeItem} ${
                              item.active ? deta.dmkFontSizeItemActive : ''
                            }`}
                            onClick={() => handleSetDmkFontSize(item.value)}
                          >
                            {item.label}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={deta.dmkPanelItem}>
                      <div className={deta.dmkPanelTitle}>弹幕透明</div>
                      <div className={deta.regulateBox}>
                        <Regulate
                          className={deta.regulate}
                          value={dmkOpacity}
                          onChange={(value: any) => handleSetDmkOpacity(value)}
                        />
                        <span className={deta.value}>
                          {dmkOpacity}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={deta.sanicon} />
                </div>
              </div>
            ) : (
              <></>
            )}

            <div className={deta.chaoqing}>
              {quality.map(
                (item) => item.active && (
                  <p key={item.id} className={deta.chaoqingp2}>
                    <span className={deta.chaoqingtext}>{item.label}</span>
                  </p>
                )
              )}
              {/* 弹出框 */}
              <div className={`${deta.chaobox}`}>
                <div className={deta.customer}>
                  {/* <span>画质:</span> */}
                  <ul className={deta.custItem}>
                    {quality.map((item: any) => (
                      <li
                        key={item.id}
                        onClick={() => handleQuality(item)}
                        className={`${style.qualityItem} ${
                          item.active ? style.qualityItemActive : ''
                        }`}
                      >
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className={deta.sanicon} />
              </div>
            </div>

            {fullScreen ? (
              <div
                className={`${deta.iconSimple} ${deta.dplayfull}`}
                onClick={(e) => {
                  setVideoActive(true);
                  dp.fullScreen.cancel();
                }}
              />
            ) : (
              <div
                className={`${deta.iconSimple} ${deta.dplayfull}`}
                onClick={(e) => {
                  setVideoActive(false);
                  dp.fullScreen.request();
                }}
              />
            )}
          </div>
        </div>
        {/*推荐*/}
        <RenderJudge
          value={showRecommend}
          active={(
            <LivePlayer.Recommend sportId={props?.live_type_id}/>
          )}
        />
        <CustomSnackbar
          autoHideDuration={1500}
          onClose={() => setErrorMessage({})}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={errorMessage.visible}
          message={errorMessage.value}
          key={`errMsg_${errorMessage.key}`}
        />
      </div>
    </>
  );
};

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3)
    }
  },
  input: {
    borderRadius: 2,
    position: 'relative',
    backgroundColor: 'transparent',
    border: 'solid 0.5px #8b8b8a',
    fontSize: 12,
    color: '#8b8b8a',
    padding: '5px 6px 5px 6px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    '&:focus': {
      borderRadius: 2,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 1px rgba(0,123,255,.25)'
    }
  }
}))(InputBase);
export default Player;
