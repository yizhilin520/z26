import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Menus from './components/Menus';
import AccountPage from './components/AccountPage';
import PublishPage from './components/PublishPage';
import ManagePage from './components/ManagePage';
import IncomePage from './components/IncomePage';
import MessagePage from './components/MessagePage';

import styles from './style/index.scss';

import MenuAccountIcon from './images/menu_account_icon.png';
import MenuPublishIcon from './images/menu_publish_icon.png';
import MenuArticleIcon from './images/menu_article_icon.png';
import MenuIncomeIcon from './images/menu_income_icon.png';
import MenuMessageIcon from './images/menu_message_icon.png';

const ProfessorHome = () => {
  const { page } = useParams();
  const accountObj = {
    label: '账号信息',
    icon: MenuAccountIcon,
    value: 'account',
    component: (<AccountPage />)
  };
  const publishObj = {
    label: '发布文章',
    icon: MenuPublishIcon,
    value: 'publish',
    component: ((<PublishPage />))
  };
  const manageObj = {
    label: '文章管理',
    icon: MenuArticleIcon,
    value: 'manage',
    component: (<ManagePage />)
  };
  const incomeObj = {
    label: '我的收益',
    icon: MenuIncomeIcon,
    value: 'income',
    component: (<IncomePage />)
  };
  const messageObj = {
    label: '我的通知',
    icon: MenuMessageIcon,
    value: 'message',
    component: (<MessagePage />)
  };

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [page]);

  const menuList = [accountObj, publishObj, manageObj, incomeObj, messageObj];
  const { value, component } = menuList.find(({ value: v }) => v === page) || accountObj;

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.wrapper}>
        <Menus list={menuList} value={value} />
        <div className={styles.main}>
          {component}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfessorHome;
