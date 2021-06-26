import React from 'react';
import RenderJudge from '@/components/RenderJudge';

import style from '@/scss/live/style.scss';

export default function Text(props: any) {
  const { textLive } = props;
  const list = ([...textLive || []]).reverse();

  const images = [
    {
      label: '角球',
      key: 30,
      icon: 'jiao-qiu'
    },
    {
      label: '黄牌',
      icon: 'huang-pai'
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
      label: '乌龙球',
      key: 30,
      icon: 'wu-long'
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
    },
    {
      label: '上半场比赛开始',
      key: 1,
      icon: 'live02'
    },
    {
      label: '上半场结束',
      key: 1000,
      icon: 'live02'
    },
    {
      label: '下半场结束',
      key: 1001,
      icon: 'live02'
    }
  ];
  const getTextIcon = (t: any) => {
    if (!t[9]) return 'live01';
    const object: any = images.find((r) => r.key == t[9]);
    return object && object.icon;
  };
  const getColor = (t: any, index: any) => {
    if (index == 0) return 'red';
    if (t[9] == 9) return 'blue';
    return '';
  };
  return (
    <div className={style.commonContainer}>
      <div className={style.textContainer}>
        <div className={style.textContent}>
          <RenderJudge
            value={list.length}
            active={list.map((t: any, index: any) => (
              <div className={style.textCell} key={index}>
                <div className={style.left}>
                  <div className={style.bg}>
                    <i className={style[getTextIcon(t)]} />
                  </div>
                  <RenderJudge
                    value={index == list.length - 1}
                    inactive={(<div className={style.line} />)}
                  />
                </div>
                <div className={style.right}>
                  <span className={style.time}>
                    {t[8] ? `${t[8]}` : ''}
                  </span>
                  <span className={style[getColor(t, index)]}>{t[3]}</span>
                </div>
              </div>
            ))}
            inactive={(<div className={style.textnodata}><span className={style.textnodata2}>暂无文字直播</span></div>)}
          />
        </div>
      </div>
      <div className={style.explain}>
        <span className={style.title}>图例说明:</span>
        <div className={style.explainContent}>
          {images.map((i, index) => {
            if (i.key == 1 || i.key == 1000 || i.key === 1001 || i.key == 18) return '';
            return (
              <div className={style.images} key={index}>
                <i className={style[i.icon]} />
                <span className={style.text}>{i.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
