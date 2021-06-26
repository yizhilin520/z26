import React from 'react';
import { useSelector } from 'react-redux';
import ClassNames from 'classnames';
import { useRequest } from '@/utils/hooks';
import { getExpertPlanStat } from '@/servers/scoreServer';
import Image from '@/components/Image';

import UserDefaultImage from '@/assets/images/user_default_image.png';

import styles from '../style/UserInfo.scss';

const UserInfo = ({ expertId }) => {
  const { uid } = useSelector(({ user }) => user.userInfo || {});
  const { data = {} } = useRequest(
    (q) => getExpertPlanStat(q).toPromise(),
    { expertId, userId: uid }
  );

  const statusObj = {
    3: {
      label: '红',
      className: styles.isRed
    },
    1: {
      label: '走',
      className: styles.isBlue
    },
    0: {
      label: '黑',
      className: styles.isBlack
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <Image className={styles.userImage} src={data.headPic} defaultImage={UserDefaultImage} />
        <div className={styles.userName}>{data.nickName}</div>
        <div className={styles.userAlias}>{data.des}</div>
        <div className={styles.total}>
          <div className={styles.item}>
            <span className={styles.label}>发布方案：</span>
            <span className={styles.number}>{data.planNum || 0}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>关注粉丝：</span>
            <span className={styles.number}>{data.fansNum || 0}</span>
          </div>
        </div>
        <div className={styles.desc}>{data.introduction}</div>
        {/* <RenderJudge */}
        {/*  value={data.focus} */}
        {/*  active={(<div className={ClassNames(styles.followButton, styles.isActive)}>已关注</div>)} */}
        {/*  inactive={( */}
        {/*    <div className={styles.followButton}> */}
        {/*      <Iconfont name="jia" className={styles.followIcon} /> */}
        {/*      <span>关注</span> */}
        {/*    </div> */}
        {/*  )} */}
        {/* /> */}
      </div>
      <div className={styles.meta}>
        <div className={ClassNames(styles.item, styles.isBorderBottom, styles.isBorderRight)}>
          <div className={styles.label}>{data.planNum || 0}</div>
          <div className={styles.value}>方案</div>
        </div>
        <div className={ClassNames(styles.item, styles.isBorderBottom)}>
          <div className={styles.label}>{`${data.rate || 0}%`}</div>
          <div className={styles.value}>命中率</div>
        </div>
        <div className={ClassNames(styles.item, styles.isBorderRight)}>
          <div className={ClassNames(styles.label, styles.isBlue)}>{`近${data.numM || 0}中${data.numN || 0}`}</div>
          <div className={styles.value}>近期发单</div>
        </div>
        <div className={styles.item}>
          <div className={ClassNames(styles.label, styles.isBlue)}>{`${data.redNum || 0}连红`}</div>
          <div className={styles.value}>近期连红</div>
        </div>
      </div>
      <div className={styles.result}>
        <div className={styles.title}>近期战绩</div>
        <div className={styles.box}>
          {(data.status5 || []).map((row, index) => {
            const { label, className } = statusObj[row] || {};
            return (<div className={ClassNames(styles.item, className)} key={index}>{label}</div>);
          })}
        </div>
        <div className={styles.summary}>近5场走势：（近-远）</div>
      </div>
    </div>
  );
};

UserInfo.defaultProps = {
  data: {}
};

export default UserInfo;
