import React, { useMemo } from 'react';
import RenderJudge from '@/components/RenderJudge';
import { getReturnRateLabel, getReturnRateValue, getWinRateLabel } from '../utils/formatter';
import ScoreCompute from '../utils/ScoreCompute';
import Wrapper from './Wrapper';
import Table from './Table';
import Filter from './Filter';

const European = ({ data }) => {
  const maxMinAverageList = useMemo(() => {
    if (!data || !data.length) return [];
    const { max, min, mean } = new ScoreCompute(data);

    return [max, min, mean];
  }, [data]);
  const maxMinAverageTableProps = [{
    value: 'label'
  }, {
    width: 90,
    formatter: () => ['初盘', '即盘']
  }, {
    label: '主胜',
    width: 160,
    formatter: ({ initHome, timelyHome }) => [initHome, timelyHome]
  }, {
    label: '平局',
    width: 160,
    formatter: ({ initSum, timelySum }) => [initSum, timelySum]
  }, {
    label: '客胜',
    width: 160,
    formatter: ({ initGuest, timelyGuest }) => [initGuest, timelyGuest]
  }, {
    label: '主胜率',
    width: 160,
    formatter: ({ initHomePercentage, timelyHomePercentage }) => [initHomePercentage, timelyHomePercentage]
  }, {
    label: '和率',
    width: 160,
    formatter: ({ initSumPercentage, timelySumPercentage }) => [initSumPercentage, timelySumPercentage]
  }, {
    label: '客胜率',
    width: 160,
    formatter: ({ initGuestPercentage, timelyGuestPercentage }) => [initGuestPercentage, timelyGuestPercentage]
  }, {
    label: '返还率',
    width: 160,
    formatter: ({ initRerunPercentage, timelyRerunPercentage }) => [initRerunPercentage, timelyRerunPercentage]
  }];

  const tableProps = [{
    label: '公司',
    formatter: ([, companyName]) => companyName
  }, {
    label: '类型',
    width: 90,
    formatter: () => ['初盘', '即盘']
  }, {
    label: '主胜',
    width: 160,
    arrow: true,
    formatter: ([, , , standardDisk]) => {
      const [, initHome, , , timelyHome] = standardDisk || [];
      return [initHome || '-', timelyHome || '-'];
    }
  }, {
    label: '平局',
    width: 160,
    arrow: true,
    formatter: ([, , , standardDisk]) => {
      const [, , initSum, , , timelySum] = standardDisk || [];
      return [initSum || '-', timelySum || '-'];
    }
  }, {
    label: '客胜',
    width: 160,
    arrow: true,
    formatter: ([, , , standardDisk]) => {
      const [, , , initGuest, , , timelyGuest] = standardDisk || [];
      return [initGuest || '-', timelyGuest || '-'];
    }
  }, {
    label: '主胜率',
    width: 160,
    formatter: ([, , , standardDisk]) => {
      const [, initHome, initSum, initGuest, timelyHome, timelySum, timelyGuest] = standardDisk || [];
      const initReturnVal = getReturnRateValue(initHome, initGuest, initSum);
      const timelyReturnVal = getReturnRateValue(timelyHome, timelyGuest, timelySum);
      return [getWinRateLabel(initReturnVal, initHome), getWinRateLabel(timelyReturnVal, timelyHome)];
    }
  }, {
    label: '和率',
    width: 160,
    formatter: ([, , , standardDisk]) => {
      const [, initHome, initSum, initGuest, timelyHome, timelySum, timelyGuest] = standardDisk || [];
      const initReturnVal = getReturnRateValue(initHome, initGuest, initSum);
      const timelyReturnVal = getReturnRateValue(timelyHome, timelyGuest, timelySum);
      return [getWinRateLabel(initReturnVal, initSum), getWinRateLabel(timelyReturnVal, timelySum)];
    }
  }, {
    label: '客胜率',
    width: 160,
    formatter: ([, , , standardDisk]) => {
      const [, initHome, initSum, initGuest, timelyHome, timelySum, timelyGuest] = standardDisk || [];
      const initReturnVal = getReturnRateValue(initHome, initGuest, initSum);
      const timelyReturnVal = getReturnRateValue(timelyHome, timelyGuest, timelySum);
      return [getWinRateLabel(initReturnVal, initGuest), getWinRateLabel(timelyReturnVal, timelyGuest)];
    }
  }, {
    label: '返还率',
    width: 160,
    formatter: ([, , , standardDisk]) => {
      const [, initHome, initSum, initGuest, timelyHome, timelySum, timelyGuest] = standardDisk || [];
      return [getReturnRateLabel(initHome, initGuest, initSum), getReturnRateLabel(timelyHome, timelyGuest, timelySum)];
    }
  }];

  return (
    <>
      <Wrapper>
        <Filter list={data}>
          {({ list, tableSelectProp }) => (
            <Table props={[{ ...tableSelectProp, width: 70 }].concat(tableProps)} list={list} />
          )}
        </Filter>
      </Wrapper>
      <RenderJudge
        value={maxMinAverageList.length}
        active={(
          <Wrapper style={{ marginTop: '16px' }}>
            <Table props={maxMinAverageTableProps} list={maxMinAverageList} isShowHeader={false} />
          </Wrapper>
        )}
      />
    </>

  );
};

European.defaultProps = {
  data: []
};

export default European;
