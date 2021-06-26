import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import { useLogin, usePageViewDataReport } from '@/utils/hooks';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SideTools from '@/components/SideTools';
import Main from '../components/Main';
import HomePage from './components/HomePage';
import MarketPage from './components/MarketPage';
import OrderPage from './components/OrderPage';

import styles from './style/index.scss';

const ForecastPage = ({ match: { params: { page } } }) => {
  const { isLogin, login } = useLogin();

  usePageViewDataReport('web_4', { params: { event_value: '预测首页' } });

  // 首页
  const homeObj = {
    label: '精选',
    value: 'home',
    component: (<HomePage />)
  };
  // 方案市场
  const marketObj = {
    label: '方案市场',
    value: 'market',
    component: (<MarketPage />)
  };
  // 我的订单
  const orderObj = {
    label: '我的订单',
    value: 'order',
    component: (<OrderPage />),
    requiredLogin: !isLogin
  };
  // 发布
  const publishObj = {
    label: '发布推荐',
    value: 'publish',
    url: '/professor',
    requiredLogin: !isLogin
  };
  const tabList = [homeObj, marketObj, orderObj, publishObj];
  const { value, component } = tabList.find(({ value: v, requiredLogin }) => !requiredLogin && v === page) || homeObj;

  const onTabChangeHandle = ({ requiredLogin }, e) => {
    if (requiredLogin) {
      login();
      e.preventDefault();
      e.stopPropagation();
    }
  };

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [page]);

  return (
    <>
      <Header isForecast />
      <Main>
        <div className={styles.tabs}>
          {tabList.map((row, index) => (
            <Link
              to={row.url || `/forecast/${row.value}`}
              className={ClassNames(styles.item, { [styles.isActive]: value === row.value })}
              onClick={(e) => onTabChangeHandle(row, e)}
              key={index}
            >
              {row.label}
            </Link>
          ))}
        </div>
        {component}
      </Main>
      <SideTools />
      <Footer />
    </>
  );
};

export default ForecastPage;
