import React from "react";
import ClassNames from "classnames";
import RenderJudge from "@/components/RenderJudge";
import PlayBackCard from "./components/PlayBackCard";
import NotData from "@/components/NotData";
import styles from "./style.scss";

const list = [
  {
    room_id: "102806",
    title: "频道2 VS 频道2",
    uid: "1341335487075319809",
    room_img: null,
    screenshot_url:
      "http://screenshot-1304984455.cos.ap-beijing.myqcloud.com/2021-03-13/stream20000722-screenshot-11-38-42-1280x720.jpg",
    heat: 183,
    nickname: "伯霸刀584",
    head_image:
      "http://www.doudong999.top/cloud-east-ulive/IMAGES/app-user/headimg/user09@3x.png?version=3",
    status: 2,
    match_id: null,
    live_type_id: 2,
    aid: "4436679356318720",
    lastOffLineTime: null,
  },
  {
    room_id: "102805",
    title: "频道1 VS 频道1",
    uid: "1341335486517477377",
    room_img: null,
    screenshot_url:
      "http://screenshot-1304984455.cos.ap-beijing.myqcloud.com/2021-03-13/stream20000702-screenshot-11-39-05-1280x720.jpg",
    heat: 147,
    nickname: "邹金鑫451",
    head_image:
      "http://www.doudong999.top/cloud-east-ulive/IMAGES/app-user/headimg/user09@3x.png?version=3",
    status: 2,
    match_id: null,

    live_type_id: 2,
    aid: "4436537807832064",
    lastOffLineTime: null,
  },
  {
    room_id: "103326",
    title: "佛罗里达州立大学塞米诺尔人队 VS 北卡罗来纳柏油脚跟篮球队",
    uid: "1341335485678616577",
    room_img: null,
    screenshot_url:
      "http://screenshot-1304984455.cos.ap-beijing.myqcloud.com/2021-03-13/streamhd258622-screenshot-11-37-31-1280x720.jpg",
    heat: 134,
    nickname: "璩子轩251",
    head_image:
      "http://www.doudong999.top/cloud-east-ulive/IMAGES/app-user/headimg/user09@3x.png?version=3",
    status: 2,
    match_id: null,
    live_type_id: 2,
    aid: "4436717132579840",
    lastOffLineTime: null,
  },
];

const LivePlayBack = ({ style, title, showIcon, isHot }) => {
  // console.log(title)
  const childStyle = {
    width: showIcon && "100%",
    right: showIcon && "30%",
  };
  return (
    <div className={styles.container} style={style}>
      <div
        className={styles.title}
        style={{ display: isHot ? "block" : "none" }}
      >
        {isHot ? '直播回放' : ''}
      </div>
      <div className={styles.cardsWrap} style={{ width: childStyle.width }}>
        <RenderJudge
          value={list.length}
          active={
            <PlayBackCard list={list} showIcon={showIcon} isHot={isHot} right={childStyle.right} />
          }
          inactive={<RenderJudge value={false} active={<NotData />} />}
        />
      </div>
    </div>
  );
};

export default LivePlayBack;
