import React, { useEffect, useRef } from 'react';
import ClassNames from 'classnames';
import Swiper from 'swiper/bundle';
import { scoreDataFormat } from '@/utils/common';
import { usePersistFn, useRequest, useSafeState, useTimeout } from '@/utils/hooks';
import { getHotScoreList } from '@/servers/scoreServer';
import Iconfont from '@/components/Iconfont';
import Dialog from '@/pages/user/components/Dialog';
import qrcodeImg from '@/assets/images/download_qrcode.jpg';
import successImg from '@/assets/images/icon_success.png';
import Title from './Title';
import MatchCard from './MatchCard';

import styles from '../style/MatchList.scss';

const MatchList = () => {
  const matchRef = useRef();
  const [swiperInstance, setSwiperInstance] = useSafeState();
  const [virtualData, setVirtualData] = useSafeState({ slides: [] });
  const [visible, setVisible] = useSafeState(false);
  const { data: list = [] } = useRequest(
    (q) => getHotScoreList(q).toPromise(),
    null,
    (d) => d || []
  );

  // 初始化swiper
  const initSwiper = usePersistFn(() => {
    if (swiperInstance) {
      swiperInstance.update();
      swiperInstance.slideTo(0);
    } else {
      const instance = new Swiper(matchRef.current, {
        slidesPerView: 5,
        spaceBetween: 16,
        wrapperClass: styles.inner,
        slideClass: styles.item,
        virtual: {
          slides: list,
          renderExternal: setVirtualData
        },

        breakpoints: {
          320: {
            slidesPerView: 1
          },
          768: {
            slidesPerView: 2
          },
          1120: {
            slidesPerView: 3
          },
          1366: {
            slidesPerView: 4
          },
          1840: {
            slidesPerView: 5
          }
        }
      });
      setSwiperInstance(instance);
    }
  });

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

  useTimeout(initSwiper, list.length ? 0 : null);

  useEffect(() => destroySwiper, []);

  return (
    <>
      <Title label="全部赛事" />
      <div className={styles.container}>
        <div className={styles.swiper} ref={matchRef}>
          <div className={styles.inner}>
            {virtualData.slides.map((row, index) => (
              <MatchCard
                className={styles.item}
                style={{ left: `${virtualData.offset}px` }}
                data={scoreDataFormat(row)}
                reserve={row[35]}
                key={index}
                onBook={() => setVisible(true)}
              />
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
      <Dialog title="提示" visible={visible} width={518} onClose={() => setVisible(false)}>
        <div className={styles.dialogWrapper}>
          <img src={qrcodeImg} className={styles.qrcode} />
          <div className={styles.textArea}>
            <div className={styles.successTxt}>
              <img src={successImg} className={styles.iconSuccess} />
              <span>预约成功</span>
            </div>
            <div className={styles.tips}>扫描二维码下载安装U球体育，直播开始即可在第一时间收到预约提醒哦</div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default MatchList;
