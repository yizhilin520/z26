import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/reducers';
import { getPlayStatus, time } from '@/utils/regular';
import { scoreDataFormat } from '@/utils/common';
import { usePersistFn, useSafeState } from '@/utils/hooks';
import RenderJudge from '@/components/RenderJudge';
import WebsocketPush from '@/components/WebsocketPush';
import feixi from './title.scss';

const Title = () => {
  const data = useSelector((state: RootState) => scoreDataFormat(state.score.getMatchInfo || []));
  const [pushData, setPushData] = useSafeState({});

  const scoreHandle = usePersistFn((d) => {
    // [赛事ID,主队全场得分,客队全场得分]
    const [
      eventId,
      homeTeamCurrentScore,
      awayTeamCurrentScore
    ] = d;
    const newVal = {
      ...data,
      ...pushData,
      score: {
        homeTeamCurrentScore,
        awayTeamCurrentScore
      }
    }
    setPushData(newVal);
  });

  const statusHandle = usePersistFn((d) => {
    // [赛事ID,赛事大状态,赛事小状态]
    const [
      eventId,
      bigState,
      smallState
    ] = d;
    const newVal = {
      ...data,
      ...pushData,
      bigState,
      smallState
    }
    setPushData(newVal);
  });
  const computedData = useMemo(() => {
    const obj = {
      ...data,
      ...pushData
    }
    return obj;
  }, [data, pushData]);
  const scoreObj = computedData.score || {};
  const onWebsocketMessageHandle = usePersistFn((res) => {
    const { type, data: msgData } = res;
    if (type === 'score') return scoreHandle(msgData);
    if (type === 'status') return statusHandle(msgData);
  });

  return (
    <div className={feixi.topbj}>
      <RenderJudge
        value={computedData.eventType && computedData.eventId}
        active={(
          <WebsocketPush path={`/bf/detail/${computedData.eventType}/${computedData.eventId}`} on={{ message: onWebsocketMessageHandle }} />
        )}
      />
      <div className={feixi.titlewarp}>
        <div className={feixi.lefttit}>
          <div className={feixi.leftimg}>
            <img
              src={computedData.homeTeamLogo}
              className={feixi.imgL1}
            />
          </div>
          <div className={feixi.lefttext}>
            {computedData.homeTeamName}
            <span className={feixi.zoo}>
              {scoreObj.homeTeamCurrentScore}
            </span>
          </div>
        </div>
        <div className={feixi.leftcent}>
          <p>{getPlayStatus(computedData.bigState)}</p>
          <p className={feixi.dateing}>
            <span className={feixi.textbxj}>{computedData.leagueName}</span>
            {computedData.startTime ? time(computedData.startTime) : ''}
          </p>
          <p className={feixi.banchan}>
            {getPlayStatus(computedData.smallState)}
            ：
            <span>
              {scoreObj.homeTeamCurrentScore}
              -
              {scoreObj.awayTeamCurrentScore}
            </span>
          </p>
        </div>
        <div className={feixi.lefttit}>
          <div className={feixi.lefttext}>
            <span className={feixi.zoo2}>
              {scoreObj.awayTeamCurrentScore}
            </span>
            {computedData.awayTeamName}
          </div>
          <div className={feixi.rightimg}>
            <img
              src={computedData.awayTeamLogo}
              className={feixi.imgR1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Title;
