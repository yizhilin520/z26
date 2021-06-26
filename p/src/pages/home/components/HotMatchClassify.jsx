import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import Swiper from 'swiper';
import dayJs from 'dayjs';
import Iconfont from '@/components/Iconfont';
import Image from '@/components/Image';
import { useInterval, useRequest } from '@/utils/hooks';
import { getNotice } from '@/servers/scoreServer';
import DefaultFootballMatchImage from '@/assets/images/default_football_match_image.png';
import DefaultBasketballMatchImage from '@/assets/images/default_basketball_match_image.png';
import Section from './Section';

import styles from '../style/HotMatchClassify.scss';

const HotMatchClassify = () => {
  const [selectIndex, setSelectIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const swiperRef = useRef();

  const classifyList = [{
    label: '即将开始',
    value: 1
  }, {
    label: '热门比赛',
    value: 4
  }, {
    label: '五大联赛',
    value: 2
  }, {
    label: '一级联赛',
    value: 3
  }];
  const baseQuery = { dataType: 0 };
  const currentClassify = classifyList[selectIndex];
  const { data = [], loading, mutate } = useRequest(
    (q) => getNotice(q)
      .toPromise(),
    {
      ...baseQuery,
      type: currentClassify.value
    }
  );

  useInterval(mutate, !loading ? 60000 * 2 : null);

  // 初始化swiper
  const initSwiper = () => {
    if (swiperInstance) {
      swiperInstance.update();
      swiperInstance.slideTo(0);
    } else {
      const instance = new Swiper(swiperRef.current, {
        slidesPerView: 5,
        spaceBetween: 12,
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

  useEffect(() => {
    if (data.length) initSwiper();
  }, [data]);

  useEffect(() => () => destroySwiper(), []);

  // 类型切换
  const classifyChangeHandle = (index, type) => {
    if (index === selectIndex) return;
    setSelectIndex(index);
    return mutate({
      ...baseQuery,
      type
    });
  };

  return (
    <Section>
      <div className={styles.titleContainer}>
        {classifyList.map((row, index) => (
          <div
            className={ClassNames(styles.item, { [styles.isActive]: index === selectIndex })}
            key={index}
            onClick={() => classifyChangeHandle(index, row.value)}
          >
            <div className={styles.classifyLabel}>
              {row.label}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.listContainer}>
        <div className={styles.wrapper} ref={swiperRef}>
          <div className={styles.inner}>
            {data.map((row, index) => {
              const DefaultMatchImage = row[7] === 1 ? DefaultFootballMatchImage : DefaultBasketballMatchImage;
              return (
                <div className={styles.item} key={index}>
                  <Link to={`/score/detail/${row[0]}`} target="_blank">
                    <div className={styles.header}>
                      <div className={styles.name}>{row[6]}</div>
                      <div className={styles.time}>
                        {dayJs(row[1])
                          .format('MM-DD HH:mm')}
                      </div>
                    </div>
                    <div className={styles.content}>
                      <div className={ClassNames(styles.info, styles.infoItem)}>
                        <div className={styles.imageWrapper}>
                          <Image
                            className={styles.image}
                            src={row[3]}
                            defaultImage={DefaultMatchImage}
                            alt={row[2]}
                          />
                        </div>
                        <div className={styles.name}>
                          <div className={styles.nameText}>{row[2]}</div>
                        </div>
                      </div>
                      <div className={ClassNames(styles.score, styles.infoItem)}>
                        <div className={styles.scoreText}>VS</div>
                      </div>
                      <div className={ClassNames(styles.info, styles.infoItem)}>
                        <div className={styles.imageWrapper}>
                          <Image
                            className={styles.image}
                            src={row[5]}
                            defaultImage={DefaultMatchImage}
                            alt={row[4]}
                          />
                        </div>
                        <div className={styles.name}>
                          <div className={styles.nameText}>{row[4]}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
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
    </Section>
  );
};

export default HotMatchClassify;
