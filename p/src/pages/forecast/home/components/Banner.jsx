import React from 'react';
import BannerImage from '../images/banner_image.jpg';

import styles from '../style/Banner.scss';

const Banner = () =>
// const [swiperInstance, setSwiperInstance] = useSafeState();
// const [swiperIndex, setSwiperIndex] = useSafeState(0);
// const swiperRef = useRef();

// 初始化swiper
// const initSwiper = () => {
//   if (swiperInstance) {
//     swiperInstance.update();
//     swiperInstance.slideTo(0);
//   } else {
//     const instance = new Swiper(swiperRef.current, {
//       loop: false,
//       wrapperClass: styles.wrapper,
//       slideClass: styles.item,
//       on: {
//         slideChange({ activeIndex }) {
//           setSwiperIndex(activeIndex);
//         }
//       }
//     });
//     setSwiperInstance(instance);
//   }
// };
// 销毁swiper
// const destroySwiper = () => {
//   if (!swiperInstance) return;
//
//   swiperInstance.destroy();
// };

// useEffect(() => {
//   initSwiper();
//   return () => destroySwiper();
// }, []);
  (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.item}>
          <img
            className={styles.image}
            src={BannerImage}
          />
        </div>
      </div>
      {/* <div className={styles.page}> */}
      {/*  <div className={styles.label}>全国手游电竞大赛</div> */}
      {/*  <div className={styles.dot}> */}
      {/*    {bannerList.map((row, index) => ( */}
      {/*      <div className={ClassNames(styles.dotItem, { [styles.isActive]: index === swiperIndex })} key={index} /> */}
      {/*    ))} */}
      {/*  </div> */}
      {/* </div> */}
    </div>
  );

export default Banner;
