import React from 'react';
import RenderJudge from '@/components/RenderJudge';
import Iconfont from '@/components/Iconfont';

import styles from '../style/SignResult.scss';

import BagCopper from '../images/bag_copper.png';
import BagSilver from '../images/bag_silver.png';
import BagGold from '../images/bag_gold.png';

import DouziImage from '../images/douzi_image.png';
import TicketImage from '../images/ticket_image.png';
import ExpImage from '../images/exp_image.png';

const bagImageObj = {
  1: BagCopper,
  2: BagSilver,
  3: BagGold
};
const typeImageObj = {
  1: TicketImage,
  2: DouziImage,
  3: ExpImage
};

const SignResult = ({ data, onClose }) => {
  const { treasurType } = data[0] || {};
  const bagImage = bagImageObj[treasurType];

  // 链接跳转
  // const onLinkHandle = () => {
  //   onClose();
  //   return history.push('/user/task');
  // };
  return (
    <div className={styles.container}>
      <div className={styles.tips}>
        <RenderJudge
          value={bagImage}
          active={<img src={bagImage} className={styles.image} />}
        />
        <div className={styles.content}>
          <div className={styles.label}>签到成功</div>
          <div className={styles.summary}>成功开启宝箱</div>
        </div>
      </div>
      {data.map((row, index) => (
        <div className={styles.wrapper} key={index}>
          <img src={typeImageObj[row.type]} className={styles.image} />
          <div className={styles.content}>
            <div className={styles.money}>{`${row.money} ${row.name}`}</div>
            <div className={styles.summary}>{row.remark}</div>
          </div>
        </div>
      ))}
      {/* <div className={styles.footer}> */}
      {/*  <div className={styles.label}> */}
      {/*    <span>今日还可获取</span> */}
      {/*    <span className={styles.mark}>888</span> */}
      {/*    <span>个金豆</span> */}
      {/*  </div> */}
      {/*  <div className={styles.button} onClick={onLinkHandle}> */}
      {/*    <span>前往</span> */}
      {/*    <Iconfont name="bq_ee" className={styles.icon} /> */}
      {/*  </div> */}
      {/* </div> */}
      <Iconfont tag="div" name="close" className={styles.close} onClick={onClose} />
    </div>
  );
};

SignResult.defaultProps = {
  data: []
};

export default SignResult;
