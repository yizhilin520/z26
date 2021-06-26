import React from 'react';
import ClassNames from 'classnames';
import { useRequest, useSafeState } from '@/utils/hooks';
import { getBillboard } from '@/servers/homeServer';
import Image from '@/components/Image';
import RenderJudge from '@/components/RenderJudge';
import UserDefaultImage from '@/assets/images/user_default_image.png';
import { useStores } from '../utils/store';

import styles from '../style/Billboard.scss';

const Billboard = () => {
  const { data } = useStores();
  const anchorUserId = data.anchor?.uid;
  const [selectIndex, setSelectIndex] = useSafeState(0);
  // 周榜
  const { data: weekBillboard = [] } = useRequest(
    (q) => anchorUserId && getBillboard(q).toPromise(),
    { anchorUserId, type: 0 }
  );
  // 月榜
  const { data: monthBillboard = [] } = useRequest(
    (q) => anchorUserId && getBillboard(q).toPromise(),
    { anchorUserId, type: 1 }
  );

  if (!weekBillboard.length && !monthBillboard.length) return null;

  const list = [{
    label: '周贡献榜',
    list: weekBillboard
  }, {
    label: '月贡献榜',
    list: monthBillboard
  }];

  const [oneBillboard, twoBillboard, threeBillboard, ...billboardList] = list[selectIndex].list;

  return (
    <>
      <div className={styles.tabs}>
        {list.map((row, index) => (
          <div
            className={ClassNames(styles.tabButton, { [styles.isActive]: selectIndex === index })}
            onClick={() => setSelectIndex(index)}
            key={index}
          >
            {row.label}
          </div>
        ))}
      </div>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <RenderJudge
            value={oneBillboard || twoBillboard || threeBillboard}
            active={[oneBillboard, twoBillboard, threeBillboard].map((row, index) => {
              const className = [styles.isOne, styles.isTwo, styles.isThree][index];
              const rRow = row || {};
              return (
                <RenderJudge
                  key={index}
                  value={row}
                  active={(
                    <div className={ClassNames(styles.rank, className)}>
                      <Image className={styles.rankImage} src={rRow.headImg} defaultImage={UserDefaultImage} />
                      <div className={styles.rankBackground} />
                      <div className={styles.rankUserName}>{rRow.nickName}</div>
                      <div className={styles.rankLabel}>
                        <span className={styles.amountValue}>{rRow.totalAmount}</span>
                        <span className={styles.amountLabel}>贡献值</span>
                      </div>
                    </div>
                  )}
                />
              );
            })}
            inactive={(
              <div className={styles.notBillboard}>打赏主播礼物，上贡献榜！</div>
            )}
          />
        </div>
        <RenderJudge
          value={billboardList.length}
          active={(
            <div className={styles.listWrapper}>
              <div className={styles.list}>
                {billboardList.map((row, index) => (
                  <div className={styles.item} key={index}>
                    <div className={styles.index}>{index + 4}</div>
                    <Image className={styles.userImage} src={row.headImg} defaultImage={UserDefaultImage} />
                    <div className={styles.label}>{row.nickName}</div>
                    <div className={styles.value}>{row.totalAmount}</div>
                    <div className={styles.text}>贡献值</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        />
      </div>
    </>
  );
};

export default Billboard;
