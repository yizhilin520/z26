import React from 'react';
import { time as timeFormat } from '@/utils/regular';
import Wrapper from './Wrapper';
import Table from './Table';
import Filter from './Filter';

const Size = ({ data }) => {
  const tableProps = [{
    label: '公司',
    formatter: ([, companyName]) => companyName
  }, {
    label: '大球',
    width: 160,
    arrow: true,
    formatter: ([, , , , bigSmall]) => {
      const [, , , , timelyBig] = bigSmall || [];
      return timelyBig || '-';
    }
  }, {
    label: '即时',
    width: 100,
    arrow: true,
    style: { color: '#f74a4a', backgroundColor: 'rgba(247,74,74,.08)' },
    formatter: ([, , , , bigSmall]) => {
      const [, , , , , timelyBigSmall] = bigSmall || [];
      return timelyBigSmall || '-';
    }
  }, {
    label: '小球',
    width: 160,
    arrow: true,
    formatter: ([, , , , bigSmall]) => {
      const [, , , , , , timelySmall] = bigSmall || [];
      return timelySmall || '-';
    }
  }, {
    label: '大球',
    width: 160,
    arrow: true,
    formatter: ([, , , , bigSmall]) => {
      const [, initBig] = bigSmall || [];
      return initBig || '-';
    }
  }, {
    label: '初盘',
    width: 100,
    style: { color: '#f74a4a', backgroundColor: 'rgba(247,74,74,.08)' },
    arrow: true,
    formatter: ([, , , , bigSmall]) => {
      const [, , initBigSmall] = bigSmall || [];
      return initBigSmall || '-';
    }
  }, {
    label: '小球',
    width: 160,
    arrow: true,
    formatter: ([, , , , bigSmall]) => {
      const [, , , initSmall] = bigSmall || [];
      return initSmall || '-';
    }
  }, {
    label: '变化时间',
    width: 160,
    formatter: ([, , , , bigSmall]) => {
      const [, , , , , , , changeTime] = bigSmall || [];
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

Size.defaultProps = {
  data: []
};

export default Size;
