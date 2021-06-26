import React from 'react';
import RenderJudge from '@/components/RenderJudge';
import NotData from '@/components/NotData';
import VideoCard from '@/components/VideoCard';
import ListVideoCard from '@/components/ListVideoCard';

const LiveListVideoCard = ({ list, isNotData, prop, rows, marginLeft, marginTop }) => (
  <RenderJudge
    value={isNotData}
    active={<NotData style={{ paddingTop: '30px' }} />}
    inactive={(
      <div style={{ minHeight: '232px' }}>
        <ListVideoCard
          list={list}
          rows={rows}
          marginLeft={marginLeft}
          marginTop={marginTop}
          dataFormat={(row) => ({
            roomId: row[prop.roomId],
            label: row[prop.title],
            image: row[prop.roomImg] || row[prop.screenshotUrl],
            userImage: row[prop.headImage],
            nickName: row[prop.userName],
            heat: row[prop.heat],
            playing: row[prop.status] === 1,
            tag: VideoCard.tag[row[prop.liveTypeId]],
            type: row[prop.matchType],
            target: '_blank'
          })}
        />
      </div>
      )}
  />
);

LiveListVideoCard.defaultProps = {
  list: [],
  rows: 6,
  marginLeft: 16,
  marginTop: 16,
  prop: {
    title: 'title',
    liveTypeId: 'live_type_id',
    userName: 'nickname',
    roomId: 'room_id',
    matchId: 'match_id',
    status: 'status',
    headImage: 'head_image',
    roomImg: 'room_img',
    screenshotUrl: 'screenshot_url',
    matchType: '',
    heat: 'heat'
  }
};

export default LiveListVideoCard;
