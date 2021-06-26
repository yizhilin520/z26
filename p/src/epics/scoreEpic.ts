import { Epic, ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators';
import { PayloadIn, PayloadOut } from '@/types';
import { scoreApi } from '@/servers';
import { scoreAction } from '@/actions';
import { createAction } from '@/utils/helpers';
import { HttpCode } from '@/enums';

/**
 * 获取赛事预告
 * @param $action
 */
export const getNotice: Epic<PayloadIn, PayloadOut, any> = ($action) => $action.pipe(
  ofType(`score/${scoreAction.GET_TOURNAMENT_PREVIEW}`),
  mergeMap((action) => scoreApi.getNotice(action.payload).pipe(
    map((res) => {
      try {
        if (res.data.code === HttpCode.SUCCESS) {
          switch (action.payload.dataType) {
            case 0: {
              return createAction(
                `score/${scoreAction.UPDATE_TOURNAMENT_PREVIEW}`,
                {
                  data: res.data.data
                }
              );
            }
            case 1: {
              return createAction(
                `score/${scoreAction.REUSE_UPDATE_TOURNAMENT_PREVIEW}`,
                {
                  data: res.data.data
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
  ))
);

/**
 * 获取赛事
 * @param $action
 */
export const getMatch: Epic<PayloadIn, PayloadOut, any> = ($action) => $action.pipe(
  ofType(`score/${scoreAction.GET_MATCH}`),
  mergeMap((action) => scoreApi.getMatch(action.payload).pipe(
    map((res) => {
      try {
        if (action && action?.callback) {
          action?.callback({ ...res.data });
        }
        if (res.data.code === HttpCode.SUCCESS) {
          return createAction(`score/${scoreAction.UPDATE_MATCH}`, {
            data: res.data.data
          });
        }
        return createAction('app');
      } catch (error) {
        return createAction('app');
      }
    })
  ))
);
/**
 * 获取赛事 用于过滤
 * @param $action
 */
export const getMatchFilter: Epic<PayloadIn, PayloadOut, any> = ($action) => $action.pipe(
  ofType(`score/${scoreAction.GET_MATCH_FILTER}`),
  mergeMap((action) => scoreApi.getMatch(action.payload).pipe(
    map((res) => {
      try {
        if (res.data.code === HttpCode.SUCCESS) {
          return createAction(`score/${scoreAction.UPDATE_MATCH_FILTER}`, {
            data: res.data.data
          });
        }
        return createAction('app');
      } catch (error) {
        return createAction('app');
      }
    })
  ))
);
/**
 * 指数走势2s
 * @param $action
 */
export const getExponentTrend: Epic<PayloadIn, PayloadOut, any> = ($action) => $action.pipe(
  ofType(`score/${scoreAction.GET_EXPONENT_TREND}`),
  mergeMap((action) => scoreApi.getExponentTrend(action.payload).pipe(
    map((res) => {
      try {
        if (res.data.code === HttpCode.SUCCESS) {
          return createAction(
            `score/${scoreAction.UPDATE_EXPONENT_TREND}`,
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
  ))
);

/**
 * 赛事详情
 * @param $action
 */
export const getMatchDetails: Epic<PayloadIn, PayloadOut, any> = ($action) => $action.pipe(
  ofType(`score/${scoreAction.GET_MATCH_DETAILS}`),
  mergeMap((action) => scoreApi.getMatchDetails(action.payload).pipe(
    map((res) => {
      try {
        if (res.data.code === HttpCode.SUCCESS) {
          return createAction(`score/${scoreAction.UPDATE_MATCH_DETAILS}`, {
            data: res.data.data
          });
        }
        return createAction('app');
      } catch (error) {
        return createAction('app');
      }
    })
  ))
);
/**
 * 单场PC赛事详情
 * @param $action
 */
export const getMatchInfo: Epic<PayloadIn, PayloadOut, any> = ($action) => $action.pipe(
  ofType(`score/${scoreAction.GET_MATCH_INFO}`),
  mergeMap((action) => scoreApi.getMatchInfo(action.payload).pipe(
    map((res) => {
      try {
        if (res.data.code === HttpCode.SUCCESS) {
          return createAction(`score/${scoreAction.UPDATE_MATCH_INFO}`, {
            data: res.data.data
          });
        }
        return createAction('app');
      } catch (error) {
        return createAction('app');
      }
    })
  ))
);
/**
 * app实时统计
 * @param $action
 */
export const getAppRealtime: Epic<PayloadIn, PayloadOut, any> = ($action) => $action.pipe(
  ofType(`score/${scoreAction.GET_APP_REALTIME}`),
  mergeMap((action) => scoreApi.getAppRealtime(action.payload).pipe(
    map((res) => {
      try {
        if (res.data.code === HttpCode.SUCCESS) {
          return createAction(`score/${scoreAction.UPDATE_APP_REALTIME}`, {
            data: res.data.data
          });
        }
        return createAction('app');
      } catch (error) {
        return createAction('app');
      }
    })
  ))
);

/**
 * 事件统计
 * @param $action
 */
export const getEventStatistics: Epic<PayloadIn, PayloadOut, any> = ($action) => $action.pipe(
  ofType(`score/${scoreAction.GET_EVENT_STATISTICS}`),
  mergeMap((action) => scoreApi.getEventStatistics(action.payload).pipe(
    map((res) => {
      try {
        if (res.data.code === HttpCode.SUCCESS) {
          return createAction(`score/${scoreAction.UPDATE_EVENT_STATISTICS}`, {
            data: res.data.data
          });
        }
        return createAction('app');
      } catch (error) {
        return createAction('app');
      }
    })
  ))
);

const getLiveInfoByIdHandle = (params) => scoreApi.getLive365({ match_id: params.matchId });

/**
 * 根据赛事id查询直播信息
 * @param $action
 */
export const getLiveInfoById: Epic<PayloadIn, PayloadOut, any> = ($action) => $action.pipe(
  ofType(`score/${scoreAction.GET_LIVE_INFO_BY_ID}`),
  mergeMap(async (action) => {
    const res365 = await scoreApi.getLive365({ match_id: action.payload.matchId }).toPromise();
    const list = res365.data.data || [];
    if (list.length) {
      return createAction(`score/${scoreAction.UPDATE_LIVE_INFO_BY_ID}`, {
        data: [{
          playAddr: list.map(([matchId, playUrl, code, title, name]) => ({
            matchId,
            playUrl,
            code,
            title,
            name,
            protocolType: 'flv'
          }))
        }]
      });
    }

    const res = await scoreApi.getLiveInfoById(action.payload).toPromise();
    return createAction(`score/${scoreAction.UPDATE_LIVE_INFO_BY_ID}`, {
      data: res.data.data
    });
  })
);
/**
 * 根据赛事id查询直播信息
 * @param $action
 */
export const getLiveDetailsByRoom: Epic<PayloadIn, PayloadOut, any> = ($action) => $action.pipe(
  ofType(`score/${scoreAction.GET_LIVE_DETAILS_BY_ROOM}`),
  mergeMap((action) => scoreApi.getLiveDetailsByRoom(action.payload).pipe(
    map((res) => {
      try {
        if (res.data.code === HttpCode.SUCCESS) {
          return createAction(`score/${scoreAction.UPDATE_LIVE_DETAILS_BY_ROOM}`, {
            data: res.data.data
          });
        }
        return createAction('app');
      } catch (error) {
        return createAction('app');
      }
    })
  ))
);
