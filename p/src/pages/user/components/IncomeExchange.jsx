import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import CopyToClipboard from 'copy-to-clipboard';
import { useRequest } from 'ahooks';
import { HttpCode } from '@/enums';
import { getHiddenNumber } from '@/utils/common';
import { useSnackbar } from '@/plugins';
import RenderJudge from '@/components/RenderJudge';
import Iconfont from '@/components/Iconfont';
import BindBankCard from '@/components/BindBankCard';
import { applyWithdraw, getUserQueryWallet } from '@/servers/userServer';
import UpdatePhone from './UpdatePhone';

import styles from '../style/IncomeExchange.scss';

// 收益兑换主页
const IncomeExchangeHomeView = ({ data, withdrawType, onChange, onLoadPage }) => {
  const { identityType } = useSelector(({ user }) => user.userInfo || {});
  const { enqueueSnackbar } = useSnackbar();
  const phoneRef = useRef();

  // 礼物收益
  const giftMoney = data.giftGoldNum || 0;
  // 带货收益
  const bringGoodsMoney = data.planGoldNumCom || 0;
  // 红单出售收益
  const planGoldNum = data.planGoldNumCom || 0;
  // 礼物和带货收益总金额
  const giftAndBringGoodsTotalMoney = giftMoney + bringGoodsMoney;

  // 复制
  const onCopyHandle = () => {
    if (!data.customerQQ) return;

    CopyToClipboard(data.customerQQ);
    enqueueSnackbar('复制成功，如果失败请手动复制！');
  };

  // 兑换
  const onConvertHandle = () => {
    if (giftAndBringGoodsTotalMoney < 100) return enqueueSnackbar('低于100元不可兑换');

    return onChange('convert');
  };

  // 绑定
  const onBindChangeHandle = () => {
    if (!identityType) return enqueueSnackbar(`请联系客服QQ进行实名认证：${data.customerQQ || ''}`);
    if (!data.mobilePhone) return phoneRef.current.open();
    return onChange('bind');
  };

  const ButtonStatus = () => {
    // 未绑卡
    if (!data.bindCardStatus) return (<div className={styles.submit} onClick={onBindChangeHandle}>绑定收款信息</div>);

    return (
      <>
        <RenderJudge
          value={data.exchangeOpenStatus}
          active={(<div className={styles.submit} onClick={onConvertHandle}>兑换</div>)}
          // 兑换未开启
          inactive={(
            <div className={ClassNames(styles.submit, styles.isDisable)}>兑换未开启</div>
          )}
        />
        <div className={styles.bankCard} onClick={() => onChange('bind')}>更换银行卡</div>
      </>
    );
  };

  return (
    <>
      <RenderJudge
        value={withdrawType === 1}
        active={(
          <div className={styles.exchangeContent}>
            <div className={ClassNames(styles.totalMoney, styles.isCenter)}>
              <div className={styles.totalLabel}>收益兑换余额 (税前)：</div>
              <div className={styles.totalValue}>{`${giftAndBringGoodsTotalMoney}元`}</div>
            </div>
            <div className={styles.moneyBox}>
              <div className={styles.moneyItem}>
                <div className={styles.moneyValue}>{giftMoney}</div>
                <div className={styles.moneyLabel}>礼物收益</div>
              </div>
              <div className={styles.moneyItem}>
                <div className={styles.moneyValue}>{bringGoodsMoney}</div>
                <div className={styles.moneyLabel}>带货收益</div>
              </div>
            </div>
            <div className={styles.timeRemark}>{data.exchangeTimeRemark}</div>
          </div>
        )}
      />
      <RenderJudge
        value={withdrawType === 2}
        active={(
          <div className={styles.totalMoney}>
            <div className={styles.totalLabel}>收益兑换余额 (税前)：</div>
            <div className={styles.totalValue}>{`${planGoldNum}元`}</div>
          </div>
        )}
      />
      <div className={ClassNames(styles.buttons, { [styles.isBigMarginTop]: withdrawType === 2 })}>
        <ButtonStatus />
      </div>
      <RenderJudge
        value={withdrawType === 2}
        active={(
          <div className={styles.timeRemarkLabel}>{data.exchangeTimeRemark}</div>
        )}
      />
      <div className={styles.service}>
        <div className={styles.serviceIcon} />
        <div className={styles.serviceLabel}>{`联系客服QQ：${data.customerQQ || ''}`}</div>
        <div className={styles.serviceCopy} onClick={onCopyHandle}>复制</div>
      </div>
      <UpdatePhone ref={phoneRef} onSubmit={onLoadPage} />
    </>
  );
};
// 收益兑换绑定银行卡
const IncomeExchangeBindView = ({ data, onChange, onLoadPage }) => {
  const onChangeHandle = () => onChange('home');

  const onSubmitHandle = () => {
    onLoadPage();
    return onChangeHandle();
  };

  const userCard = data.userCard || {};
  return (
    <>
      <div className={styles.back} onClick={onChangeHandle}>
        <Iconfont className={styles.backIcon} name="bp_ee" />
        <RenderJudge
          value={data.userCard}
          active={(
            <div className={styles.backLabel}>更换银行卡</div>
          )}
          inactive={(
            <div className={styles.backLabel}>绑定银行卡</div>
          )}
        />
      </div>
      <BindBankCard
        data={{ ...userCard, idCard: data.idCard, idName: data.idName, mobilePhone: data.mobilePhone }}
        onSubmit={onSubmitHandle}
      />
    </>
  );
};
// 收益兑换兑换视图
const IncomeExchangeConvertView = ({ data, withdrawType, onChange, onLoadPage }) => {
  const { enqueueSnackbar } = useSnackbar();

  // 礼物收益
  const giftMoney = data.giftGoldNum || 0;
  // 带货收益
  const bringGoodsMoney = data.planGoldNumCom || 0;
  // 红单出售收益
  const planGoldNum = data.planGoldNumCom || 0;
  // 礼物和带货收益总金额
  const giftAndBringGoodsTotalMoney = giftMoney + bringGoodsMoney;
  const userCard = data.userCard || {};
  const { cardNo } = userCard;

  const onChangeHandle = () => onChange('home');

  const onSubmitHandle = async () => {
    const params = { amount: giftAndBringGoodsTotalMoney, withdrawType };
    const { data: { code, msg } } = await applyWithdraw(params).toPromise();

    if (HttpCode.SUCCESS === code) {
      enqueueSnackbar('我们已收到您的申请，系统处理中...');
      onLoadPage();
      return onChangeHandle();
    }

    return enqueueSnackbar(msg);
  };

  return (
    <>
      <div className={styles.back} onClick={onChangeHandle}>
        <Iconfont className={styles.backIcon} name="bp_ee" />
        <div className={styles.backLabel}>返回</div>
      </div>
      <div className={styles.convertView}>
        <div className={styles.bankNo}>
          <span>提现到银行卡：</span>
          <span className={styles.bankLabel}>{getHiddenNumber(cardNo, 4, 4)}</span>
        </div>
        <div className={styles.inputMoney}>{`¥ ${giftAndBringGoodsTotalMoney}`}</div>
        <div className={styles.moneyTips}>
          <span>余额：</span>
          <span className={styles.tipsLabel}>{`${giftAndBringGoodsTotalMoney}元`}</span>
          <span> （因国家增值税要求，实际金额已到账金额为准）</span>
        </div>
        <div className={ClassNames(styles.buttons, styles.isCenter)}>
          <div className={styles.submit} onClick={onSubmitHandle}>提取</div>
        </div>
        <div className={styles.protocol}>
          <span>兑换即代表您已了解并同意</span>
          <Link to="/protocol/convert" target="_blank" className={styles.link}>《兑换协议》</Link>
        </div>
      </div>
    </>
  );
};
// 收益兑换
const IncomeExchange = ({ withdrawType }) => {
  const [view, setView] = useState('home');
  const { data = {}, loading, refresh } = useRequest(() => getUserQueryWallet(null).toPromise());

  const onChangeViewHandle = (v) => setView(v);

  if (loading) return null;

  return (
    <div className={styles.container}>
      <RenderJudge
        value={view === 'home'}
        active={(
          <IncomeExchangeHomeView
            data={data}
            onLoadPage={refresh}
            onChange={onChangeViewHandle}
            withdrawType={withdrawType}
          />
        )}
      />
      <RenderJudge
        value={view === 'bind'}
        active={(
          <IncomeExchangeBindView
            data={data}
            onLoadPage={refresh}
            onChange={setView}
          />
        )}
      />
      <RenderJudge
        value={view === 'convert'}
        active={(
          <IncomeExchangeConvertView
            data={data}
            onLoadPage={refresh}
            onChange={setView}
            withdrawType={withdrawType}
          />
        )}
      />
    </div>
  );
};

IncomeExchange.propTypes = {
  withdrawType: PropTypes.number.isRequired
};

export default IncomeExchange;
