import React from 'react';
import ClassNames from 'classnames';
import debounce from 'lodash/debounce';
import { empty } from '@/utils/common';
import { useSafeState } from '@/utils/hooks';
import RenderJudge from '@/components/RenderJudge';
import SvgAnimationPlayer from '@/components/SvgAnimationPlayer';

import UbImage from '../images/ub_image.png';

import styles from '../style/GiftPanel.scss';

const GiftPanel = ({ data, onGive }) => {
  const [number, setNumber] = useSafeState(1);
  const [showPlaceholderImage, setShowPlaceholderImage] = useSafeState(true);

  const list = data.amountDictionary || [];
  const MAX_NUMBER = 99999;

  // 输入监听
  const onInputChangeHandle = (e) => {
    let val = e;
    try {
      val = e.target.value;
    } catch (e) {
    }
    if (val > MAX_NUMBER) val = MAX_NUMBER;

    return setNumber(val);
  };

  // 总金额
  const totalMoney = data.purchasePrice * number;

  // 赠送
  const onGiveHandle = debounce(() => onGive(number), 500);

  // 货币文案
  const moneyLabel = ['金币', '金豆'][data.waysToPurchase || 0];

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.preview}>
          <div className={styles.image}>
            <RenderJudge
              value={showPlaceholderImage}
              active={(<img className={styles.placeholder} src={data.giftIcon} />)}
            />
            <SvgAnimationPlayer
              className={styles.animation}
              url={data.giftSelectionAnimation}
              options={{ loops: 0 }}
              onLoad={() => setShowPlaceholderImage(false)}
            />
          </div>
          <div className={styles.infos}>
            <div className={styles.title}>{data.giftName}</div>
            <div className={styles.money}>{`${moneyLabel}${data.purchasePrice}`}</div>
          </div>
        </div>
        <RenderJudge
          value={data.giftType === 0}
          active={(
            <div className={styles.numberBox}>
              {list.map((row, index) => (
                <div
                  className={ClassNames(styles.numBtn, { [styles.isActive]: row.description === number })}
                  onClick={() => onInputChangeHandle(row.description)}
                  key={index}
                >
                  {row.description}
                </div>
              ))}
            </div>
          )}
        />
        <div className={styles.footer}>
          <RenderJudge
            value={data.giftType === 0}
            active={(
              <>
                <img src={UbImage} className={styles.ubImage} />
                <div className={styles.totalMoney}>{`共需${totalMoney || 0}${moneyLabel}`}</div>
                <input
                  type="number"
                  max={MAX_NUMBER}
                  min={1}
                  className={styles.input}
                  value={number}
                  onChange={onInputChangeHandle}
                />
              </>
            )}
          />
          <div className={styles.submit} onClick={onGiveHandle}>赠送</div>
        </div>
      </div>
    </div>
  );
};

GiftPanel.defaultProps = {
  data: {},
  onGive: empty
};

export default GiftPanel;
