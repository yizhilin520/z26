import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import { useRequest } from 'ahooks';
import { HttpCode } from '@/enums';
import { getMyFansList, getUserCareList } from '@/servers/userServer';
import RenderJudge from '@/components/RenderJudge';
import NotData from '@/components/NotData';
import VideoCard from '@/components/VideoCard';
import ListVideoCard from '@/components/ListVideoCard';
import Image from '@/components/Image';
import UserDefaultImage from '@/assets/images/user_default_image.png';
import PlayingIcon from '@/assets/images/playing_icon.gif';
import Pagination from './Pagination';

import styles from '../style/FollowPage.scss';

// 关注列表
const FollowList = () => {
  const { data, loading } = useRequest(
    () => getUserCareList({ page: 1, size: 999999 }).toPromise()
  );

  const list = data || [];

  return (
    <RenderJudge
      value={!list.length && !loading}
      active={<NotData style={{ paddingTop: '30px' }} />}
      inactive={(
        <div style={{ minHeight: '232px' }}>
          <ListVideoCard
            list={list}
            rows={4}
            marginLeft={16}
            marginTop={16}
            dataFormat={(row) => ({
              roomId: row.room_id,
              label: row.matchName,
              image: row.room_img || row.screenshot_url,
              userImage: row.user_img,
              nickName: row.nickname,
              heat: row.fans,
              playing: row.status === 1,
              tag: VideoCard.tag[row.liveTypeId],
              type: row.matchTypeName,
              target: '_blank'
            })}
          />
        </div>
      )}
    />
  );
};

// 粉丝列表
const FansList = () => {
  const { data = {}, loading, pagination } = useRequest(
    ({ current, pageSize }) => getMyFansList({ page: current, size: pageSize }).toPromise(),
    {
      paginated: true,
      defaultPageSize: 20,
      formatResult: (rData) => {
        const rD = (rData || {}).data || {};
        const { code, data: pData } = rD;
        if (HttpCode.SUCCESS === code) {
          const { rows, total } = pData || {};

          return { list: rows || [], total: +total };
        }
        return throw { ...rD, type: 'business' };
      }
    }
  );
  const list = data.list || [];

  if (!list.length && !loading) return (<NotData />);
  return (
    <>
      <div className={styles.fansContainer}>
        {list.map((row, index) => {
          const LinkComponent = ({ children }) => {
            const anchorLink = (
              <Link
                to={`/live/room/${row.room_id}`}
                target="_blank"
                className={styles.imageWrapper}
              >
                {children}
              </Link>
            );
            const expertLink = (
              <Link
                to={`/forecast/expert/${row.expert_id}`}
                target="_blank"
                className={styles.imageWrapper}
              >
                {children}
              </Link>
            );
            if (row.identityType && row.expertStatus) {
              // 同时存在两种身份且在直播中，点击头像进入直播间
              // 同时存在两种身份不在直播中，点击头像进入专家主页
              if (row.room_status) return anchorLink;

              return expertLink;
            }
            // 主播
            if (row.identityType) return anchorLink;
            // 专家
            if (row.expertStatus) return expertLink;

            return (<div className={styles.imageWrapper}>{children}</div>);
          };
          return (
            <div className={styles.item} key={index}>
              <div className={styles.inner}>
                <LinkComponent>
                  <Image className={styles.userImage} src={row.user_img} defaultImage={UserDefaultImage} />
                  <RenderJudge
                    value={row.room_status}
                    active={(
                      <div className={styles.playing}>
                        <img src={PlayingIcon} className={styles.playingIcon} />
                      </div>
                    )}
                  />
                </LinkComponent>
                <div className={styles.content}>
                  <div className={styles.userName}>{row.nickname}</div>
                  <div className={styles.userTags}>
                    <RenderJudge
                      value={row.identityType}
                      active={(
                        <div className={ClassNames(styles.tagItem, styles.isAnchor)}>主播</div>
                      )}
                    />
                    <RenderJudge
                      value={row.expertStatus}
                      active={(
                        <div className={ClassNames(styles.tagItem, styles.isExpert)}>专家</div>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <RenderJudge
        value={pagination.totalPage}
        active={(
          <Pagination
            page={pagination.current}
            count={pagination.totalPage}
            onChange={(e, p) => pagination.changeCurrent(p)}
          />
        )}
      />
    </>
  );
};

const FollowPage = () => {
  const { roomId } = useSelector(({ user }) => user.userInfo || {});

  const [tabIndex, setTabIndex] = useState(0);

  // 是否是主播
  const isAnchor = !!roomId;

  const tabList = [{
    label: '我的关注',
    component: (<FollowList />)
  }, isAnchor && {
    label: '我的粉丝',
    component: (<FansList />)
  }].filter(Boolean);

  const { component } = tabList[tabIndex];

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {tabList.map((row, index) => (
          <div
            className={ClassNames(styles.tab, { [styles.isActive]: index === tabIndex })}
            onClick={() => setTabIndex(index)}
            key={index}
          >
            {row.label}
          </div>
        ))}
      </div>
      {component}
    </div>
  );
};

export default FollowPage;
