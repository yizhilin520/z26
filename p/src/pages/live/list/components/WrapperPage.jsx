import React from 'react';
import RenderJudge from '@/components/RenderJudge';
import MatchList from './MatchList';
import Content from './Content';

const WrapperPage = ({ sportId, sportName }) => {
  const showMatchList = /^(1|2)$/.test(sportId);

  return (
    <>
      <RenderJudge
        value={showMatchList}
        active={(
          <MatchList sportId={sportId} />
        )}
      />
      <Content title={sportName} value={sportId} pageSize={showMatchList ? 24 : 30} />
    </>
  );
};

export default WrapperPage;
