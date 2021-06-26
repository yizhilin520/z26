import React, { useState } from 'react';
import RenderJudge from '@/components/RenderJudge';
import imgHistory from '@/assets/images/header/search_history.png';
import imgHot from '@/assets/images/header/search_hot.png';
import ClassNames from 'classnames';

import styles from '../style/SearchDropDown.scss';

const SearchDropDown = ({list, hisList, onItemClick, onClearHistory}) => {

  const handleKeyClick = (keyName) => {
    onItemClick(keyName)
  };

  return (
    <div className={styles.container}>
      <RenderJudge
        value={hisList.length}
        active={(
          <div className={styles.partItem}>
            <div className={styles.partTitle}>
              <div className={styles.imgTitle}>
                <img src={imgHistory} />
                <span>历史搜索</span>
              </div>
              <span className={styles.clear} onClick={onClearHistory}>清空</span>
            </div>
            <div className={styles.historyList}>
              {hisList.map(keyName => (
                <div key={keyName} className={styles.historyItem} onClick={() => handleKeyClick(keyName)}>{keyName}</div>
              ))}
            </div>
          </div>
        )}
      />
      <RenderJudge
        value={list.length}
        active={(
          <div className={ClassNames(styles.partItem, styles.secondPart)}>
            <div className={styles.partTitle}>
              <div className={styles.imgTitle}>
                <img src={imgHot} />
                <span>热门搜索</span>
              </div>
            </div>
            <div className={styles.hotList}>
              {list.map((item, index) => (
                <div key={item.id} className={styles.hotItem} onClick={() => handleKeyClick(item.keyName)}>
                  <div
                    className={ClassNames(styles.rankNo, {
                      [styles.first]: index === 0,
                      [styles.second]: index === 1,
                      [styles.third]: index === 2,
                    })}
                  >{index + 1}</div>
                  <div className={styles.hotKey}>{item.keyName}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default SearchDropDown;
