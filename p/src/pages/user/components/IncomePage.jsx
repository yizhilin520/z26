import React, { useState } from 'react';
import ClassNames from 'classnames';
import IncomeExchange from './IncomeExchange';
import ExchangeDetails from './ExchangeDetails';

import styles from '../style/IncomePage.scss';

const IncomePage = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const tabList = [{
    label: '收益兑换',
    component: (<IncomeExchange withdrawType={1} />)
  }, {
    label: '兑换明细',
    component: (<ExchangeDetails withdrawType={1} />)
  }];

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
      <div className={styles.wrapper}>
        {component}
      </div>
    </div>
  );
};

export default IncomePage;
