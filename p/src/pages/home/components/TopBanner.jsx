import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import { useRequest } from 'ahooks';
import RenderJudge from '@/components/RenderJudge';
import LivePlayer from '@/components/LivePlayer';
import Header from '@/components/Header';
import ZIndex from '@/components/zIndex';
import Image from '@/components/Image';
import { useScroll } from '@/utils/hooks';
import { getLiveList } from '@/servers/homeServer';
import DefaultImage from '@/assets/images/default_image.jpg';

import styles from '../style/TopBanner.scss';

const VISIBILITY_HEIGHT = 600;

const TopHeader = () => {
  const { top } = useScroll();

  const isVisible = top > VISIBILITY_HEIGHT;
  const theme = isVisible ? Header.theme.white : Header.theme.transparent;
  const animation = isVisible ? Header.animation.fadeInDown : Header.animation.none;
  const logo = isVisible ? Header.logo.blue : Header.logo.white;

  return (
    <Header
      isHome
      isFixed={isVisible}
      animation={animation}
      theme={theme}
      logo={logo}
    />
  );
};

const JoinRoomButton = ({ roomId, liveTypeId, loading }) => {
  const { status } = LivePlayer.useStores();

  if (status.destroy && !loading) return <LivePlayer.Recommend sportId={liveTypeId} roomId={roomId} />;

  return (
    <RenderJudge
      value={roomId && status.create}
      active={(
        <ZIndex
          tag={Link}
          to={`/live/room/${roomId}`}
          target="_blank"
          className={styles.joinBtn}
        >
          进入直播间
        </ZIndex>
      )}
    />
  );
};

const TopBanner = () => {
  const playerRef = useRef();
  const [selectIndex, setSelectIndex] = useState(0);
  const { data, loading } = useRequest(
    () => getLiveList({ page: 1, size: 6 }).toPromise(),
    {
      pollingInterval: 60000 * 2,
      pollingWhenHidden: false,
      refreshOnWindowFocus: true
    }
  );

  const list = useMemo(() => {
    const rows = data?.rows || [];
    // 永远显示六条
    return rows.concat(new Array(6 - rows.length).fill(0));
  }, [data]);

  const { playAddr, room_id, title, live_type_id } = list[selectIndex] || {};

  useEffect(() => {
    playerRef.current.create();
  }, [playAddr]);

  return (
    <div className={ClassNames(styles.container, 'module-container')}>
      <TopHeader />
      <div className={ClassNames(styles.wrap, 'module-section')}>
        <div className={styles.wrapInner}>
          <div className={styles.player}>
            <LivePlayer
              ref={playerRef}
              data={playAddr}
              ctrl={(
                <LivePlayer.Controller
                  left={(
                    <>
                      <LivePlayer.Controller.Play />
                      <LivePlayer.Controller.Pause />
                      <LivePlayer.Controller.Refresh />
                      <RenderJudge
                        value={title}
                        active={(<div className={styles.roomTitle}>{title}</div>)}
                      />
                    </>
                  )}
                  center={null}
                  right={(
                    <>
                      <LivePlayer.Controller.Quality />
                      <LivePlayer.Controller.Volume />
                      <LivePlayer.Controller.FullScreen />
                      <LivePlayer.Controller.ExitFullScreen />
                    </>
                  )}
                />
              )}
            >
              <JoinRoomButton roomId={room_id} liveTypeId={live_type_id} loading={loading} />
            </LivePlayer>
          </div>
          <div className={ClassNames(styles.slide, 'module-item')}>
            {list.map((row, index) => (
              <div
                className={ClassNames(styles.item, { [styles.isActive]: index === selectIndex })}
                key={index}
              >
                <RenderJudge
                  value={row}
                  active={(
                    <div className={styles.inner} onClick={() => setSelectIndex(index)}>
                      <Image
                        className={styles.image}
                        src={row.room_img || row.screenshot_url}
                        defaultImage={DefaultImage}
                        alt={row.title}
                      />
                      <div className={styles.title}>{row.title}</div>
                    </div>
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
