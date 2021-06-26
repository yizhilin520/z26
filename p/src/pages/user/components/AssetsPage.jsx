import React, { useState } from 'react';
import ClassNames from 'classnames';
import { getUserQueryWallet } from '@/servers/userServer';
import { useRequest } from '@/utils/hooks';
import UCurrencyRecharge from './UCurrencyRecharge';
import UCurrencyInfo from './UCurrencyInfo';
import UBeanInfo from './UBeanInfo';

import UbImage from '../images/ub_image.png';
import UdImage from '../images/ud_image.png';
import MxjImage from '../images/mxj_image.png';

import styles from '../style/AssetsPage.scss';

const AssetsPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const tabList = [{
    label: '金币充值',
    value: (<UCurrencyRecharge />)
  }, {
    label: '金币明细',
    value: (<UCurrencyInfo />)
  }, {
    label: '金豆明细',
    value: (<UBeanInfo />)
  }];
  const { data = {} } = useRequest(() => getUserQueryWallet().toPromise());

  const { value: currentComponent } = tabList[tabIndex];

  return (
    <div className={styles.container}>
      <div className={styles.title}>我的资产</div>
      <div className={styles.moneyBox}>
        <div className={ClassNames(styles.item, styles.isActive)}>
          <img className={ClassNames(styles.image, styles.isUb)} src={UbImage} />
          <div className={styles.info}>
            <div className={styles.label}>金币</div>
            <div className={styles.value}>{data.ugoldNum || 0}</div>
          </div>
        </div>
        <div className={styles.item}>
          <img className={ClassNames(styles.image, styles.isUd)} src={UdImage} />
          <div className={styles.info}>
            <div className={styles.label}>金豆</div>
            <div className={styles.value}>{data.ubeanNum || 0}</div>
          </div>
        </div>
        <div className={styles.item}>
          <img className={ClassNames(styles.image, styles.isMxj)} src={MxjImage} />
          <div className={styles.info}>
            <div className={styles.label}>梦想金</div>
            <div className={styles.value}>{`¥${data.dreamNum || 0}`}</div>
          </div>
        </div>
      </div>
      <div className={styles.tabBox}>
        <div className={styles.wrapper}>
          {tabList.map((row, index) => (
            <div
              className={ClassNames(styles.item, { [styles.isActive]: tabIndex === index })}
              onClick={() => setTabIndex(index)}
              key={index}
            >
              {row.label}
            </div>
          ))}
        </div>
        <div className={styles.content}>
          {currentComponent}
        </div>
      </div>
    </div>
  );
};

export default AssetsPage;
