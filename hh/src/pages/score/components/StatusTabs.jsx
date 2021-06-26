import React from 'react';
import useSafeState from 'ahooks/lib/useSafeState';
import ClassNames from 'classnames';
import styles from '../style/StatusTabs.scss';

const StatusTabs = ({ tabs, onTabChange }) => {
  const [tabIndex, setTabIndex] = useSafeState(0);
  const handleChange = (idx) => {
    setTabIndex(idx);
    onTabChange(tabs[idx]);
  };
  return (
    <div className={styles.tabWrapper}>
      <div className={styles.titles}>
        {tabs.map((tab, index) => {
          return (
            <div
              key={index}
              className={ClassNames(styles.title, { [styles.activeTitle]: tabIndex === index })}
              onClick={() => handleChange(index)}
            >
              {tab.title}
            </div>
          );
        })}
      </div>
    </div>
  );
};

StatusTabs.defaultProps = {
  tabs: [],
  onTabChange: () => {}
};

export default StatusTabs;
