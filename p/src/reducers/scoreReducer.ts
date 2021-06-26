import { scoreAction } from '@/actions';
import { Action } from '@/types';
export interface ScoreStore {
  tournamentPreview: any[];
  reuseTournamentPreview: any[]
  matchsList: any[];
  matchsListFilter: any[];
  exponentTrendList: any[];
  headnavIndex: number;
  matchDetailsList: any[];
  getMatchInfo: any[];
  exponentTrendInfoList: any;
  getAppRealtime: any[];
  eventStatistics: any[];
  getLiveInfoById: any[];
  getLiveDetailsByRoom:any[];
}

const initStore: ScoreStore = {
  tournamentPreview: [], // 赛事预告
  reuseTournamentPreview: [], // header顶部赛事预告
  matchsList: [], // 获取赛事
  exponentTrendList: [], // 指数走势2s
  headnavIndex: 1,
  matchDetailsList: [],
  getMatchInfo: [],
  exponentTrendInfoList: [],
  getAppRealtime: [], 
  eventStatistics: [], // 事件统计
  matchsListFilter:[],
  getLiveInfoById:[],
  getLiveDetailsByRoom:[]
};

// 图形验证码
export default function scoreReducer(
  state: ScoreStore = initStore,
  action: Action
): ScoreStore {
  const data = state;
  try {
    switch (action.type) {

      case `score/${scoreAction.UPDATE_TOURNAMENT_PREVIEW}`: {
        return Object.assign(data, {
          ...data,
          tournamentPreview: action.payload.data
        });
      }
      case `score/${scoreAction.REUSE_UPDATE_TOURNAMENT_PREVIEW}`: {
        return Object.assign(data, {
          ...data,
          reuseTournamentPreview: action.payload.data.splice(22)
        });
      }
      case `score/${scoreAction.UPDATE_LIVE_INFO_BY_ID}`: {
        return Object.assign(data, {
          ...data,
          getLiveInfoById: action.payload.data
        });
      }
      case `score/${scoreAction.UPDATE_LIVE_DETAILS_BY_ROOM}`: {
        return Object.assign(data, {
          ...data,
          getLiveDetailsByRoom: action.payload.data
        });
      }
      case `score/${scoreAction.UPDATE_MATCH}`: {
        return Object.assign(data, {
          ...data,
          matchsList: action.payload.data
        });
      }
      case `score/${scoreAction.UPDATE_MATCH_FILTER}`: {
        return Object.assign(data, {
          ...data,
          matchsListFilter: action.payload.data
        });
      }
      case `score/${scoreAction.UPDATE_EXPONENT_TREND}`: {
        return Object.assign(data, {
          ...data,
          exponentTrendList: action.payload.data
        });
      }
      case `score/${scoreAction.UPDATE_MATCH_DETAILS}`: {
        return Object.assign(data, {
          ...data,
          matchDetailsList: action.payload.data
        });
      }
      case `score/${scoreAction.UPDATE_MATCH_INFO}`: {
        return Object.assign(data, {
          ...data,
          getMatchInfo: action.payload.data
        });
      }
      case `score/${scoreAction.UPDATE_APP_REALTIME}`: {
        return Object.assign(data, {
          ...data,
          getAppRealtime: action.payload.data
        });
      }
      case `score/${scoreAction.UPDATE_EVENT_STATISTICS}`: {
        return Object.assign(data, {
          ...data,
          eventStatistics: action.payload.data
        });
      }
      default: {
        return state;
      }
    }
  } catch (error) {
    return state;
  }
}
