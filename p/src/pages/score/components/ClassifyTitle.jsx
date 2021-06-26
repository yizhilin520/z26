import React from 'react';
import RenderJudge from '@/components/RenderJudge';
import InProgressIcon from '../images/in_progress_icon.png';
import NotStartedGameIcon from '../images/not_started_game_icon.png';
import FinishedGameIcon from '../images/finished_game_icon.png';
import UnusualGameIcon from '../images/unusual_game_icon.png';

import styles from '../style/ClassifyTitle.scss';

const ClassifyTitle = ({ status, label: propLabel, style: componentStyle }) => {
  const obj = {
    2: {
      label: '进行中的比赛',
      image: InProgressIcon
    },
    1: {
      label: '未开始的比赛',
      image: NotStartedGameIcon
    },
    3: {
      label: '已完场的比赛',
      image: FinishedGameIcon
    },
    4: {
      label: '异常的比赛',
      image: UnusualGameIcon
    }
  };

  const { label, image } = obj[status] || { label: propLabel };
  if (!label && !image) return null;

  return (
    <div className={styles.container} style={componentStyle}>
      <RenderJudge
        value={image}
        active={<img src={image} className={styles.image} />}
      />
      <span className={styles.name}>{label}</span>
    </div>
  );
};

export default ClassifyTitle;
