import React from "react";
import style from "./style.scss";
// 判断后端返回数据是否是空, 0主播已经下播  1正在直播 2主播封禁 3有数据但是无法播放,
export default function LivePlayType(props: any) {
  // debugger

  const { livePlayType } = props;
  const activeComponent = (type: number) => {
    switch (type) {
      case 0:
        return <AnchorDownload />;
      case 1:
        return <></>;
      case 2:
        return <AnchorDownload />;
      case 3:
        return <NoLiveData />;
      default:
        return <NoLiveData />;
    }
  };
  return activeComponent(livePlayType);
}

const NoLiveData = () => (
  <div className={style.noliveDate}>
    {/* <p>暂无数据</p> */}
  </div>
);

const AnchorDownload = () => (
  <div className={style.anchorDownload}>{/* <p>主播已经下播</p> */}</div>
);
