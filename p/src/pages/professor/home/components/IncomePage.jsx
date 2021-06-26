import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ClassNames from 'classnames';
import Vue2React from '@/components/Vue2React';
import IncomeExchange from '@/pages/user/components/IncomeExchange';
import ExchangeDetails from '@/pages/user/components/ExchangeDetails';
import VueIncomeArticlePage from '../vue/pages/income/components/article';

import styles from '../style/IncomePage.scss';

const IncomePage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { uid } = useSelector(({ user }) => user.userInfo || {});

  const tabList = [{
    label: '文章收入',
    component: (<Vue2React component={VueIncomeArticlePage} userId={uid} />)
  }, {
    label: '收益兑换',
    component: (<IncomeExchange withdrawType={2} />)
  }, {
    label: '兑换明细',
    component: (<ExchangeDetails withdrawType={2} />)
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
