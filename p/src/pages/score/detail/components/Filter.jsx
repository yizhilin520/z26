import React from 'react';
import ClassNames from 'classnames';
import { useSet } from 'ahooks';
import { empty } from '@/utils/common';
import Iconfont from '@/components/Iconfont';
import RenderJudge from '@/components/RenderJudge';
import Checkbox from '../../components/Checkbox';

import styles from '../style/Filter.scss';

const Filter = ({ list, showDirection, children }) => {
  const [, { add: addHidden, reset: resetHidden, has: hasHidden }] = useSet();
  const [selectObj, { add: addSelect, remove: removeSelect, reset: resetSelect, has: hasSelect }] = useSet();

  // 隐藏
  const onHiddenHandle = () => {
    if (!selectObj.size) return;

    list.forEach(([companyId]) => {
      if (hasSelect(companyId)) addHidden(companyId);
    });

    resetSelect();
  };

  // 显示
  const onKeepHandle = () => {
    if (!selectObj.size) return;

    list.forEach(([companyId]) => {
      if (!hasSelect(companyId)) addHidden(companyId);
    });

    resetSelect();
  };

  // 选择全部
  const onCheckboxAllChangeHandle = (v) => {
    if (v) {
      list.forEach(([companyId]) => addSelect(companyId));
    } else {
      resetSelect();
    }
  };

  // 选择
  const onCheckboxChangeHandle = (f, v) => {
    if (v) return addSelect(f);

    return removeSelect(f);
  };

  // 是否全部选择了
  const isSelectAll = list.length ? (Array.from(selectObj).length === list.length) : false;
  // 显示总数
  const showListLength = list.filter(([companyId]) => !hasHidden(companyId)).length;

  // 表格选择的prop参数
  const tableSelectProp = {
    label: (<Checkbox value={isSelectAll} onChange={onCheckboxAllChangeHandle} />),
    width: 130,
    headerStyle: { backgroundColor: '#14162e' },
    formatter: ([companyId]) => (
      <Checkbox value={selectObj.has(companyId)} onChange={(v) => onCheckboxChangeHandle(companyId, v)} />
    )
  };

  const filterList = list.filter(([companyId]) => !hasHidden(companyId));

  return (
    <>
      <div className={styles.container}>
        <div className={styles.button} onClick={onHiddenHandle}>隐藏</div>
        <div className={styles.button} onClick={onKeepHandle}>保留</div>
        <div className={styles.button} onClick={resetHidden}>显示全部</div>
        <div className={styles.count}>
          <span>{'共{'}</span>
          <span className={styles.point}>{showListLength}</span>
          <span>/</span>
          <span>{list.length}</span>
          <span>{'}间公司'}</span>
        </div>
        <RenderJudge
          value={showDirection}
          active={(
            <div className={styles.direction}>
              <Iconfont name="dir-up" tag="div" className={ClassNames(styles.dir, styles.isUp)}>上升</Iconfont>
              <Iconfont name="dir-down" tag="div" className={ClassNames(styles.dir, styles.isDown)}>下降</Iconfont>
            </div>
          )}
        />
      </div>
      {children({ list: filterList, tableSelectProp })}
    </>
  );
};

Filter.defaultProps = {
  list: [],
  showDirection: true,
  children: empty
};

export default Filter;
