import React, { useState, useEffect, useRef } from 'react';
import deta from '@/scss/live/detail.scss';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useDispatch, useSelector } from 'react-redux';
import { homeAction, scoreAction } from '@/actions';
import history from '@/utils/history';
// Import Swiper styles
import 'swiper/swiper-bundle.min.css';
import './swiperReset2.css';
import { RootState } from '@/reducers';
import { generateMsgId } from '@/utils/common';
import GiftSvga from './giftSvga';
import Snackbar from './snackbar';
// install Swiper components
SwiperCore.use([Navigation, Pagination]);

export default function Gift(props: any) {
  const dispatch = useDispatch();
  const giftList = useSelector((state: RootState) => state.home.giftList);
  const uGlod = useSelector((state: RootState) => state.home.uGlod);

  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [giftItem, setGiftItem] = useState<any>({});
  const [temporarilyGiftItem, setTemporarilyGiftItem] = useState<any>({});
  const isLeaveTimerRef = useRef<any>();
  const { socket, room_id } = props;
  const { ubeanNum, ugoldNum, userId } = uGlod;
  const { token, nickName, uid, level, roomId, isVip } = userInfo;
  const [snackbarText, setSnackbarText] = useState('');
  const [giftIsShow, setGiftIsShow] = useState(false);
  const [init, setInit] = useState<boolean>(false);

  const getBalance = () => {
    dispatch({
      type: `home/${homeAction.QUERY_USER_BALANCE_EPIC}`
    });
  };
  const getGiftList = () => {
    dispatch({
      type: `home/${homeAction.GET_GIFT_LIST}`
    });
  };
  useEffect(() => {
    token && getBalance(); // 请求金币接口
    getGiftList();
  }, [token]);
  const GiftItem = (props: any) => {
    const { giftIcon, giftName, callback } = props;
    return (
      <div className={deta.liwu}>
        <img
          style={{
            maxHeight: '42px', maxWidth: '42px', cursor: 'pointer'
          }}
          src={giftIcon}
          alt={giftName}
          onMouseEnter={(e) => {
            setGiftIsShow(true);
            callback(props);
          }}
        />
      </div>
    );
  };

  const isHaveUGlodAndGiveGift = ({ purchasePrice, id, quality, giftName }: any) => {
    dispatch({
      type: `home/${homeAction.USER_GIVES_GIFTS_EPIC}`,
      payload: {
        giftId: id,
        giftQuantity: quality,
        roomId: room_id
      },
      callback(res: any) {
        if (res.code === 200) {
          if (ugoldNum >= (purchasePrice * quality)) {
            // pushGiveGiftMessage(` ${quality} 个 ${giftName} `, id);
            dispatch({
              type: `home/${homeAction.UPDATE_USER_UGLODNUM}`,
              payload: { data: { ugoldNum: ugoldNum - (purchasePrice * quality) } }
            });
          }
        } else {
          console.log('res.data.data.msg', res.msg);
          setSnackbarText('');
          setSnackbarText(res.msg);
          // setSnackbarText(res.data.data.msg)
        }
      }
    });
  };
  const pushGiveGiftMessage = (val: string, giftId: string) => {
    console.log('emit', giftId);
    socket.emit('message', {
      messageId: generateMsgId(),
      username: nickName,
      messageType: 2,
      userId: uid,
      message: val,
      ext: {
        isUp: roomId === room_id ? 1 : 0,
        isVip,
        level,
        giftId
      }
    });
  };

  // 接收礼物
  const ready = () => {
    setInit(true);
    socket.on('message', (data: any) => {
      console.log('on', data?.ext?.giftId);
      let i = 0;
      while (i < giftList?.length) {
        if (giftList[i]?.id === data?.ext?.giftId) {
          setGiftItem({ ...giftList[i], randomstr: generateMsgId() });
          break;
        }
        i++;
      }
    });
  };
  if (!init && giftList?.length) ready();
  // console.log('礼物', giftList)
  // 选择礼物设置数量
  const [quantitys, setQuantitys] = useState([{
    id: 1, value: 66, active: false
  }, {
    id: 2, value: 88, active: false
  }, {
    id: 3, value: 520, active: false
  }, {
    id: 4, value: 666, active: false
  }, {
    id: 5, value: 1314, active: false
  }]);
  const [giftQuantity, setGiftQuantity] = useState<any>(1);
  const [giftNum, setGiftNum] = useState<number>(1);
  // 是否是划过赠送列表
  const [hoverTop, setHoverTop] = useState<boolean>(false);
  // const handleChangeQuantity = (v: any) => {
  //   setGiftQuantity(v)
  //   setQuantitys([...quantitys.map(item => {
  //     console.log(item.value === Number(v))
  //     if (item.value === Number(v)) return { ...item, active: true }
  //     return { ...item, active: false }
  //   })])
  // }
  const isLeave = () => {
    isLeaveTimerRef.current = setTimeout(() => {
      if (!hoverTop) {
        setHoverTop(false);
      }
    }, 500);
  };
  useEffect(() => () => {
    clearTimeout(isLeaveTimerRef.current);
  }, []);
  return (
    <>
      <Snackbar message={snackbarText} />
      {Object.keys(giftItem).length && <GiftSvga {...giftItem} onClose={() => {}} /> || <></>}
      {/* 滑入显示礼物 */}
      {/* onMouseLeave={() => setGiftIsShow(false)} */}
      <div className={deta.giftwrap}>
        <div className={deta.giftMain} onMouseLeave={() => setGiftIsShow(false)}>
          <div style={{ width: '100%', height: '15px', position: 'absolute', top: '-9px', zIndex: 100 }} />
          <div className={deta.giftList}>
            <div className="swiper-cont2">
              <div className="swiperXin22 swiper-no-swiping">
                <Swiper
                  style={{ width: '100%', height: '100%' }}
                  spaceBetween={8}
                  slidesPerView={8}
                  navigation
                >
                  {
                    giftIsShow && Object.keys(temporarilyGiftItem)?.length
                      ? (
                        <div
                          className={deta.giftDeta}
                          style={{ position: 'absolute', top: '-183px', left: `${temporarilyGiftItem.index * 54.75 - 110}px` }}
                          onMouseEnter={() => { setHoverTop(true); }}
                          onMouseLeave={(e) => {
                            setGiftQuantity(1);
                            setGiftNum(1);
                            setGiftIsShow(false);
                          }}
                        >
                          <div className={deta.giftliwu}>
                            <div className={deta.giftImg}>
                              <img src={temporarilyGiftItem.giftIcon} />
                            </div>
                            <div className={deta.giftnumber}>
                              <p className={deta.giftnumb}>{temporarilyGiftItem.giftName}</p>
                              <span>
                                金币
                                {temporarilyGiftItem.purchasePrice}
                              </span>
                            </div>
                          </div>
                          <div className={deta.giftCounts}>
                            {
                            quantitys.map((item, index) => (
                              <div
                                key={item.value}
                                className={`${deta.giftCount} ${giftQuantity === index ? deta.giftQuantityActive : ''}`}
                                onClick={() => {
                                  setGiftQuantity(quantitys[index]?.value);
                                  setGiftNum(quantitys[index]?.value);
                                }}
                              >
                                {item.value}
                              </div>
                            ))
                          }
                          </div>
                          <div className={deta.giftPanelFoot}>
                            <div className={deta.total}>
                              <img src="/static/images/room/gift-gold.webp" alt="总额" />
                              <span>
                                共需
                                {giftNum * temporarilyGiftItem.purchasePrice}
                                金币
                              </span>
                            </div>
                            <div className={deta.empty} />
                            <input
                              className={deta.quantityInput}
                              type="number"
                              max={quantitys[quantitys.length - 1]?.value}
                              min="1"
                              value={giftNum}
                              onChange={(e: any) => {
                                setGiftQuantity(e.target.value);
                                setGiftNum(e.target.value);
                              }}
                            />
                            <div
                              className={deta.giftzsong}
                              onClick={() => {
                                if (!token) {
                                  dispatch({
                                    type: `home/${homeAction.UPDATE_OPEN_LOGIN}`,
                                    payload: { activeIndex: 0 }
                                  });
                                } else {
                                  isHaveUGlodAndGiveGift({
                                    purchasePrice: temporarilyGiftItem.purchasePrice,
                                    id: temporarilyGiftItem.id,
                                    quality: giftQuantity,
                                    giftName: temporarilyGiftItem.giftName
                                  });
                                }
                              }}
                            >
                              赠送

                            </div>
                          </div>
                        </div>
                      )
                      : <></>
                  }
                  {
                    giftList?.length && [...giftList].map((item: any, index: number) => (
                      <SwiperSlide key={index}>
                        <GiftItem {...{ ...item, callback: setTemporarilyGiftItem, index }} onMouseLeave={() => setGiftQuantity(0)} />
                      </SwiperSlide>
                    ))
                  }
                </Swiper>
              </div>
            </div>
          </div>
          {/* 礼物底部 */}
          <div className={deta.giftBottom}>
            <span className={deta.giftdbimg} />
            <span className={deta.giftdbNbm}>{ugoldNum}</span>
            <span className={deta.giftdd} />
            <span className={deta.giftdd1}>{ubeanNum}</span>
            <div
              className={deta.giftczBtn}
              onClick={() => {
                if (!token) {
                  dispatch({
                    type: `home/${homeAction.UPDATE_OPEN_LOGIN}`,
                    payload: { activeIndex: 0 }
                  });
                } else {
                  history.push('/user/assets');
                }
              }}
            >
              充值

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
