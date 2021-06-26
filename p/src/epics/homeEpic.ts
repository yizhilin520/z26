import { ofType, Epic } from 'redux-observable';
import { mergeMap, map } from 'rxjs/operators';
import { PayloadIn, PayloadOut } from '@/types';
import { homeApi } from '@/servers';
import { homeAction } from '@/actions';
import { createAction } from '@/utils/helpers';
import { HttpCode } from '@/enums';

/**
 * 获取顶部直播列表
 * @param $action
 */
export const getLiveList: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`home/${homeAction.GET_LIVE_LIST_EPIC}`),
    mergeMap(action => {
      return homeApi.getLiveList(action.payload).pipe(
        map(res => {
          try {
            if(action?.callback){
              action?.callback({...res.data})
            }
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                `home/${homeAction.UPDATE_LIVE_LIST_REDUCER}`,
                {
                  data: res.data.data.rows
                }
              );
            }
            return createAction('app');
          } catch (error) {
            return createAction('app');
          }
        })
      );
    })
  );
};

/**
 * 获取正在热播
 * @param $action
 */
export const getHotNowLiveList: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`home/${homeAction.GET_HOT_NOW_LIVE_LIST_EPIC}`),
    mergeMap(action => {
      return homeApi.getLiveList(action.payload).pipe(
        map(res => {

          try {
            if (res.data.code === HttpCode.SUCCESS) {
              //dataType-> 0普通接口,1复用接口
              switch (action.payload.dataType) {
                case 0: {
                  return createAction(
                    `home/${homeAction.UPDATE_HOT_NOW_LIVE_LIST_REDUCER}`,
                    {
                      data: res.data.data.rows
                    }
                  );
                }
                case 1: {
                  return createAction(
                    `home/${homeAction.REUSE_UPDATE_HOT_NOW_LIVE_LIST_REDUCER}`,
                    {
                      data: res.data.data.rows
                    }
                  );
                }
              }

            }
            return createAction('app');
          } catch (error) {
            return createAction('app');
          }
        })
      );
    })
  );
};
/**
 * 获取足球热播
 * @param $action
 */
export const getHotFLiveList: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`home/${homeAction.GET_HOT_NOW_LIVE_F_BALL}`),
    mergeMap(action => {
      return homeApi.getLiveList(action.payload).pipe(
        map(res => {
          // console.log('足球1',res.data)
          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                    `home/${homeAction.UPDATE_HOT_NOW_LIVE_F_BALL}`,
                    {
                      data: res.data.data.rows
                    }
                  );
            }
            return createAction('app');
          } catch (error) {
            return createAction('app');
          }
        })
      );
    })
  );
};
/**
 * 获取篮球热播
 * @param $action
 */
export const getHotBasketBallLiveList: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`home/${homeAction.GET_HOT_NOW_LIVE_BASKET_BALL}`),
    mergeMap(action => {
      return homeApi.getLiveList(action.payload).pipe(
        map(res => {
          // console.log('篮球2',res.data)
          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                    `home/${homeAction.UPDATE_HOT_NOW_LIVE_BASKET_BALL}`,
                    {
                      data: res.data.data.rows
                    }
                  );
            }
            return createAction('app');
          } catch (error) {
            return createAction('app');
          }
        })
      );
    })
  );
};
/**
 * 获取电竞热播
 * @param $action
 */
export const getHotDjLiveList: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`home/${homeAction.GET_HOT_NOW_LIVE_DJ}`),
    mergeMap(action => {
      return homeApi.getLiveList(action.payload).pipe(
        map(res => {

          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                    `home/${homeAction.UPDATE_HOT_NOW_LIVE_DJ}`,
                    {
                      data: res.data.data.rows
                    }
                  );
            }
            return createAction('app');
          } catch (error) {
            return createAction('app');
          }
        })
      );
    })
  );
};
/**
 * 有趣的主播列表
 * @param $action
 */
export const getInterestingAnchor: Epic<
  PayloadIn,
  PayloadOut,
  any
> = $action => {
  return $action.pipe(
    ofType(`home/${homeAction.GET_INTERESTING_ANCHOR_EPIC}`),
    // ofType(`user/${userAction.GET_RAND_CODE_EPIC}`),
    mergeMap(action => {
      return homeApi.getInterestingAnchor(action.payload).pipe(
        map(res => {
          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                `home/${homeAction.UPDATE_INTERESTING_ANCHOR_REDUCER}`,
                {
                  data: res.data.data
                }
              );
            }
            return createAction('app');
          } catch (error) {
            return createAction('app');
          }
        })
      );
    })
  );
};

/**
 * 直播订阅--订阅的比赛
 * @param $action
 */
export const getSubscripGame: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`home/${homeAction.GET_SUBSCRIP_GAME_EPIC}`),
    mergeMap(action => {
      return homeApi.getSubscripGame(action.payload).pipe(
        map(res => {
          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                `home/${homeAction.UPDATE_SUBSCRIP_GAME_REDUCER}`,
                {
                  data: res.data.data
                }
              );
            }
            return createAction('app');
          } catch (error) {
            return createAction('app');
          }
        })
      );
    })
  );
};

/**
 * 直播订阅 关注主播--关注列表
 * @param $action
 */
export const getFocusAnchor: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`home/${homeAction.GET_FOCUS_ANCHOR_EPIC}`),
    mergeMap(action => {
      return homeApi.getFocusAnchor(action.payload).pipe(
        map(res => {
          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                `home/${homeAction.UPDATE_FOCUS_ANCHOR_REDUCER}`,
                {
                  data: res.data.data
                }
              );
            }
            return createAction('app');
          } catch (error) {
            return createAction('app');
          }
        })
      );
    })
  );
};
/**
 * 榜单
 * @param $action
 */
export const getBillboard: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`home/${homeAction.GET_BILLBOARD}`),
    mergeMap(action => {
      return homeApi.getBillboard(action.payload).pipe(
        map(res => {
          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                `home/${homeAction.UPDATE_BILLBOARD}`,
                {
                  data: res.data.data || []
                }
              );
            }
            return createAction('app');
          } catch (error) {
            return createAction('app');
          }
        })
      );
    })
  );
};

/**
 * 房间详情
 * @param $action
 */
export const getRoomDetail: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`home/${homeAction.GET_ROOM_DETAIL}`),
    mergeMap(action => {
      return homeApi.getRoomDetail(action.payload).pipe(
        map(res => {
          try {
            action?.callback({ ...res.data })
            return createAction('app');
          } catch (error) {
            return createAction('app');
          }
        })
      );
    })
  );
};

/**
 * 关注接口
 * @param $action
 */
export const getFollow: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`home/${homeAction.GET_FOLLOW}`),
    mergeMap(action => {
      return homeApi.getFollow(action.payload).pipe(
        map(res => {
          try {
            action?.callback({ ...res.data })
            return createAction('app');
          } catch (error) {
            return createAction('app');
          }
        })
      );
    })
  );
};

/**
 * 取消关注主播接口
 * @param $action
 */
export const cancelFollow: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`home/${homeAction.GET_CANCEL_FOLLOW}`),
    mergeMap(action => {
      return homeApi.cancelFollow(action.payload).pipe(
        map(res => {
          try {
            action?.callback({ ...res.data })
            return createAction('app');
          } catch (error) {
            return createAction('app');
          }
        })
      );
    })
  );
};

/**
 * 获取聊天室禁言字典
 * @param $action
 */
export const getDictionary: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`home/${homeAction.GET_DICTIONARY}`),
    mergeMap(action => {
      return homeApi.getDictionary(action.payload).pipe(
        map(res => {
          try {
            action?.callback({ ...res.data })
            return createAction('app');
          } catch (error) {
            return createAction('app');
          }
        })
      );
    })
  );
};

/**
 * 查询是否是房管或者主播
 * @param $action
 */
export const getChatUserState: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`home/${homeAction.GET_CHAT_USER_STATE}`),
    mergeMap(action => {
      return homeApi.getChatUserState(action.payload).pipe(
        map(res => {
          try {
            action?.callback({ ...res.data })
            return createAction('app');
          } catch (error) {
            return createAction('app');
          }
        })
      );
    })
  );
};

/**
 * 获取直播间礼物列表
 * @param $action
 */
export const getGiftList: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`home/${homeAction.GET_GIFT_LIST}`),
    mergeMap(action => {
      return homeApi.getGiftList({}).pipe(
        map(res => {
          try {
            action?.payload?.callback({ ...res })
            return createAction(
              `home/${homeAction.UPDATE_GIFT_LIST}`,
              {
                data:res.data.data
              }
            );
            return createAction('app');
          } catch (error) {
            return createAction('app');
          }
        })
      );
    })
  );
};

/**
 * 赠送礼物钱查询钱包
 * @param $action
 */
export const queryUserBalance: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`home/${homeAction.QUERY_USER_BALANCE_EPIC}`),
    mergeMap(action => {
      return homeApi.queryUserBalance({}).pipe(
        map(res => {
          try {
            if (res.data.code === HttpCode.SUCCESS) {
              return createAction(
                `home/${homeAction.UPDATE_USER_UGLODNUM}`,
                {
                  data:res.data.data
                }
              );
            }
            return createAction('app');
          } catch (error) {
            return createAction('app');
          }
        })
      );
    })
  );
};
/**
 * 赠送礼物
 * @param $action
 */
export const userGiveGifts: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`home/${homeAction.USER_GIVES_GIFTS_EPIC}`),
    mergeMap(action => {
      return homeApi.userGiveGifts(action.payload).pipe(
        map(res => {
          try {
            action.callback(res.data)
            if (res.data.code === HttpCode.SUCCESS) {
              // return createAction(
              //   `home/${homeAction.UPDATE_GIFT_LIST}`,
              //   {
              //     data: res.data.data
              //   }
              // );
            }
            return createAction('app');
          } catch (error) {
            return createAction('app');
          }
        })
      );
    })
  );
};
/**
 * 用户预约(订阅)
 * @param $action
 */
export const userReserves: Epic<PayloadIn, PayloadOut, any> = $action => {
  return $action.pipe(
    ofType(`home/${homeAction.GET_USERRESERVES_EPIC}`),
    mergeMap(action => {
      return homeApi.userReserves(action.payload).pipe(
        map(res => {
          try {
            action?.callback({ ...res.data })
            return createAction('app');
          } catch (error) {
            return createAction('app');
          }
        })
      );
    })
  );
};