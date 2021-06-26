import React, { useEffect, useRef } from 'react';
import ClassNames from 'classnames';
import { usePersistFn, useRequest } from 'ahooks';
import useSafeState from 'ahooks/lib/useSafeState';
import Swiper from 'swiper';
import { empty } from '@/common/utils';
import { getExpertRecommend } from '@/services/sports';
import RenderJudge from '@/components/RenderJudge';
import Image from '@/components/Image';
import DefaultUserImage from '@/assets/images/default_user_image.png';

import styles from '../style/ExpertList.scss';

// 每页显示数量
const SHOW_PAGE_NUMBER = 10;

const ExpertList = ({ onLoading, onClick }) => {
  const { data = [], loading } = useRequest(() => getExpertRecommend({ type: 0, size: 50 }));
  const [swiperIndex, setSwiperIndex] = useSafeState(0);
  const [swiperInstance, setSwiperInstance] = useSafeState(null);
  const swiperRef = useRef();

  // 初始化swiper
  const initSwiper = usePersistFn(() => {
    if (swiperInstance) {
      swiperInstance.update();
      swiperInstance.slideTo(0);
    } else {
      const instance = new Swiper(swiperRef.current, {
        wrapperClass: styles.inner,
        slideClass: styles.wrapper,
        on: {
          slideChange({ activeIndex }) {
            setSwiperIndex(activeIndex);
          }
        }
      });
      setSwiperInstance(instance);
    }
  });

  // 销毁
  const destroySwiper = usePersistFn(() => {
    if (!swiperInstance) return;

    swiperInstance.destroy();
  });

  useEffect(() => {
    if (data.length) initSwiper();
  }, [data]);

  useEffect(() => () => destroySwiper(), []);

  useEffect(() => {
    onLoading(loading);
  }, [loading]);

  const list = (() => {
    const result = [];
    data.forEach((item, index) => {
      const page = Math.floor(index / SHOW_PAGE_NUMBER);
      if (!result[page]) result[page] = [];
      result[page].push(item);
    });
    return result;
  })();
  return (
    <div className={styles.container} ref={swiperRef}>
      <div className={styles.inner}>
        {list.map((row, index) => {
          const listRow = row.concat(new Array(SHOW_PAGE_NUMBER - row.length).fill(0));
          return (
            <div className={styles.wrapper} key={index}>
              {listRow.map((subRow, subIndex) => (
                <div className={styles.item} key={subIndex}>
                  <RenderJudge
                    value={subRow}
                    active={(
                      <div className={styles.link} onClick={onClick}>
                        <Image
                          className={styles.image}
                          src={subRow.picUrl}
                          defaultImage={DefaultUserImage}
                        />
                        <div className={styles.label}>{subRow.name}</div>
                      </div>
                    )}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div className={styles.pagination}>
        {list.map((row, index) => (
          <div
            className={ClassNames(styles.pageItem, { [styles.isActive]: swiperIndex === index })}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

ExpertList.defaultProps = {
  onLoading: empty,
  onClick: empty
};

export default ExpertList;
