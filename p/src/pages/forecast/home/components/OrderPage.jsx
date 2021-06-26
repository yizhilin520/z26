import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import { useRequest, useSafeState } from '@/utils/hooks';
import { getUserQueryWallet } from '@/servers/userServer';
import { getExpertPurchaseList } from '@/servers/scoreServer';
import Image from '@/components/Image';
import RenderJudge from '@/components/RenderJudge';
import UserDefaultImage from '@/assets/images/user_default_image.png';
import ExpertPlanTabs from '../../components/ExpertPlanTabs';
import ExpertPlanList from '../../components/ExpertPlanList';

import styles from '../style/OrderPage.scss';

const OrderPage = () => {
  const { nickName, headImage, uid } = useSelector(({ user }) => user.userInfo || {});
  const [drawStatus, setDrawStatus] = useSafeState();
  const [data, setData] = useSafeState([]);
  const { data: assetsData = {} } = useRequest(
    (q) => getUserQueryWallet(q).toPromise(),
    {}
  );
  const { loading, mutate } = useRequest(
    (q) => getExpertPurchaseList(q).toPromise(),
    { userId: uid, drawStatus },
    (d) => {
      setData(d || []);
    }
  );

  // 类型切换
  const onTypeChangeHandle = (v) => {
    setData([]);
    setDrawStatus(v);
    return mutate({ userId: uid, drawStatus: v });
  };

  const typeList = [{
    label: '全部'
  }, {
    label: '未开奖',
    value: 1
  }, {
    label: '已开奖',
    value: 2
  }];

  return (
    <div className={styles.container}>
      <div className={styles.userContainer}>
        <div className={styles.info}>
          <Image className={styles.image} src={headImage} defaultImage={UserDefaultImage} />
          <div className={styles.label}>{nickName}</div>
        </div>
        <div className={styles.menu}>
          <div className={ClassNames(styles.item, styles.isActive)}>
            <div className={styles.label}>我的订单</div>
          </div>
          <Link className={styles.item} to="/user/assets">
            <div className={styles.label}>我的金币</div>
            <RenderJudge
              value={assetsData.ugoldNum}
              active={(<div className={styles.value}>{`（${assetsData.ugoldNum}）`}</div>)}
            />
          </Link>
        </div>
      </div>
      <ExpertPlanList
        className={styles.listContainer}
        loading={loading && !data.length}
        list={data}
        showUserInfo={false}
        beforeChildren={(
          <ExpertPlanTabs list={typeList} value={drawStatus} onChange={onTypeChangeHandle} />
        )}
      />
    </div>
  );
};

export default OrderPage;
