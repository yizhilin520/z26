import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';

import style from '@/scss/live/style.scss';
import { scoreAction } from '@/actions';
import { RootState } from '@/reducers';

const getClass = (prop: any) => {
  switch (prop) {
    case 1:
      return style.cellRow1;
    case 2:
      return style.cellRow2;
    case 3:
      return style.cellRow3;
    case 4:
      return style.cellRow4;
    case 5:
      return style.cellRow5;
    default:
      return style.cellRow6;
  }
};
const images = [
  {
    label: '角球',
    key: 30,
    icon: 'jiao-qiu'
  },
  {
    label: '黄牌',
    key: 18,
    icon: 'huang'
  },
  {
    label: '红牌',
    key: 22,
    icon: 'hong-pai'
  },
  {
    label: '进球',
    key: 9,
    icon: 'jin-qiu'
  },
  {
    label: '点球 ',
    key: 8,
    icon: 'dian-qiu'
  },
  {
    label: '点失',
    key: 138,
    icon: 'dian-shi'
  },
  {
    label: '两黄变红',
    key: 21,
    icon: 'hong-huang'
  },
  {
    label: '换人',
    key: 23,
    icon: 'replacement'
  }
];
const getIcon = (item: any, data: any, type: number) => {
  // const getAppRealtime = useSelector(
  //   (state: RootState) => state.score['getAppRealtime']
  // );
  const getAppRealtime: any = data;
  if (!getAppRealtime || getAppRealtime.length < 1) return '';
  const time = item[6];
  const object = data.find((d: any) => d[8] == time + "'");
  if (!object) return '';
  const play = object[9];
  const image = images.find(i => i.key == play);
  if (!image) return '';
  if (object[5] == type) {
    return image.icon;
  }
  return '';
};

const Line = (prop: any = {}) => {
  const { styleIndex, items, textLive } = prop;
  // 百分比
  const toPercent = (team: any, another: any) =>
    (Math.round(
      (Math.abs(team) / (Math.abs(team) + Math.abs(another))) * 10000
    ) / 100.0 || '10') + '%';

  return (
    <div className={`${style.cell} ${getClass(styleIndex)}`}>
      <div className={style.cellContent}>
        <div className={style.cellTop}>
          {items.map((item: any[], index: number) => {
            return (
              <span
                key={index}
                className={style.cellLine}
                style={{ height: `${toPercent(item[1], item[2])}` }}
              >
                <i
                  className={`${style.icon} ${style[getIcon(item, textLive, 1)]}`}
                ></i>
              </span>
            );
          })}
        </div>
        <div className={style.cellBottom}>
          <i></i>
          {items.map((item: any[], index: number) => {
            return (
              <span
                key={index}
                className={`${style.cellLine} ${style.cellYellow}`}
                style={{ height: `${toPercent(item[2], item[1])}` }}
              >
                <i
                  className={`${style.icon} ${style[getIcon(item, textLive, 2)]}`}
                ></i>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default function Outs(props: any = {}) {
  const { match_id } = props

  const dispatch = useDispatch();
  const eventStatistics = useSelector(
    (state: RootState) => state.score['eventStatistics']
  );
  const getMatchInfo = useSelector(
    (state: RootState) => state.score['getMatchInfo']
  );

  const chartInterval = useRef<any>();
  const [eventList, setEventList] = useState<any[]>([]);

  const updateChart = () => {
    dispatch({
      type: `score/${scoreAction.GET_EVENT_STATISTICS}`,
      payload: {match_id}
    });
  };

  useEffect(() => {
    dispatch({
      type: `score/${scoreAction.GET_MATCH_INFO}`,
      payload: {match_id}
    });

    updateChart()
    // 60秒更新一次
    chartInterval.current = setInterval(() => {
      eventStatistics.length < 90 && updateChart();
    }, 60000);
    return () => {
      clearInterval(chartInterval.current);
    };
  }, []);

  useEffect(() => {
    if (eventStatistics.length) {
      const num = Math.ceil(eventStatistics.length / 15);
      const arr = [];
      let i = 0;
      while (i < num) {
        arr.push(eventStatistics.slice(i * 15, (i + 1) * 15));
        ++i;
      }
      setEventList([...arr]);
    }
  }, [eventStatistics.length]);

  return (
    <div className={style.outsContainer}>
      <div className={style.outsLeft}>
        <div className={style.text}>
          <img src={getMatchInfo[32]} alt='' />
          <span>{getMatchInfo[2]}</span>
        </div>
        <div className={style.text}>
          <img src={getMatchInfo[33]} alt='' />
          <span>{getMatchInfo[3]}</span>
        </div>
      </div>
      <div className={style.outsRight}>
        {eventList.length &&
          eventList.map((items, index) => {
            return <Line  key={index} {...{...props, items:items, styleIndex: index + 1 }} />;
          })}
        <div className={style.tips}>
          <span>0'</span>
          <span>15'</span>
          <span>30'</span>
          <span>HT'</span>
          <span>60'</span>
          <span>70'</span>
          <span>90'</span>
        </div>
        <div className={`${style.bg} ${style.topbg}`}></div>
        <div className={`${style.bg} ${style.bottombg}`}></div>
        <div className={`${style.bg} ${style.bottombg} ${style.bgline}`}></div>
        <div className={`${style.bg} ${style.topbg}`}></div>
      </div>
    </div>
  );
}
