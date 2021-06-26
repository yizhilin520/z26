import React from 'react';
import LeftSideTools from '../../components/LeftSideTools';

import { useStores } from '../utils/store';

export default function LeftSideTool() {
  const { selectObject, list, setKeep, setEmptySelect, setHidden } = useStores();
  const isEmpty = JSON.stringify(selectObject) === '{}';

  // 关注
  const onKeepHandle = () => {
    if (isEmpty) return;

    setKeep(Object.keys(selectObject));
    setEmptySelect();
  };
  // 保留
  const onStayHandle = () => {
    if (isEmpty) return;

    const obj = {};
    list.forEach(({ eventId }) => {
      if (!selectObject[eventId]) {
        obj[eventId] = true;
      }
    });

    setHidden(obj);
    setEmptySelect();
  };
  // 隐藏
  const onHiddenHandle = () => {
    if (isEmpty) return;

    setHidden(selectObject);
    setEmptySelect();
  };

  return (
    <LeftSideTools onKeep={onKeepHandle} onHidden={onHiddenHandle} onSave={onStayHandle} isMedia />
  );
}
