import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import { useSet } from 'ahooks';
import useSafeState from 'ahooks/lib/useSafeState';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Tooltip from '@material-ui/core/Tooltip';
import Popper from '@material-ui/core/Popper';
import { empty } from '@/utils/common';
import Checkbox from './Checkbox';

import styles from '../style/EventFilterDropdown.scss';

const EventFilterDropdown = forwardRef(({ data, onAddHidden, onRemoveHidden, onSubmit }, ref) => {
  const [anchorEl, setAnchorEl] = useSafeState(null);
  const [notSelected, { add: addNotSelected, remove: removeNotSelected, reset: resetNotSelected }] = useSet();

  const list = useMemo(() => {
    const storeObj = {};
    data.forEach((row) => {
      const { leagueId, leagueName } = row;

      const key = `a${leagueId}`;

      const def = storeObj[key] || {
        label: leagueName,
        itemId: leagueId,
        item: []
      };
      def.item.push(row);
      storeObj[key] = def;
    });

    return Object.keys(storeObj).map((name) => {
      const { label, itemId, item } = storeObj[name];
      return {
        label,
        itemId,
        number: item.length
      };
    });
  }, [data]);
  // 总选择赛事数量
  const totalSelectSize = data.filter(({ leagueId }) => !notSelected.has(leagueId)).length;

  // 打开
  const onOpenHandle = (el) => setAnchorEl(el.target || el);
  // 关闭
  const onCloseHandle = () => setAnchorEl(null);
  // 选择
  const onSelectHandle = (id) => {
    if (notSelected.has(id)) return removeNotSelected(id);
    return addNotSelected(id);
  };
  // 反选
  const onReverseSelectHandle = () => {
    list.forEach(({ itemId }) => {
      if (notSelected.has(itemId)) return removeNotSelected(itemId);
      return addNotSelected(itemId);
    });
  };
  // 确定
  const onChangeHandle = () => {
    const obj = {};
    data.forEach((row) => {
      const { leagueId, eventId } = row;
      if (notSelected.has(leagueId)) {
        obj[eventId] = true;
        return onAddHidden(eventId);
      }
      obj[eventId] = false;
      return onRemoveHidden(eventId);
    });
    onSubmit(obj);
    return onCloseHandle();
  };

  useImperativeHandle(ref, () => ({
    open: onOpenHandle,
    close: onCloseHandle
  }));

  return (
    <Popper open={!!anchorEl} anchorEl={anchorEl} transition disablePortal placement="bottom">
      <ClickAwayListener onClickAway={onCloseHandle}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            {list.map((row, index) => (
              <div className={styles.item} onClick={() => onSelectHandle(row.itemId)} key={index}>
                <Checkbox className={styles.checkbox} value={!notSelected.has(row.itemId)} />
                <Tooltip title={row.label} placement="top" arrow>
                  <span className={styles.name}>{row.label}</span>
                </Tooltip>
                <span className={styles.number}>{`[${row.number}]`}</span>
              </div>
            ))}
          </div>
          <div className={styles.footer}>
            <div className={styles.selectNumber}>
              <span>选中</span>
              <span className={styles.important}>{`[${totalSelectSize}]`}</span>
              <span>场赛事</span>
            </div>
            <div className={styles.buttons}>
              <div className={styles.btn} onClick={resetNotSelected}>全选</div>
              <div className={styles.btn} onClick={onReverseSelectHandle}>反选</div>
              <div className={styles.btn} onClick={onChangeHandle}>确定</div>
            </div>
          </div>
        </div>
      </ClickAwayListener>
    </Popper>
  );
});

EventFilterDropdown.defaultProps = {
  data: [],
  onSubmit: empty,
  onAddHidden: empty,
  onRemoveHidden: empty
};

export default EventFilterDropdown;
