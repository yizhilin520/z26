import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import { useSetState, useTimeout, useRequest } from '@/utils/hooks';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Image from '@/components/Image';
import Iconfont from '@/components/Iconfont';
import RenderJudge from '@/components/RenderJudge';
import AnchorLevelDialog from '@/components/AnchorLevelDialog';
import { getCalcLevel } from '@/utils/common';
import UserDefaultImage from '@/assets/images/user_default_image.png';
import { useStores } from '../utils/store';
import { getAnchorLevelInfo } from '@/servers/live';

import styles from '../style/Anchor.scss';

const FollowTooltip = withStyles(() => ({
  popper: {
    zIndex: 10
  },
  tooltip: {
    margin: 0,
    padding: 0,
    maxWidth: 'none',
    background: 'none'
  }
}))(Tooltip);

// 显示关注弹框的时间毫秒
const SHOW_FOLLOW_VISIBLE_TIMER = 60000;

const Anchor = () => {
  const { data, state, methods } = useStores();
  const { anchor, title, heat } = data;
  const { user_img, nickname, room_id, uid: anchorUid } = anchor || {};
  const [followVisible, setFollowVisible] = useSetState({ visible: false, timer: false });
  const anchorLevelRef = useRef();

  useTimeout(() => setFollowVisible({ timer: true }), SHOW_FOLLOW_VISIBLE_TIMER);
  useTimeout(() => setFollowVisible({ timer: false }), SHOW_FOLLOW_VISIBLE_TIMER * 2);

  // 主播等级信息
  const { data: anchorLevelInfo = {}, mutate } = useRequest(
    (q) => getAnchorLevelInfo(q).toPromise(),
    { anchorUid }
  );

  const handleAnchorLevelDialog = (flag) => {
    if (flag) {
      anchorLevelRef.current.open();
      mutate();
    } else {
      anchorLevelRef.current.close();
    }
  };

  return (
    <div className={styles.container}>
      <Image className={styles.userImage} src={user_img} defaultImage={UserDefaultImage} />
      <div className={styles.userMeta}>
        <div className={styles.title}>{title}</div>
        <div className={styles.detail}>
          <div
            className={ClassNames(styles.anchorLevel, `anchorLabelLv${getCalcLevel(anchorLevelInfo.currentLevelId)}`)}
            onMouseEnter={() => handleAnchorLevelDialog(true)}
            onMouseLeave={() => handleAnchorLevelDialog(false)}
          >{anchorLevelInfo.currentLevelId}</div>
          <div className={styles.userName}>{nickname}</div>
          <div className={styles.roomLabel}>房间号：</div>
          <div className={styles.roomValue}>{room_id}</div>
          <Iconfont name="huo" className={styles.hotIcon} />
          <div className={styles.hotValue}>{heat}</div>
        </div>
      </div>
      <Link to={`/report/${data.room_id}`} target="_blank" className={styles.button}>举报</Link>
      <RenderJudge
        value={state.follow}
        active={(<div className={styles.button} onClick={methods.follow}>取消</div>)}
        inactive={(
          <FollowTooltip
            title={(
              <div className={styles.followDialog}>
                <div className={styles.followText}>喜欢我吗？喜欢我就点个关注吧！</div>
                <div className={styles.followButton} onClick={methods.follow}>关注</div>
              </div>
            )}
            placement="bottom"
            interactive
            open={followVisible.timer || followVisible.visible}
            onOpen={() => setFollowVisible({ visible: true })}
            onClose={() => setFollowVisible({ timer: false, visible: false })}
          >
            <div className={styles.button} onClick={methods.follow}>关注</div>
          </FollowTooltip>
        )}
      />

      <AnchorLevelDialog ref={anchorLevelRef} levelInfo={anchorLevelInfo} />
    </div>
  );
};

export default Anchor;
