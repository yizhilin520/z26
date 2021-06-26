import React from 'react';
import LeftSideToolsComponent from '../../components/LeftSideTools';
import { useStores } from '../utils/store';

const LeftSideTools = () => {
  const { state, methods } = useStores();
  const { selectObject } = state;
  const { setKeep, addHidden, emptySelect } = methods;

  // 关注
  const onKeepHandle = () => {
    setKeep(Array.from(selectObject));

    return emptySelect();
  };
  // 隐藏
  const onHiddenHandle = () => {
    selectObject.forEach(addHidden);

    return emptySelect();
  };
  // 保留
  const onSaveHandle = () => {
    const { list } = state;
    list.forEach(({ eventId }) => {
      if (!selectObject.has(eventId)) addHidden(eventId);
    });

    return emptySelect();
  };

  return (
    <LeftSideToolsComponent
      onKeep={onKeepHandle}
      onHidden={onHiddenHandle}
      onSave={onSaveHandle}
      isMedia={false}
    />
  );
};

export default LeftSideTools;
