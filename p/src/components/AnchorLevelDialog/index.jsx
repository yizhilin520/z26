import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ClassNames from 'classnames';
import RenderJudge from '@/components/RenderJudge';
import { getCalcLevel } from '@/utils/common';
import tipImg1 from '@/assets/images/anchor/tip1.png';
import tipImg2 from '@/assets/images/anchor/tip2.png';
import styles from './style.scss';

const AnchorLevelDialog = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const { currentLevelId, nextLevelId, currentExperience, nextLevelExperience, completePre } = props.levelInfo;
  const curLevel = getCalcLevel(currentLevelId);
  const nextLevel = getCalcLevel(nextLevelId);
  
  const expTransformFunc = (val) => {
    let ret = val;
    if (val >= 10000) {
      ret = (val / 10000).toFixed(1);
      ret = `${ret}W`;
    }
    return ret;
  };
  const diff = expTransformFunc(nextLevelExperience - currentExperience);
  const percent = `${Math.abs(completePre * 100)}%`;
  // 打开
  const onOpenHandle = () => {
    return setVisible(true);
  };
  // 关闭
  const onCloseHandle = () => {
    return setVisible(false);
  };

  useImperativeHandle(ref, () => ({
    open: onOpenHandle,
    close: onCloseHandle
  }));

  return (
    <RenderJudge
      value={visible}
      active={(
        <div className={styles.container}>
          <div className={ClassNames(styles.top, `anchorDialogBgLv${curLevel}`)}>
            <div className={ClassNames(styles.lvBadge, `anchorBadgeLv${curLevel}`)}></div>
            <p className={styles.level}>主播等级LV.{currentLevelId}</p>
          </div>
          <div className={styles.bottom}>
            <div className={styles.nextLvExp}>
              还差
              <span className={styles.expVal}>{diff}</span>
              经验升级至下一级
            </div>
            <div className={styles.lvExp}>
              <div className={ClassNames(styles.currentLv, `anchorLabelLv${curLevel}`)}>{currentLevelId}</div>
              <div className={styles.expBar}>
                <div className={ClassNames(styles.currentExp, `anchorProgressBgLv${curLevel}`)} style={{width: percent}}></div>
              </div>
              <div className={ClassNames(styles.nextLv, `anchorLabelLv${nextLevel}`)}>{nextLevelId}</div>
            </div>
            <div className={styles.expTips}>
              <div className={styles.tipItem}>
                <img src={tipImg1} />
                <p className={styles.tipTxt}>每1个金币提升1点经验</p>
              </div>
              <div className={styles.tipItem}>
                <img src={tipImg2} />
                <p className={styles.tipTxt}>提升主播等级闪耀全场</p>
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
});

export default AnchorLevelDialog;
