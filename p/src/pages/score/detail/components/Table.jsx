import React from 'react';
import ClassNames from 'classnames';
import { usePrevious } from 'ahooks';
import NotData from '@/components/NotData';
import RenderJudge from '@/components/RenderJudge';
import Iconfont from '@/components/Iconfont';

import styles from '../style/Table.scss';

const ArrowIconfont = ({ data }) => {
  const preData = usePrevious(data);

  const has = data && preData;
  const isUp = has && data > preData;
  const isDown = has && data < preData;

  if (!has) return null;
  if (isUp) {
    return (
      <Iconfont
        name="dir-up"
        className={ClassNames(styles.innerIcon, styles.isUp)}
      />
    );
  }
  if (isDown) {
    return (
      <Iconfont
        name="dir-down"
        className={ClassNames(styles.innerIcon, styles.isDown)}
      />
    );
  }
  return null;
};

const Cell = ({ label, width, style: cellStyle, arrow }) => {
  const cellStyleObj = {
    ...cellStyle || {}
  };
  if (width) {
    cellStyleObj.width = (typeof width === 'string') ? width : `${width}px`;
  } else {
    cellStyleObj.flex = 1;
  }

  const labelArr = Array.isArray(label) ? label : [label];

  return (
    <div className={styles.cell} style={cellStyleObj}>
      {labelArr.map((row, index) => (
        <div className={styles.cellLabel} key={index}>
          <span className={ClassNames(styles.innerText, {
            [styles.isSingleLine]: labelArr.length > 1,
            [styles.isMultiLine]: labelArr.length === 1
          })}
          >
            {row}
          </span>
          <RenderJudge
            value={arrow}
            active={(
              <ArrowIconfont data={row} />
            )}
          />
        </div>
      ))}
    </div>
  );
};

const Table = ({ className, style, list, props, isShowHeader }) => (
  <div className={ClassNames(styles.container, className)} style={style}>
    <RenderJudge
      value={isShowHeader}
      active={(
        <div className={ClassNames(styles.item, styles.isHeader)}>
          {props.map((row, index) => (
            <Cell width={row.width} label={row.label} key={index} style={row.headerStyle} />))}
        </div>
      )}
    />
    <RenderJudge
      value={list.length}
      inactive={<NotData style={{ padding: '80px' }} />}
      active={list.map((row, index) => (
        <div className={styles.item} key={index}>
          {props.map((subRow, subIndex) => {
            const { value, formatter, width, style: subRowStyle, arrow } = subRow;
            let showLabel = row[value];
            if (formatter && typeof formatter === 'function') showLabel = formatter(row, index);
            return (<Cell width={width} label={showLabel} key={subIndex} style={subRowStyle} arrow={arrow} />);
          })}
        </div>
      ))}
    />
  </div>
);

Table.defaultProps = {
  list: [],
  props: [],
  isShowHeader: true
};

export default Table;
