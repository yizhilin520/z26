import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useSelector } from 'react-redux';
import CopyToClipboard from 'copy-to-clipboard';
import { getCustomerService } from '@/servers/userServer';
import { useRequest } from '@/utils/hooks';
import Snackbar from '@material-ui/core/Snackbar';
import RenderJudge from '@/components/RenderJudge';
import Dialog from './Dialog';

import QqServiceImage from '../images/qq_service_image.png';
import WxServiceImage from '../images/wx_service_image.png';
import UserIcon from '../images/user_icon.png';
import MoneyIcon from '../images/money_icon.png';
import CardIcon from '../images/card_icon.png';

import styles from '../style/RechargeDialog.scss';

const RechargeDialog = forwardRef((props, ref) => {
  const [message, setMessage] = useState({});
  const [visible, setVisible] = useState(false);
  const { account } = useSelector(({ user }) => user.userInfo || {});
  const [pay, setPay] = useState({ money: 0, type: '支付宝' });
  const { data: list = [] } = useRequest(
    (q) => getCustomerService(q).toPromise(),
    null,
    ({ qqList = [], weList = [] } = {}) => qqList.concat(weList)
  );

  // 打开
  const onOpenHandle = ({ money, type }) => {
    setPay({ money, type });
    return setVisible(true);
  };
  // 关闭
  const onCloseHandle = () => setVisible(false);
  // 复制
  const onCopyHandle = (v) => {
    CopyToClipboard(v);

    setMessage({
      visible: true,
      value: '复制成功，如果失败请手动复制！'
    });
  };

  useImperativeHandle(ref, () => ({
    open: onOpenHandle,
    close: onCloseHandle
  }));

  return (
    <Dialog visible={visible} width={488} onClose={onCloseHandle}>
      <div className={styles.container}>
        <div className={styles.tips}>
          <div className={styles.title}>充值提示</div>
          <div className={styles.content}>充值功能正在升级中，为您带来的不变我们深表歉意~！请联系我们的官方客服对接充值</div>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.title}>01添加客服</div>
          <div className={styles.service}>
            {list.map((row, index) => (
              <div className={styles.item} key={index}>
                <RenderJudge
                  value={row.rechargeAppType === 0}
                  active={<img className={styles.image} src={QqServiceImage} />}
                  inactive={<img className={styles.image} src={WxServiceImage} />}
                />
                <div className={styles.label}>{row.nickname}</div>
                <div className={styles.value}>{row.account}</div>
                <div className={styles.button} onClick={() => onCopyHandle(row.account)}>复制</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.title}>02复制信息发给客服</div>
          <div className={styles.copyBox}>
            <div className={styles.infos}>
              <div className={styles.item}>
                <img src={UserIcon} className={styles.icon} />
                <div className={styles.label}>我的账号：</div>
                <div className={styles.value}>{account}</div>
              </div>
              <div className={styles.item}>
                <img src={MoneyIcon} className={styles.icon} />
                <div className={styles.label}>充值金币：</div>
                <div className={styles.value}>{`${pay.money}金币`}</div>
              </div>
              <div className={styles.item}>
                <img src={CardIcon} className={styles.icon} />
                <div className={styles.label}>支付方式：</div>
                <div className={styles.value}>{pay.type}</div>
              </div>
            </div>
            <div
              className={styles.button}
              onClick={() => onCopyHandle(`我的账号：${account}，充值金币：${pay.money}金币，支付方式：${pay.type}`)}
            >
              复制
            </div>
          </div>
        </div>
        <Snackbar
          autoHideDuration={1000}
          onClose={() => setMessage({})}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={message.visible}
          message={message.value}
          key="default"
        />
      </div>
    </Dialog>
  );
});

export default RechargeDialog;
