import React, { useState } from 'react';
import ClassNames from 'classnames';
import RenderJudge from '@/components/RenderJudge';
import Iconfont from '@/components/Iconfont';

import styles from '../style/Table.scss';

const Table = ({ isNotData, list = [], props = [], tableStyle = {}, cellStyle = {}, bodyCellStyle = {}, headCellStyle = {}, onSort }) => {
  // 当前排序字段
  const [currentKey, setCurrentKey] = useState('');
  // 排序顺序 -1降序 0升序 1默认
  const [sortOrder, setSortOrder] = useState(1);

  const Cell = ({ width, label, compStyle, sortBy }) => {
    const style = {
      ...cellStyle,
      ...compStyle
    };
    if (width) {
      (typeof width === 'string') ? style.width = width : style.width = `${width}px`;
    } else {
      style.flex = 1;
    }
    return (
      <div className={ClassNames(styles.cell, {[styles.sortCell]: sortBy})} style={style} onClick={() => onHeadClick(sortBy)}>
        {label}
        <RenderJudge
          value={sortBy}
          active={(<Iconfont name="xiala" className={ClassNames(styles.sortIcon, {[styles.asc]: sortOrder === 0, [styles.desc]: sortOrder === -1 })} />)}
          inactive={(<></>)}
        />
      </div>
    );
  };

  const onHeadClick = (sortBy) => {
    if (!sortBy) return
    let val = sortOrder
    if (currentKey !== sortBy) {
      setCurrentKey(sortBy)
      val = -1
      setSortOrder(-1)
    } else {
      val = ++val > 1 ? -1 : val
      setSortOrder(val)
    }
    onSort(sortBy, val)
  };

  return (
    <div className={styles.container} style={tableStyle}>
      <div className={ClassNames(styles.item, styles.isHeader)}>
        {/* eslint-disable-next-line react/destructuring-assignment */}
        {props.map((row, index) => (<Cell width={row.width} label={row.label} key={index} compStyle={headCellStyle} sortBy={row.sortKey} />))}
      </div>
      <RenderJudge
        value={isNotData}
        active={(<div className={styles.notData}>暂无数据</div>)}
        inactive={list.map((row, index) => (
          <div className={styles.item} key={index}>
            {props.map((subRow, subIndex) => {
              let showLabel = row[subRow.value];
              if (subRow.type === 'index') showLabel = index + 1;
              if (subRow.formatter) showLabel = subRow.formatter(row, index);
              return (<Cell width={subRow.width} label={showLabel} key={subIndex} compStyle={bodyCellStyle} />);
            })}
          </div>
        ))}
      />
    </div>
  );
};

Table.defaultProps = {
  list: [],
  props: [],
  tableStyle: {},
  cellStyle: {},
  bodyCellStyle: {},
  headCellStyle: {},
  onSort: () => {}
};

export default Table;
