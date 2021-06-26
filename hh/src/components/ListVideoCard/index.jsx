import React from 'react';
import ClassNames from 'classnames';
import VideoCard from '@/components/VideoCard';
import { viewSizeFormat } from '@/common/format';

import styles from './style.scss';

const ListVideoCard = ({ className, style, list, rows, marginLeft, marginTop, dataFormat }) => {
  if (!list.length) return null;
  const leftVal = viewSizeFormat(marginLeft);
  const topVal = viewSizeFormat(marginTop);
  return (
    <div className={ClassNames(styles.container, className)} style={{ ...style || {}, marginLeft: `-${leftVal}px` }}>
      {list.map((row, index) => {
        const { roomId, label, image, nickName, heat, target, children } = dataFormat(row) || {};
        return (
          <div
            className={styles.item}
            style={{
              width: `${100 / rows}%`,
              paddingTop: `${topVal}px`,
              paddingLeft: `${leftVal}px`
            }}
            key={index}
          >
            <VideoCard
              heat={heat}
              target={target}
              image={image}
              label={label}
              url={`/live/room/${roomId}`}
              userName={nickName}
            >
              {children}
            </VideoCard>
          </div>
        );
      })}
    </div>
  );
};

ListVideoCard.defaultProps = {
  list: [],
  rows: 2,
  marginLeft: 20,
  marginTop: 20,
  dataFormat: ({ room_id: roomId, title, room_img: roomImg, screenshot_url: screenshotUrl, nickname, heat }) => ({
    roomId,
    label: title,
    image: roomImg || screenshotUrl,
    nickName: nickname,
    heat
  })
};

export default ListVideoCard;
