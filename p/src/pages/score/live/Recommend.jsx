import React from 'react';
import ListVideoCard from '@/components/ListVideoCard';

const Recommend = ({ list }) => (
  <ListVideoCard
    style={{ padding: '50px 100px' }}
    list={list.slice(0, 9)}
    marginTop={18}
    marginLeft={18}
    rows={3}
  />
);

Recommend.defaultProps = {
  list: []
};

export default Recommend;
