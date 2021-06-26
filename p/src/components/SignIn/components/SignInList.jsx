import React from 'react';
import { useSelector } from 'react-redux';
import ClassNames from 'classnames';
import { number2Chines } from '@/utils/common';
import { useSnackbar } from '@/plugins';
import { openTreasureChest } from '@/servers/userServer';
import { HttpCode } from '@/enums';
import { useLogin } from '@/utils/hooks';
import Iconfont from '@/components/Iconfont';
import RenderJudge from '@/components/RenderJudge';
import BagCopper from '../images/bag_copper.png';
import BagSilver from '../images/bag_silver.png';
import BagGold from '../images/bag_gold.png';
import styles from '../style/SignInList.scss';

const typeImageObj = {
  1: BagCopper,
  2: BagSilver,
  3: BagGold
};

const SignInList = ({ data, onChangeBindView, onChangeResultView, onClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { chests = [], lastIndex } = data;
  const { mobilePhone, uid } = useSelector(({ user }) => user.userInfo || {});
  const { isLogin, login } = useLogin();

  // 签到按钮
  const onSubmitHandle = async () => {
    // 没有登录去登录
    if (!isLogin) return login();
    // 没有绑定手机去绑定手机
    if (!mobilePhone) return onChangeBindView();
    // 都满足就签到
    const { data: { code, msg, data: rData } } = await openTreasureChest({ id: uid }).toPromise();
    if (HttpCode.SUCCESS === code) return onChangeResultView(rData || []);

    return enqueueSnackbar(msg);
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Iconfont tag="div" name="close" className={styles.close} onClick={onClose} />
        <div className={styles.list}>
          {chests.map((row, index) => (
            <div
              className={ClassNames({
                [styles.item]: true,
                [styles.isActive]: lastIndex + 1 >= row.indexs,
                [styles.isBig]: index === 6
              })}
              key={index}
            >
              <div className={styles.day}>{`第${number2Chines(row.indexs > 7 ? row.indexs : index + 1)}天`}</div>
              <RenderJudge
                value={index === 6}
                active={(<div className={styles.summary}>连续签到</div>)}
              />
              <img src={typeImageObj[row.type]} className={styles.image} />
              <div className={styles.label}>{`+${row.ubeanNum}`}</div>
            </div>
          ))}
        </div>
        <RenderJudge
          value={data.isOpen}
          active={(
            <div className={ClassNames(styles.submit, styles.isDisable)}>今日已签到</div>
          )}
          inactive={(
            <div className={styles.submit} onClick={onSubmitHandle}>签到开宝箱</div>
          )}
        />
      </div>
    </div>
  );
};

SignInList.defaultProps = {
  data: { chests: [], lastIndex: 0 }
};

export default SignInList;
