import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import Swiper from 'swiper';
import { useRequest, useSafeState } from '@/utils/hooks';
import { getExpertRecommend } from '@/servers/scoreServer';
import Iconfont from '@/components/Iconfont';
import Image from '@/components/Image';
import UserDefaultImage from '@/assets/images/user_default_image.png';
import Title from './Title';

import styles from '../style/ExpertRecommend.scss';

const ExpertRecommend = ({ className }) => {
  const swiperRef = useRef();
  const [swiperInstance, setSwiperInstance] = useSafeState(null);
  const { data = [] } = useRequest(
    (q) => getExpertRecommend(q).toPromise(),
    { type: 0, size: 50 }
  );

  // 初始化swiper
  const initSwiper = () => {
    if (swiperInstance) {
      swiperInstance.update();
      swiperInstance.slideTo(0);
    } else {
      const instance = new Swiper(swiperRef.current, {
        slidesPerView: 11,
        slidesPerGroup: 11,
        spaceBetween: 20,
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

  useEffect(() => {
    if (data.length) initSwiper();
  }, [data]);

  useEffect(() => () => destroySwiper(), []);

  return (
    <>
      <Title label="专家推荐" />
      <div className={ClassNames(styles.container, className)}>
        <div className={styles.wrapper} ref={swiperRef}>
          <div className={styles.inner}>
            {data.map((row, index) => (
              <Link className={styles.item} key={index} to={`/forecast/expert/${row.id}`}>
                <Image
                  className={styles.image}
                  src={row.picUrl}
                  defaultImage={UserDefaultImage}
                />
                <div className={styles.label}>{row.name}</div>
              </Link>
            ))}
          </div>
        </div>
        <Iconfont
          tag="div"
          name="bp_ee"
          className={ClassNames(styles.page, styles.left)}
          onClick={onPrevHandle}
        />
        <Iconfont
          tag="div"
          name="bq_ee"
          className={ClassNames(styles.page, styles.right)}
          onClick={onNextHandle}
        />
      </div>
    </>
  );
};

export default ExpertRecommend;
