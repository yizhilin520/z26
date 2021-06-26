import React from 'react';
import { time as timeFormat } from '@/utils/regular';
import Wrapper from './Wrapper';
import Table from './Table';
import Filter from './Filter';

const Handicap = ({ data }) => {
  const tableProps = [{
    label: '公司',
    formatter: ([, companyName]) => companyName
  }, {
    label: '主队',
    width: 160,
    arrow: true,
    formatter: ([, , handicap]) => {
      const [, , , , timelyHome] = handicap || [];
      return timelyHome || '-';
    }
  }, {
    label: '即时',
    width: 100,
    style: { color: '#f74a4a', backgroundColor: 'rgba(247,74,74,.08)' },
    arrow: true,
    formatter: ([, , handicap]) => {
      const [, , , , , timelyIndex] = handicap || [];
      return timelyIndex || '-';
    }
  }, {
    label: '客队',
    width: 160,
    arrow: true,
    formatter: ([, , handicap]) => {
      const [, , , , , , timelyGuest] = handicap || [];
      return timelyGuest || '-';
    }
  }, {
    label: '主队',
    width: 160,
    arrow: true,
    formatter: ([, , handicap]) => {
      const [, initHome] = handicap || [];
      return initHome || '-';
    }
  }, {
    label: '初盘',
    width: 100,
    style: { color: '#f74a4a', backgroundColor: 'rgba(247,74,74,.08)' },
    arrow: true,
    formatter: ([, , handicap]) => {
      const [, , initIndex] = handicap || [];
      return initIndex || '-';
    }
  }, {
    label: '客队',
    width: 160,
    arrow: true,
    formatter: ([, , handicap]) => {
      const [, , , initGuest] = handicap || [];
      return initGuest || '-';
    }
  }, {
    label: '变化时间',
    width: 160,
    formatter: ([, , handicap]) => {
      const [, , , , , , , changeTime] = handicap || [];
      return changeTime ? timeFormat(changeTime) : '-';
    }
  }];

  return (
    <Wrapper>
      <Filter list={data}>
        {({ list, tableSelectProp }) => (
          <Table props={[tableSelectProp].concat(tableProps)} list={list} />
        )}
      </Filter>
    </Wrapper>
  );
};

Handicap.defaultProps = {
  data: []
};

export default Handicap;
