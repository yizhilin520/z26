import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ClassNames from 'classnames';
import RenderJudge from '@/components/RenderJudge';
import Iconfont from '@/components/Iconfont';
import Provider from './components/Provider';
import Message from './components/Message';
import Download from './components/Download';

import styles from './style/style.scss';

const RoomLayout = ({ player, tabs, defaultTabIndex, follow, showBack, onFollow, onBack }) => {
  const history = useHistory();
  const [tabIndex, setTabIndex] = useState(defaultTabIndex);

  // 后退
  const onBackHandle = () => (typeof onBack === 'function' ? onBack() : history.goBack());

  // tab点击
  const onTabChangeHandle = (v) => {
    if (v === tabIndex) return;

    return setTabIndex(v);
  };

  const { component } = tabs[tabIndex] || {};

  return (
    <div className={styles.container}>
      <div className={styles.player}>
        <div className={styles.playerInner}>
          {player}
        </div>
        <RenderJudge
          value={showBack}
          active={(
            <Iconfont className={styles.back} tag="div" name="bp_ee" onClick={onBackHandle} />
          )}
        />
      </div>
      <div className={ClassNames(styles.tabs, { [styles.isShowFollow]: onFollow })}>
        {tabs.map((row, index) => (
          <div
            className={ClassNames(styles.tabItem, { [styles.isActive]: index === tabIndex })}
            onClick={() => onTabChangeHandle(index)}
            key={index}
          >
            {row.label}
          </div>
        ))}
        <RenderJudge
          value={onFollow}
          active={(
            <div className={styles.follow} onClick={onFollow}>
              <div className={styles.followLabel}>+ 关注</div>
              <div className={styles.followValue}>{follow}</div>
            </div>
          )}
        />
      </div>
      <div className={styles.wrapper}>
        {component}
      </div>
    </div>
  );
};

RoomLayout.defaultProps = {
  tabs: [],
  showBack: true,
  defaultTabIndex: 0
};

RoomLayout.Provider = Provider;
RoomLayout.Message = Message;
RoomLayout.Download = Download;

export default RoomLayout;
