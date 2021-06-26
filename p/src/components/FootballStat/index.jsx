import React from 'react';
import ClassNames from 'classnames';

import styles from './style.scss';

const Progress = ({ label, leftLabel, leftProgress, rightLabel, rightProgress, textWidth }) => (
  <div className={styles.progress}>
    <div className={ClassNames(styles.progressItem, styles.isLeft)}>
      <div className={styles.progressLabel}>{leftLabel}</div>
      <div className={styles.progressBox}>
        <div className={styles.progressBoxInner} style={{ width: leftProgress }} />
      </div>
    </div>
    <div className={styles.progressText} style={{ width: textWidth }}>{label}</div>
    <div className={ClassNames(styles.progressItem, styles.isRight)}>
      <div className={styles.progressBox}>
        <div className={styles.progressBoxInner} style={{ width: rightProgress }} />
      </div>
      <div className={styles.progressLabel}>{rightLabel}</div>
    </div>
  </div>
);

const FootballStat = ({ data }) => {
  const statistics = data[0] || [];

  const getValuePercentage = (val, totalVal, returnDefault = true) => {
    const result = `${(((val / totalVal) || 0) * 100).toFixed()}%`;
    return returnDefault && !totalVal ? '50%' : result;
  };

  // 控球率
  const homeKql = statistics[10] || 0;
  const guestKql = statistics[11] || 0;
  const totalKql = homeKql + guestKql;
  const homeKqlLabel = getValuePercentage(homeKql, totalKql, false);
  const homeKqlPercentage = totalKql ? homeKqlLabel : '50%';
  const guestKqlLabel = getValuePercentage(guestKql, totalKql, false);
  const guestKqlPercentage = totalKql ? guestKqlLabel : '50%';

  // 进攻
  const homeJg = statistics[18] || 0;
  const guestJg = statistics[19] || 0;
  const totalJg = homeJg + guestJg;
  const homeJgPercentage = getValuePercentage(homeJg, totalJg);
  const guestJgPercentage = getValuePercentage(guestJg, totalJg);

  // 射正球门
  const homeSzqm = statistics[14] || 0;
  const guestSzqm = statistics[15] || 0;
  const totalSzqm = homeSzqm + guestSzqm;
  const homeSzqmPercentage = getValuePercentage(homeSzqm, totalSzqm);
  const guestSzqmPercentage = getValuePercentage(guestSzqm, totalSzqm);

  // 危险进攻
  const homeWxjg = statistics[12] || 0;
  const guestWxjg = statistics[13] || 0;
  const totalWxjg = homeWxjg + guestWxjg;
  const homeWxjgPercentage = getValuePercentage(homeWxjg, totalWxjg);
  const guestWxjgPercentage = getValuePercentage(guestWxjg, totalWxjg);

  // 射偏球门
  const homeSpqm = statistics[16] || 0;
  const guestSpqm = statistics[17] || 0;
  const totalSpqm = homeSpqm + guestSpqm;
  const homeSpqmPercentage = getValuePercentage(homeSpqm, totalSpqm);
  const guestSpqmPercentage = getValuePercentage(guestSpqm, totalSpqm);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.item}>
          <div className={styles.score}>
            <div className={ClassNames(styles.icon, styles.isFlag)} />
            <div className={styles.text}>{statistics[8]}</div>
          </div>
          <div className={styles.score}>
            <div className={ClassNames(styles.icon, styles.isYellow)} />
            <div className={styles.text}>{statistics[6]}</div>
          </div>
          <div className={styles.score}>
            <div className={ClassNames(styles.icon, styles.isRed)} />
            <div className={styles.text}>{statistics[4]}</div>
          </div>
          <div className={styles.score} style={{ marginRight: '-6px' }}>
            <div className={styles.text}>{homeKqlLabel}</div>
          </div>
          <Progress
            label="控球率"
            leftProgress={homeKqlPercentage}
            rightProgress={guestKqlPercentage}
            textWidth="64px"
          />
          <div className={styles.score} style={{ marginLeft: '-6px' }}>
            <div className={styles.text}>{guestKqlLabel}</div>
          </div>
          <div className={styles.score}>
            <div className={ClassNames(styles.icon, styles.isYellow)} />
            <div className={styles.text}>{statistics[7]}</div>
          </div>
          <div className={styles.score}>
            <div className={ClassNames(styles.icon, styles.isRed)} />
            <div className={styles.text}>{statistics[5]}</div>
          </div>
          <div className={styles.score} style={{ marginRight: 0 }}>
            <div className={ClassNames(styles.icon, styles.isFlag)} />
            <div className={styles.text}>{statistics[9]}</div>
          </div>
        </div>
        <div className={styles.item}>
          <Progress
            label="进攻"
            leftLabel={homeJg}
            leftProgress={homeJgPercentage}
            rightLabel={guestJg}
            rightProgress={guestJgPercentage}
          />
          <div className={styles.delimiter} />
          <Progress
            label="射正球门"
            leftLabel={homeSzqm}
            leftProgress={homeSzqmPercentage}
            rightLabel={guestSzqm}
            rightProgress={guestSzqmPercentage}
          />
        </div>
        <div className={styles.item}>
          <Progress
            label="危险进攻"
            leftLabel={homeWxjg}
            leftProgress={homeWxjgPercentage}
            rightLabel={guestWxjg}
            rightProgress={guestWxjgPercentage}
          />
          <div className={styles.delimiter} style={{ marginBottom: 0 }} />
          <Progress
            label="射偏球门"
            leftLabel={homeSpqm}
            leftProgress={homeSpqmPercentage}
            rightLabel={guestSpqm}
            rightProgress={guestSpqmPercentage}
          />
        </div>
      </div>
    </div>
  );
};

FootballStat.defaultProps = {
  data: []
};

export default FootballStat;
