import React from 'react';
import ClassNames from 'classnames';
import { viewSizeFormat } from '@/common/format';

import styles from '../style/Table.scss';

export const Header = ({ list }) => {
  return (
    <div className={styles.header}>
      {list.map((row, index) => {
        const { label, width } = row || {};
        const style = {};
        if (width) {
          style.width = `${viewSizeFormat(width)}px`;
        } else {
          style.flex = 1;
        }
        return (
          <div className={styles.item} key={index} style={style}>{label}</div>
        );
      })}
    </div>
  );
};
Header.defaultProps = {
  list: []
};

export const Row = ({ children }) => {
  return (
    <div className={styles.row}>
      {children}
    </div>
  );
};

export const Cell = ({ color, text, width, rows, borderAlign }) => {
  const textArr = Array.isArray(text) ? text : [text];
  const style = {
    color,
    height: `${viewSizeFormat(70) * rows}px`
  };
  if (width) {
    style.width = `${viewSizeFormat(width)}px`;
  } else {
    style.flex = 1;
  }
  return (
    <div
      className={ClassNames(styles.cell, {
        [styles.isBorderLeft]: borderAlign === 'left',
        [styles.isBorderRight]: borderAlign === 'right',
        [styles.isBorderTop]: borderAlign === 'top',
        [styles.isBorderBottom]: borderAlign === 'bottom',
      })}
      style={style}
    >
      {textArr.map((row, index) => {
        const { label, borderAlign: rowBorderAlign, color: rowColor } = (typeof row === 'object' && row) ? row : { label: row };
        return (
          <div
            className={ClassNames(styles.cellValue, {
              [styles.isBorderLeft]: rowBorderAlign === 'left',
              [styles.isBorderRight]: rowBorderAlign === 'right',
              [styles.isBorderTop]: rowBorderAlign === 'top',
              [styles.isBorderBottom]: rowBorderAlign === 'bottom',
            })}
            style={{ color: rowColor }}
            key={index}
          >
            {(label === undefined || label === null) ? '-' : label}
          </div>
        );
      })}
    </div>
  );
};

Cell.defaultProps = {
  rows: 1
};
