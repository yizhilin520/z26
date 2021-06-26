import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ClassNames from 'classnames';
import { useLogin, useRequest } from '@/utils/hooks';
import { getSearchHotKey } from '@/servers/homeServer';
import { localStorageGet, localStoragePut } from '@/utils/regular';
import { getCalcLevel } from '@/utils/common';
import Iconfont from '@/components/Iconfont';
import RenderJudge from '@/components/RenderJudge';
import Image from '@/components/Image';
import UserDefaultImage from '@/assets/images/user_default_image.png';
import AppDownload from './AppDownload';
import UnLoginLabel from './UnLoginLabel';
import Subscribe from './Subscribe';
import Follow from './Follow';
import UserInfo from './UserInfo';
import SearchDropDown from './SearchDropDown';
import { useStores } from '../utils/store';

import styles from '../style/RightList.scss';

const RightList = () => {
  const { state: { theme } } = useStores();
  const { headImage, nickName, levelId } = useSelector(({ user }) => (user.userInfo || {}));
  const { isLogin, login: onLoginHandle, register: onRegisterHandle } = useLogin();
  const [showSearch, setShowSearch] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [hisList, setHisList] = useState([]);
  const { expert } = useSelector(({ config }) => config.globalSwitch);
  const calcLevel = getCalcLevel(levelId);

  const { data: hotList = [] } = useRequest(
    (q) => getSearchHotKey(q).toPromise(),
    {},
    (d) => d.data || []
  );

  const handleSearchFocus = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setShowSearch(true);
    const hisArr = localStorageGet('searchHistory') || [];
    setHisList(hisArr);
  };

  const handleSearchConfirm = () => {
    if (!searchKey) return;
    goToSearchDetail(searchKey);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      return handleSearchConfirm();
    }
  };

  // 跳转搜索详情页
  const goToSearchDetail = (keyName) => {
    const url = `/search?key=${keyName}`;
    const arr = localStorageGet('searchHistory') || [];
    const index = arr.findIndex((item) => item === keyName);
    if (index > -1) arr.splice(index, 1);
    arr.unshift(keyName);
    // 只保留10条
    if (arr.length > 10) arr.pop();
    localStoragePut('searchHistory', arr);
    setHisList(arr);

    window.open(url);
  };

  // 清空历史搜索
  const handleClear = () => {
    localStorage.removeItem('searchHistory');
    setHisList([]);
  };

  const widonclick = () => {
    setShowSearch(false);
  };

  useEffect(() => {
    window.addEventListener('click', widonclick);
    return () => {
      window.removeEventListener('click', widonclick);
    };
  }, []);

  return (
    <div className={ClassNames(styles.container, 'module-rightHeader')}>
      <div className={ClassNames(styles.item, styles[theme])} onClick={handleSearchFocus}>
        <div className={ClassNames(styles.searchWrapper, styles[theme])}>
          <input
            type="text"
            placeholder="请输入内容"
            value={searchKey}
            className={styles.searchInput}
            onChange={(e) => setSearchKey(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Iconfont name="search" className={styles.searchIcon} onClick={handleSearchConfirm} />
        </div>
        <RenderJudge
          value={showSearch}
          active={(
            <div className={ClassNames(styles.subNav, styles.isArrow)} style={{ display: 'block' }}>
              <div className={ClassNames(styles.subWrapper, styles.isShadow2, styles.Radius10, styles.isBackground)}>
                <SearchDropDown
                  list={hotList}
                  hisList={hisList}
                  onItemClick={goToSearchDetail}
                  onClearHistory={handleClear}
                />
              </div>
            </div>
          )}
        />
      </div>
      <RenderJudge
        value={expert}
        active={(
          <Link className={ClassNames(styles.item, styles[theme])} to="/professor">
            <div className={ClassNames(styles.inner, styles.isPointer, styles.isHover)}>
              <Iconfont name="expert" className={styles.icon} />
              <span className={styles.label}>专家号</span>
            </div>
          </Link>
        )}
      />
      <div className={ClassNames(styles.item, styles[theme])}>
        <div className={ClassNames(styles.inner, styles.isPointer, styles.isHover)}>
          <Iconfont name="caidan" className={styles.icon} />
          <span className={styles.label}>APP</span>
        </div>
        <div className={styles.subNav}>
          <div className={styles.subWrapper}>
            <AppDownload />
          </div>
        </div>
      </div>
      <div className={ClassNames(styles.item, styles[theme])}>
        <div className={ClassNames(styles.inner, styles.isPointer, styles.isHover)}>
          <Iconfont name="dingyue" className={styles.icon} />
          <span className={styles.label}>订阅</span>
        </div>
        <div className={ClassNames(styles.subNav, styles.isArrow)}>
          <div className={ClassNames(styles.subWrapper, styles.isShadow, styles.isRadius, styles.isBackground)}>
            <RenderJudge
              value={isLogin}
              active={<Subscribe />}
              inactive={<UnLoginLabel label="登录后可看订阅内容, 立即登录 !" />}
            />
          </div>
        </div>
      </div>
      <div className={ClassNames(styles.item, styles[theme])}>
        <div className={ClassNames(styles.inner, styles.isPointer, styles.isHover)}>
          <Iconfont name="chakantieziguanzhu" className={styles.icon} />
          <span className={styles.label}>关注</span>
        </div>
        <div className={ClassNames(styles.subNav, styles.isArrow)}>
          <div className={ClassNames(styles.subWrapper, styles.isShadow, styles.isRadius, styles.isBackground)}>
            <RenderJudge
              value={isLogin}
              active={<Follow />}
              inactive={<UnLoginLabel label="登录后可看关注信息, 立即登录 !" />}
            />
          </div>
        </div>
      </div>
      <div className={ClassNames(styles.item, styles[theme])}>
        <RenderJudge
          value={isLogin}
          active={(
            <>
              <Link to="/user" className={ClassNames(styles.inner, styles.isPointer, styles.isHover)}>
                <Image
                  className={ClassNames(styles.userImage, `borderLv${calcLevel}`)}
                  src={headImage}
                  defaultImage={UserDefaultImage}
                  alt={nickName}
                />
              </Link>
              <div className={ClassNames(styles.subNav, styles.isArrow)}>
                <div className={ClassNames(styles.subWrapper, styles.isShadow, styles.isRadius, styles.isBackground)}>
                  <UserInfo />
                </div>
              </div>
            </>
          )}
          inactive={(
            <>
              <Iconfont name="yonghu" className={styles.icon} />
              <span
                className={ClassNames(styles.label, styles.isPointer, styles.isHover)}
                onClick={onLoginHandle}
              >
                登录
              </span>
              <span className={styles.line} />
              <span
                className={ClassNames(styles.label, styles.isPointer, styles.isHover)}
                onClick={onRegisterHandle}
              >
                注册
              </span>
            </>
          )}
        />
      </div>
    </div>
  );
};

export default RightList;
