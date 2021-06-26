import React, { useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useRequest } from 'ahooks';
import { getRoomDetail } from '@/services/live';
import RoomLayout from '@/components/RoomLayout';
import Loading from '@/components/Loading';
import DownloadDialog from '@/components/DownloadDialog';
import Toast from '@/components/Toast';
import LivePlayer from '@/components/LivePlayer';
import { usePageViewDataReport } from '@/common/hooks';

const RoomMain = ({ data }) => {
  const {
    anchor,
    status,
    live_type_id: liveTypeId,
    live_type_name: liveTypeName,
    room_id: roomId,
    fansNum,
    playAddr,
    playAddr2
  } = data;
  const dialogRef = useRef();
  const playerRef = useRef();

  const playAddrList = useMemo(() => {
    if (playAddr2 && playAddr2.length) return playAddr2;
    if (playAddr && playAddr.length) return playAddr;
    return [];
  }, [playAddr2, playAddr]);

  // 打开下载弹框
  const onOpenDownloadDialogHandle = () => dialogRef.current.open();

  useEffect(() => {
    playerRef.current.create();
  }, [playAddrList]);

  let title = `直播间${roomId}_${liveTypeName || ''}直播${data.title}-U球直播`;
  const keywords = `${anchor.nickname},${anchor.nickname}直播,${liveTypeName || ''}直播,${anchor.nickname}${liveTypeName || ''}精彩视频`;
  let description = `欢迎来到u球“${roomId}”“${liveTypeName || ''}”直播间,本直播间提供最精彩的“${anchor.nickname}”“${liveTypeName || ''}”直播,“${anchor.nickname}”带你领略最有趣的“${liveTypeName || ''}”视频直播。`;
  if (anchor.nickname) {
    title = `${anchor.nickname}的直播间${roomId}_${liveTypeName || ''}直播${data.title}-U球直播`;
    description = `欢迎来到主播“${anchor.nickname}”的u球“${roomId}”“${liveTypeName || ''}”直播间,本直播间提供最精彩的“${anchor.nickname}”“${liveTypeName || ''}”直播,“${anchor.nickname}”带你领略最有趣的“${liveTypeName || ''}”视频直播。`;
  }

  usePageViewDataReport('h5_11', { params: { event_value: '直播间', page_title: title } });

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="keywords" content={keywords} />
        <meta name="description" content={description} />
      </Helmet>
      <RoomLayout.Provider chatId={roomId}>
        {({ messages }) => {
          return (
            <RoomLayout
              player={(
                <LivePlayer data={playAddrList} ref={playerRef}>
                  <LivePlayer.StatusRecommend sportId={liveTypeId} status={status} roomId={roomId} />
                </LivePlayer>
              )}
              tabs={[{
                label: '聊天',
                component: (<RoomLayout.Message
                  list={messages}
                  anchor={anchor}
                  onMessage={onOpenDownloadDialogHandle}
                  onGift={onOpenDownloadDialogHandle}
                />)
              }, {
                label: '主播',
                component: ((<RoomLayout.Download />))
              }, {
                label: '贡献榜',
                component: ((<RoomLayout.Download />))
              }, {
                label: '推荐',
                component: ((<RoomLayout.Download />))
              }]}
              follow={fansNum}
              onFollow={onOpenDownloadDialogHandle}
            />
          );
        }}
      </RoomLayout.Provider>
      <DownloadDialog ref={dialogRef} />
    </>
  );
};

const LiveRoomPage = ({
  match: {
    params: {
      id
    }
  },
  history
}) => {
  const { data, loading } = useRequest(
    () => getRoomDetail({ roomId: id, protocolType: 'flv' }),
    {
      defaultLoading: true,
      refreshDeps: [id]
    }
  );

  const onToastCloseHandle = () => history.replace('/');

  if (loading) return (<Loading />);
  if (!data) return (<Toast visible text="直播间不存在" duration={2000} onClose={onToastCloseHandle} />);
  return (<RoomMain data={data} />);
};
export default LiveRoomPage;
