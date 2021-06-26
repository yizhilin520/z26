import React from 'react';
import ClassNames from 'classnames';
import VideoCard from '@/components/VideoCard';

import styles from './style.scss';

const ListVideoCard = ({ className, style, list, rows, marginLeft, marginTop, dataFormat }) => (
  <div className={ClassNames(styles.container, className)} style={{ ...style || {}, marginLeft: `-${marginLeft}px` }}>
    {list.map((row, index) => {
      const {
        roomId,
        label,
        image,
        userImage,
        nickName,
        heat,
        playing,
        tag,
        type,
        target,
        children
      } = dataFormat(row) || {};

      return (
        <div
          className={styles.item}
          style={{
            width: `${100 / rows}%`,
            paddingTop: `${marginTop}px`,
            paddingLeft: `${marginLeft}px`
          }}
          key={index}
        >
          <VideoCard
            target={target}
            url={`/live/room/${roomId}`}
            label={label}
            image={image}
            headImage={userImage}
            userName={nickName}
            heat={heat}
            playing={playing}
            tag={tag}
            type={type}
          >
            {children}
          </VideoCard>
        </div>
      );
    })}
  </div>
);

ListVideoCard.defaultProps = {
  list: [],
  rows: 5,
  marginLeft: 20,
  marginTop: 20,
  dataFormat: ({ room_id, title, room_img, screenshot_url, head_image, nickname, heat, status, live_type_id }) => ({
    roomId: room_id,
    label: title,
    image: room_img || screenshot_url,
    userImage: head_image,
    nickName: nickname,
    heat,
    playing: status === 1,
    tag: VideoCard.tag[live_type_id]
  })
};

export default ListVideoCard;
