import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRequest, useSafeState, useUnmountedRef } from "@/utils/hooks";
import { GET_APP_REALTIME } from "@/actions/scoreAtion";
import { GET_ROOM_DETAIL } from "@/actions/homeAtion";
import RenderJudge from "@/components/RenderJudge";
import Header from "@/components/Header";
import Title from "@/components/biFeiTitle";
import Charts from "@/components/chats";
import Outs from "@/pages/score/live/outs";
import LiveTabs from "@/pages/score/live";
import LivePlayBack from "@/components/LivePlayBack";
import LivePlayBackVideo from "@/components/LivePlayBackVideo";

import styles from "./style/index.scss";

const LiveRoomPage = ({
  match: {
    params: { id: roomId },
  },
}) => {
  const unmountedRef = useUnmountedRef();
  const dispatch = useDispatch();
  const [roomData, setRoomData] = useSafeState();
  const appRealtime = useSelector(({ score }) => score.getAppRealtime || []);

  // 直播技术统计
  const getAppRealTimeHandle = (id) => {
    let timer = null;
    const handle = () => {
      if (id)
        dispatch({
          type: `score/${GET_APP_REALTIME}`,
          payload: { match_id: id },
        });

      clearTimeout(timer);
      if (!unmountedRef.current) timer = setTimeout(handle, 60000);
    };
    handle();
  };
  // 获取直播详情
  const { loading, mutate } = useRequest(
    (q) =>
      dispatch({
        type: `home/${GET_ROOM_DETAIL}`,
        payload: q,
        callback: ({ data } = {}) => {
          const rData = data || {};
          getAppRealTimeHandle(rData.match_id);
          setRoomData(rData);
        },
      }),
    { roomId, protocolType: "flv" }
  );

  useEffect(() => {
    if (!loading) mutate({ roomId, protocolType: "flv" });
  }, [roomId]);

  if (loading || !roomData) return null;
  console.log(roomData);
  return (
    <>
      <Header isLive />
      <main className={styles.container}>
        <RenderJudge value={roomData.match_id} active={<Title />} />
        <div className={styles.wrapper}>
          <RenderJudge
            value={roomData.match_id}
            active={<Outs {...roomData} textLive={appRealtime[2]} />}
          />
          <RenderJudge
            value={roomData.match_id}
            active={<LiveTabs {...roomData} textLive={appRealtime[2]} />}
          />
          <LivePlayBackVideo {...roomData} />
          <RenderJudge value={!roomData.match_id} active={<LivePlayBack showIcon={false} isHot={true}/>}/>
        </div>
      </main>
    </>
  );
};

export default LiveRoomPage;
