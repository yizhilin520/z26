import history from '@/utils/history';
import React, { useState, useEffect } from 'react';
import style from './style.scss';

import PlayIcon from './images/play_icon.png'

// 精彩推荐
export default function LiveCard(props: any) {
  const {
    room_id,
    match_id,
    room_img,
    head_image,
    live_type_id,
    screenshot_url,
    title,
    nickname,
    heat,
    status,
    isMiddle = false
  } = props;
  var windowObjectReference: any = null; // global variable
  const handle = () => {
    // strUrl === 要在新打开的窗口中加载的URL。
    // strWindowName === 新窗口的名称。
    // strWindowFeatures === 一个可选参数，列出新窗口的特征(大小，位置，滚动条等)作为一个DOMString。
    // console.log('props-->', props);
    // if (windowObjectReference == null || windowObjectReference.closed) {
    //   windowObjectReference = window.open(
    //     `/room?room_id=${room_id}&match_id=${match_id}`,
    //     // `${nickname}直播间_${title}`,
    //     // "resizable,scrollbars,status"
    //   )
    //   windowObjectReference.document.title = `${nickname}直播间_${title}`
    //   console.log('windowObjectReference', windowObjectReference.document);

    // } else {
    //   windowObjectReference.focus();
    // }

    // const w:any = window.open('about:blank');
    // w.document.title = `${nickname}直播间_${title}`
    // w.location.href = `/room?room_id=${room_id}&match_id=${match_id}`
    // console.log('props-->wwww', w);
    history.push(`/live/room/${room_id}`);
  };
  return (
    <li onClick={handle} className={style.lis}>
      <div
        className={`${style.images} ${status == 0 ? style.black : ''}`}
        style={(room_img || screenshot_url)?{ background: `url(${room_img || screenshot_url})` }:{}}
      >
        <img
          className={style.play}
          src={PlayIcon}
        />
        <div className={style.steam}>
          <img
            src='/static/images/home/steam.gif'
            className={style.steamplay}
          />
          <span className={style.steamtext}>LIVE</span>
        </div>
      </div>
      {isMiddle ? (
        <div className={style.qiugame}>
          <div className={style.qiugametitle}>
            <span>中甲</span>
          </div>
          <p className={style.ouzhoubei}>{title}</p>
        </div>
      ) : (
          <p className={style.ouzhoubei}>{title}</p>
        )}
      <div className={style.people}>
        <div className={style.name}>
          <img src={head_image} className={style.headImage} />
          {/* <span className={style.touxiang}></span> */}
          <span>{nickname}</span>
        </div>
        <div className={style.nubmer}>
          <span className={style.hotimg}></span>
          {heat}
          <span className={style.fb}>
            {live_type_id == 1 ? '足球' : '篮球'}
          </span>
        </div>
      </div>
    </li>
  );
}
