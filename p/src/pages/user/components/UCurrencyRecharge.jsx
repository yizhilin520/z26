import React, { useRef } from 'react';
import ClassNames from 'classnames';
import { useSafeState } from '@/utils/hooks';
import Iconfont from '@/components/Iconfont';
import RenderJudge from '@/components/RenderJudge';
import { useSnackbar } from '@/plugins';
import RechargeDialog from './RechargeDialog';

import UbImage from '../images/ub_image.png';
import CustomizeImage from '../images/customize_image.png';
import ZhifubaoImage from '../images/zhifubao_image.png';
import WeixinImage from '../images/weixin_image.png';

import styles from '../style/UCurrencyRecharge.scss';

const UCurrencyRecharge = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [moneyIndex, setMoneyIndex] = useSafeState(0);
  const [payType, setPayType] = useSafeState('zhifubao');
  const [showInput, setShowInput] = useSafeState(false);
  const rechargeRef = useRef();
  const inputRef = useRef();

  const moneyList = [{
    label: 880,
    value: 88
  }, {
    label: 1880,
    value: 188
  }, {
    label: 2880,
    value: 288
  }, {
    label: 6880,
    value: 688
  }, {
    label: 18880,
    value: 1888
  }, {
    label: '自定义',
    type: 'custom'
  }];
  const payList = [{
    label: '支付宝',
    value: 'zhifubao',
    image: ZhifubaoImage
  }, {
    label: '微信',
    value: 'weixin',
    image: WeixinImage
  }];

  const money = moneyList[moneyIndex].value;

  // 打开充值弹框
  const onOpenRechargeDialog = () => {
    const moneyVal = money || inputRef.current.value;
    if (!moneyVal) return enqueueSnackbar('请输入自定义金额');
    if (!/(^[1-9]\d*$)/.test(moneyVal)) return enqueueSnackbar('金额输入有误');

    return rechargeRef.current.open({
      money: moneyVal,
      type: payList.find(({ value }) => value === payType).label
    });
  };

  // 金额选择
  const onSelectMoneyHandle = (index, { type }) => {
    if (index === moneyIndex) return;
    const isCustom = type === 'custom';

    setShowInput(isCustom);
    setMoneyIndex(index);

    if (isCustom) {
      inputRef.current.value = null;
      setTimeout(() => inputRef.current.focus(), 10);
    }
  };

  return (
    <>
      <div className={styles.tips}>
        <Iconfont name="gantanhao" className={styles.icon} />
        <div className={styles.label}>充值金币可获赠 体育梦想金，充多少送多少</div>
      </div>
      <div className={styles.container}>
        <div className={styles.title}>充值数量</div>
        <div className={styles.list}>
          {moneyList.map((row, index) => (
            <div
              className={ClassNames(styles.item, { [styles.isActive]: index === moneyIndex })}
              onClick={() => onSelectMoneyHandle(index, row)}
              key={index}
            >
              <div className={styles.recharge}>
                <RenderJudge
                  value={row.type === 'custom'}
                  active={(
                    <>
                      <div className={ClassNames(styles.customWrapper, { [styles.isHidden]: showInput })}>
                        <img src={CustomizeImage} className={styles.customImage} />
                        <div className={styles.customLabel}>自定义</div>
                      </div>
                      <input
                        type="text"
                        className={ClassNames(styles.customInput, { [styles.isShow]: showInput })}
                        maxLength={5}
                        ref={inputRef}
                      />
                    </>
                  )}
                  inactive={(
                    <div className={styles.inner}>
                      <div className={styles.top}>
                        <img className={styles.image} src={UbImage} />
                        <div className={styles.label}>{row.label}</div>
                      </div>
                      <div className={styles.bottom}>{`${row.value}元`}</div>
                    </div>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.title}>支付方式</div>
        <div className={styles.list}>
          {payList.map((row, index) => (
            <div
              className={ClassNames(styles.item, { [styles.isActive]: row.value === payType })}
              onClick={() => setPayType(row.value)}
              key={index}
            >
              <div className={styles.pay}>
                <img src={row.image} className={styles.image} />
                <div className={styles.label}>{row.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.button} onClick={onOpenRechargeDialog}>下一步</div>
      <RechargeDialog ref={rechargeRef} />
    </>
  );
};

export default UCurrencyRecharge;
