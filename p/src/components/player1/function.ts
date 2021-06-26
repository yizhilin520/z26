import DPlayer from 'dplayer'
import Flvjs from "flv.js"

// 清除默认样式
export const clearPleyerStyle = (dp:any , pleyerEl:any) => {
  if (dp && pleyerEl) {
    pleyerEl.current.querySelector('.dplayer-mask').remove();
    pleyerEl.current.querySelector('.dplayer-controller-mask').remove();
    pleyerEl.current.querySelector('.dplayer-bezel').remove();
    pleyerEl.current.querySelector('.dplayer-controller').remove();
    pleyerEl.current.querySelector('.dplayer-notice').remove();
    // if (controlEl.current) {
    //   pleyerEl.current.appendChild(controlEl.current);
    // }
    // 删除右键
    pleyerEl.current.querySelector('.dplayer-menu').remove();
  }
}


// 构建播放器
export const newDPlayer = () => {
  return new DPlayer({
    container: document.getElementById('dplayer'),
    live: true,
    video: {
      url: 'demo.mp4',
    },
  })
}