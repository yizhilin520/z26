import React from 'react';
import Popper from '@material-ui/core/Popper';
import ClassNames from 'classnames';
import { useSafeState } from '@/utils/hooks';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import { useStores } from '../utils/store';

import styles from '../styles/SortDropdown.scss';

const SortDropdown = ({ className }) => {
  const list = [{ label: '时间排序', value: 'time' }, { label: '赛事排序', value: 'match' }];
  const { sortType, setSortType } = useStores();
  const [index, setIndex] = useSafeState(0);
  const [anchorEl, setAnchorEl] = useSafeState(null);

  const current = list[index];

  const setAnchorElHandle = (el) => setAnchorEl(el);

  const delAnchorElHandle = () => setAnchorEl(null);

  const handleClick = (event) => {
    if (anchorEl) return delAnchorElHandle();

    return setAnchorElHandle(event.currentTarget);
  };

  const onClickHandle = (v, i) => {
    if (sortType !== v) {
      setIndex(i);
      setSortType(v);
      delAnchorElHandle();
    }
  };

  return (
    <>
      <div className={className} onClick={handleClick}>{current.label}</div>
      <Popper open={!!anchorEl} anchorEl={anchorEl} transition disablePortal>
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
          <div className={styles.container}>
            {list.map((row, i) => (
              <div
                className={ClassNames(styles.item, { [styles.isActive]: sortType === row.value })}
                onClick={() => onClickHandle(row.value, i)}
                key={i}
              >
                {row.label}
              </div>
            ))}
          </div>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

SortDropdown.defaultProps = {
  value: null,
  onChange: () => {
  }
};

export default SortDropdown;
