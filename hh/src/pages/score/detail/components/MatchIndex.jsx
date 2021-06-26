import React, { useState } from 'react';
import ClassNames from 'classnames';
import { useRequest } from 'ahooks';
import { getMatchOdds } from '@/services/sports';
import RenderJudge from '@/components/RenderJudge';
import { Cell, Header, Row } from './Table';
import GuideDownload from './GuideDownload';

import styles from '../style/MatchIndex.scss';

const MatchIndex = ({ data }) => {
  const [matchId, , , , , , sportType] = data;
  const [tabIndex, setTabIndex] = useState(0);

  const { data: oddsData } = useRequest(
    () => getMatchOdds({ match_id: matchId }),
    {
      initialData: []
    }
  );

  // 是否是足球
  const isFootball = sportType === 1;

  const tabList = [{
    label: '让分',
    component: (
      <>
        <Header
          list={[{
            label: '公司'
          }, {
            width: 86
          }, {
            label: '初盘',
            width: 86
          }, {
            width: 86
          }, {
            width: 86
          }, {
            label: '即时盘',
            width: 86
          }, {
            width: 86
          }]}
        />
        {oddsData.map((row, index) => {
          const [, companyName, handicap] = row || [];
          const [, initHome, initIndex, initGuest, timelyHome, timelyIndex, timelyGuest] = handicap || [];
          return (
            <Row key={index}>
              <Cell text={companyName} borderAlign="right" />
              <Cell text={initHome} width={86} />
              <Cell text={initIndex} width={86} />
              <Cell text={initGuest} width={86} borderAlign="right" />
              <Cell text={timelyHome} width={86} color="#17be2c" />
              <Cell text={timelyIndex} width={86} color="#17be2c" />
              <Cell text={timelyGuest} width={86} color="#ff3434" />
            </Row>
          );
        })}
      </>
    )
  }, {
    label: isFootball ? '欧赔' : '欧指',
    component: (
      <>
        <Header
          list={[{
            label: '公司'
          }, {
            width: isFootball ? 126 : 180
          }, {
            label: '主胜',
            width: isFootball ? 126 : 180
          }, isFootball && {
            label: '平局',
            width: isFootball ? 126 : 180
          }, {
            label: '客胜',
            width: isFootball ? 126 : 180
          }].filter(Boolean)}
        />
        {oddsData.map((row, index) => {
          const [, companyName, , standardDisk] = row || [];
          const [, initHome, initSum, initGuest, timelyHome, timelySum, timelyGuest] = standardDisk || [];
          return (
            <Row key={index}>
              <Cell text={companyName} rows={2} borderAlign="right" />
              <Cell
                text={[{ label: '初盘', borderAlign: 'bottom' }, '即盘']}
                borderAlign="right"
                width={isFootball ? 126 : 180}
                rows={2}
              />
              <Cell
                text={[{ label: initHome, borderAlign: 'bottom' }, { label: timelyHome, color: '#ff3434' }]}
                borderAlign="right"
                width={isFootball ? 126 : 180}
                rows={2}
              />
              <RenderJudge
                value={isFootball}
                active={(
                  <Cell
                    text={[{ label: initSum, borderAlign: 'bottom' }, { label: timelySum, color: '#ff3434' }]}
                    borderAlign="right"
                    width={126}
                    rows={2}
                  />
                )}
              />
              <Cell
                text={[{ label: initGuest, borderAlign: 'bottom' }, { label: timelyGuest, color: '#17be2c' }]}
                width={isFootball ? 126 : 180}
                rows={2}
              />
            </Row>
          );
        })}
      </>
    )
  }, {
    label: isFootball ? '大小' : '总分',
    component: (
      <>
        <Header
          list={[{
            label: '公司'
          }, {
            width: 86
          }, {
            label: '初盘',
            width: 86
          }, {
            width: 86
          }, {
            width: 86
          }, {
            label: '即时盘',
            width: 86
          }, {
            width: 86
          }]}
        />
        {oddsData.map((row, index) => {
          const [, companyName, , , bigSmall] = row || [];
          const [, initBig, initBigSmall, initSmall, timelyBig, timelyBigSmall, timelySmall] = bigSmall || [];
          return (
            <Row key={index}>
              <Cell text={companyName} borderAlign="right" />
              <Cell text={initBig} width={86} />
              <Cell text={initBigSmall} width={86} />
              <Cell text={initSmall} width={86} borderAlign="right" />
              <Cell text={timelyBig} width={86} />
              <Cell text={timelyBigSmall} width={86} />
              <Cell text={timelySmall} width={86} />
            </Row>
          );
        })}
      </>
    )
  }];
  const { component } = tabList[tabIndex];
  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {tabList.map((row, index) => (
          <div
            className={ClassNames(styles.item, { [styles.isActive]: index === tabIndex })}
            onClick={() => setTabIndex(index)}
            key={index}
          >
            {row.label}
          </div>
        ))}
      </div>
      <div className={styles.wrapper}>
        {component}
      </div>
      <GuideDownload />
    </div>
  );
};

export default MatchIndex;
