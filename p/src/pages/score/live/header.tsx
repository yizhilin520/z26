import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/reducers';
import { scoreAction } from '@/actions';
import RenderJudge from '@/components/RenderJudge';
import style from '@/scss/live/style.scss';

export default function Header(props: any) {
  const { match_id } = props
  const dispatch = useDispatch();
  const matchDetailsList = useSelector(
    (state: RootState) => state.score['matchDetailsList']
  )
  const { zhishu } = useSelector(({ config }) => config.globalSwitch);
  const chartInterval = useRef<any>();

  const updateChart = () => {
    dispatch({
      type: `score/${scoreAction.GET_MATCH_DETAILS}`,
      payload: { match_id }
    });
  };

  useEffect(() => {
    updateChart()
    // 60秒更新一次
    chartInterval.current = setInterval(() => {
      updateChart();
    }, 1000 * 60);
    return () => {
      clearInterval(chartInterval.current);
    };
  }, []);
  return (
    <RenderJudge
      value={zhishu}
      active={(
        <div className={style.header}>
          <div className={style.table}>
            <div className={style.tableHeader}>
              <ul className={style.listtop}>
                <li className={`${style.cell} ${style.cell1}`}></li>
                <li className={`${style.cell} ${style.cell2}`}>胜负</li>
                <li className={`${style.cell} ${style.cell3}`}>让球</li>
                <li className={`${style.cell} ${style.cell4}`}>进球数</li>
                <li className={`${style.cell} ${style.cell5}`}>角球</li>
              </ul>
            </div>
            <div className={style.ranlist}>
              <ul className={style.ulgame}>
                <Ligames type={1} item={matchDetailsList} />
                <Ligames type={2} item={matchDetailsList} />
              </ul>
            </div>
          </div>
        </div>
      )}
    />
  );
}
const Ligames = (props: any) => {
  let normal, rq, dx;
  if (props?.item[0]?.length && props.item[0]) {
    normal = props.item[0][3];
    rq = props.item[0][2];
    dx = props.item[0][4];
  } else {
    return <></>
  }
  return (
    <li className={style.ligame}>
      {/* 全部公司 */}
      <div className={`${style.lic} ${style.licbordr}`}>{props.type == 1 ? '赛中' : '赛前'}</div>
      <div className={style.lic}>{props.type == 1 ? normal[4] : normal[1]}</div>
      <div className={style.lic}>{props.type == 1 ? normal[5] : normal[2]}</div>
      <div className={`${style.lic} ${style.licbordr}`}>{props.type == 1 ? normal[6] : normal[3]}</div>

      <div className={style.lic}>{props.type == 1 ? rq[4] : rq[1]}</div>
      <div className={style.lic}>{props.type == 1 ? rq[5] : rq[2]}</div>
      <div className={`${style.lic} ${style.licbordr}`}>{props.type == 1 ? rq[6] : rq[3]}</div>

      <div className={style.lic}>{props.type == 1 ? dx[4] : dx[1]}</div>
      <div className={style.lic}>{props.type == 1 ? dx[5] : dx[2]}</div>
      <div className={`${style.lic} ${style.licbordr}`}>{props.type == 1 ? dx[6] : dx[3]}</div>

      <div className={style.lic}>0</div>
      <div className={style.lic}>小球</div>
    </li>
  );
};
