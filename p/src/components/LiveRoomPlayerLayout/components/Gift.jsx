import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import Swiper from 'swiper';
import { withStyles } from '@material-ui/core/styles';
import { usePersistFn, useRequest } from '@/utils/hooks';
import { getGiftList } from '@/servers/homeServer';
import Tooltip from '@material-ui/core/Tooltip';
import Iconfont from '@/components/Iconfont';
import GiftPanel from './GiftPanel';
import { useStores } from '../utils/store';

import UbImage from '../images/ub_image.png';
import UdImage from '../images/ud_image.png';

import styles from '../style/Gift.scss';

const GiftTooltip = withStyles(() => ({
  tooltip: {
    margin: 0,
    padding: 0,
    maxWidth: 'none',
    background: 'none'
  }
}))(Tooltip);

const Gift = forwardRef((props, ref) => {
  const { data, methods } = useStores();
  const { ugoldNum, ubeanNum } = data;
  const [swiperInstance, setSwiperInstance] = useState(null);
  const swiperRef = useRef();

  const { data: list = [] } = useRequest(
    (q) => getGiftList(q).toPromise(),
    null,
    (d) => (d || [])
  );

  // 初始化swiper
  const initSwiper = () => {
    if (swiperInstance) {
      swiperInstance.update();
      swiperInstance.slideTo(0);
    } else {
      const instance = new Swiper(swiperRef.current, {
        slidesPerView: 8,
        spaceBetween: 8,
        slidesPerGroup: 8,
        wrapperClass: styles.inner,
        slideClass: styles.item
      });
      setSwiperInstance(instance);
    }
  };

  // 销毁
  const destroySwiper = () => {
    if (!swiperInstance) return;

    swiperInstance.destroy();
    setSwiperInstance(null);
  };

  // 上一个
  const onPrevHandle = () => {
    if (!swiperInstance) return;

    swiperInstance.slidePrev();
  };
  // 下一个
  const onNextHandle = () => {
    if (!swiperInstance) return;

    swiperInstance.slideNext();
  };

  // 获取礼物播放地址
  const getGiftUrlHandle = usePersistFn((giftId) => {
    const { giftAnimation, giftType } = list.find(({ id }) => id === giftId) || {};

    if (giftType === 1) return [giftAnimation, giftAnimation];
    return [giftAnimation];
  });

  useEffect(() => {
    if (list.length) initSwiper();
  }, [list]);

  useEffect(() => () => destroySwiper(), []);

  useImperativeHandle(ref, () => ({
    getGiftUrl: getGiftUrlHandle
  }));

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        <div className={styles.wrapper} ref={swiperRef}>
          <div className={styles.inner}>
            {list.map((row, index) => (
              <GiftTooltip
                title={(
                  <GiftPanel
                    data={row}
                    onGive={(num) => methods.giveGift({
                      giftId: row.id,
                      giftQuantity: num,
                      price: row.purchasePrice,
                      waysToPurchase: row.waysToPurchase
                    })}
                  />
                )}
                placement="top"
                interactive
                key={index}
              >
                <div className={styles.item}>
                  <img
                    className={styles.image}
                    src={row.giftIcon}
                  />
                </div>
              </GiftTooltip>
            ))}
          </div>
          <Iconfont name="bp_ee" className={ClassNames(styles.page, styles.isLeft)} onClick={onPrevHandle} />
          <Iconfont name="bq_ee" className={ClassNames(styles.page, styles.isRight)} onClick={onNextHandle} />
        </div>
      </div>
      <div className={styles.assets}>
        <img src={UbImage} className={styles.assetsImage} />
        <div className={styles.assetsValue}>{ugoldNum}</div>
        <img src={UdImage} className={styles.assetsImage} />
        <div className={styles.assetsValue}>{ubeanNum}</div>
        <Link to="/user/assets" target="_blank" className={styles.recharge}>充值</Link>
      </div>
    </div>
  );
});

export default Gift;
