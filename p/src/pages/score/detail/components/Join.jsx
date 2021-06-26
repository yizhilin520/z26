import React from 'react';
import Wrapper from './Wrapper';
import Table from './Table';

const Join = ({ data }) => {
  const tableProps = [{
    label: '公司',
    formatter: ([, companyName]) => companyName
  }, {
    label: '类型',
    width: 90,
    formatter: () => ['初盘', '即盘']
  }, {
    label: ['', '主胜'],
    width: 130,
    arrow: true,
    formatter: ([, , , standardDisk]) => {
      const [, initHome, , , timelyHome] = standardDisk || [];
      return [initHome || '-', timelyHome || '-'];
    }
  }, {
    label: ['欧指', '平局'],
    width: 130,
    arrow: true,
    formatter: ([, , , standardDisk]) => {
      const [, , initSum, , , timelySum] = standardDisk || [];
      return [initSum || '-', timelySum || '-'];
    }
  }, {
    label: ['', '客胜'],
    width: 130,
    arrow: true,
    formatter: ([, , , standardDisk]) => {
      const [, , , initGuest, , , timelyGuest] = standardDisk || [];
      return [initGuest || '-', timelyGuest || '-'];
    }
  }, {
    label: ['', '主胜'],
    width: 130,
    arrow: true,
    formatter: ([, , handicap]) => {
      const [, initHome, , , timelyHome] = handicap || [];
      return [initHome || '-', timelyHome || '-'];
    }
  }, {
    label: ['让球', '让'],
    width: 130,
    arrow: true,
    formatter: ([, , handicap]) => {
      const [, , initIndex, , , timelyIndex] = handicap || [];
      return [initIndex || '-', timelyIndex || '-'];
    }
  }, {
    label: ['', '客胜'],
    width: 130,
    arrow: true,
    formatter: ([, , handicap]) => {
      const [, , , initGuest, , , timelyGuest] = handicap || [];
      return [initGuest || '-', timelyGuest || '-'];
    }
  }, {
    label: ['', '大'],
    width: 130,
    arrow: true,
    formatter: ([, , , , bigSmall]) => {
      const [, initBig, , , timelyBig] = bigSmall || [];
      return [initBig || '-', timelyBig || '-'];
    }
  }, {
    label: ['大小', '进球'],
    width: 130,
    arrow: true,
    formatter: ([, , , , bigSmall]) => {
      const [, , initBigSmall, , , timelyBigSmall] = bigSmall || [];
      return [initBigSmall || '-', timelyBigSmall || '-'];
    }
  }, {
    label: ['', '小'],
    width: 130,
    arrow: true,
    formatter: ([, , , , bigSmall]) => {
      const [, , , initSmall, , , timelySmall] = bigSmall || [];
      return [initSmall || '-', timelySmall || '-'];
    }
  }];
  return (
    <Wrapper>
      <Table props={tableProps} list={data} />
    </Wrapper>
  );
};

Join.defaultProps = {
  data: []
};

export default Join;
