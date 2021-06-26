import React, { useState } from 'react';
import style from '@/scss/live/style.scss';
import { homeAction } from '@/actions';
import { RootState } from '@/reducers';
import { useDispatch, useSelector } from 'react-redux';
import RenderJudge from '@/components/RenderJudge';
import Iconfont from '@/components/Iconfont';
import Match from './match';
import Text from './text';
import Recommend from './Recommend';
import ExpertPlanList from '@/pages/forecast/components/ExpertPlanList';
import { useRequest } from '@/utils/hooks';
import { getLiveList } from '@/servers/homeServer';
import { getAnchorOnSalePlan } from '@/servers/userServer';
import DownloadQrCode from '@/assets/images/download_qrcode.jpg';

export default function LiveTabs(props: any) {
  const dispatch = useDispatch();
  const { expert } = useSelector(({ config }) => config.globalSwitch);
  const [currIndex, setCurrIndex] = useState(0);
  const tabnav = [
    { tabName: '文字直播', id: 0, path: 'text' },
    { tabName: '比赛阵容', id: 1, path: 'match' },
    expert && { tabName: '主播预测', id: 2, path: 'forecast' },
    { tabName: '直播推荐', id: 3, path: 'recommend' }
  ].filter(Boolean);
  const tabChoiced = (arr: { tabName?: string; id: any; path: any }) => {
    setCurrIndex(arr.id);
  };

  const {data=[]} =useRequest(
    q=>getLiveList(q).toPromise(),
    {
      dataType: 0,
      page: 1,
      size: 10,
      liveTypeId:props.liveTypeId||1
    },
    d=>(d||{}).rows||[]
  )

  const {data: forecastList = []} = useRequest(
    q=>q.anchorUserId&&getAnchorOnSalePlan(q).toPromise(),
    { anchorUserId: props.anchorUid }
  )

  const tab = (index: any) => {
    if (index === 0) return <Text {...props} />;
    if (index === 1) return <Match {...props} />;
    if (index === 2) return (
      <RenderJudge
        value={forecastList.length}
        active={(<ExpertPlanList
          list={forecastList}
          className={style.forecast}
          target="_blank"
          getLinkUrl={({ sportId, expertId, planId }) => {
            const baseUrl = `/forecast/detail/${sportId}/${expertId}/${planId}`
            if(props.roomId)return `${baseUrl}?roomId=${props.roomId}&anchorId=${props.anchorAid}`;
            return baseUrl
          }}
        />)}
        inactive={(
          <ul className={style.contnul}>
            <div className={style.textnodata}>
              <span className={style.textnodata2}>暂无内容</span>
            </div>
          </ul>
        )}
      />
    );
    if (index === 3) {
      return (
        <RenderJudge
          value={data.length}
          active={(<Recommend list={data} />)}
          inactive={(
            <ul className={style.contnul}>
              <div className={style.textnodata}>
                <span className={style.textnodata2}>暂无内容</span>
              </div>
            </ul>
          )}
        />
      );
    }
    // if (index == 2)
    //   return (
    //     <ul className={style.contnul}>
    //       {
    //         footBallLive.length
    //           ? footBallLive.map((item: any, index: number) => {
    //               return <LiveCard {...item} key={index} />;
    //             })
    //           :
    //           <div className={style.textnodata}><span className={style.textnodata2}>暂无内容</span></div>
    //         }
    //     </ul>
    //   );
  };
  return (
    <div className={style.appContainer}>
      <div className={style.container}>
        <div className={style.tabs}>
          <ul className={style.nav}>
            {tabnav.map((item, index) => (
              <li
                className={`${style.navsli} ${
                  item.id === currIndex ? style.active : ''
                }`}
                key={index}
                onClick={() => {
                  tabChoiced(item);
                }}
              >
                <span className={style.text}>{item.tabName}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={style.content}>
          {/* 切换块 */}
          <div className={style.wrapper}>
            {/* <Route
              component={lazy(
                () =>
                  import(
                  `@/pages/score/live/${path}`
                  )
              )}
            /> */}
            {tab(currIndex)}
          </div>
        </div>
      </div>
      <div className={style.download}>
        <div className={style.title}>下载U球APP</div>
        <div className={style.downloadWrapper}>
          <div className={style.downloadText}>
            <div className={style.textItem}>
              <Iconfont name="ios-circle" className={style.textIcon} />
              <div className={style.textBlock}>iphone版</div>
            </div>
            <div className={style.textItem}>
              <Iconfont name="android-circle" className={style.textIcon} />
              <div className={style.textBlock}>Android版</div>
            </div>
          </div>
          <div className={style.downloadImage}>
            <img src={DownloadQrCode} className={style.imageBlock} />
          </div>
        </div>
      </div>
    </div>
  );
}
