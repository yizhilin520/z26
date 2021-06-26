import React, { useState } from 'react';
import ClassNames from 'classnames';

import RenderJudge from '@/components/RenderJudge';
import NotData from '@/components/NotData';
import ListVideoCard from '@/components/ListVideoCard';

import { useInterval, useRequest } from '@/utils/hooks';
import { getLiveList } from '@/servers/homeServer';
import Section from './Section';

import styles from '../style/MatchClassify.scss';

const MatchClassify = ({ image, label, liveType }) => {
  const typeObj = {
    1: '足球',
    2: '篮球',
    3: '电竞',
    100: '娱乐'
  };
  const liveTypeArr = (Array.isArray(liveType) ? liveType : [liveType]).map((type) => ({
    label: typeObj[type],
    value: type
  }));

  const baseQuery = { page: 1, size: 10 };
  const [selectIndex, setSelectIndex] = useState(0);
  const currentSelect = liveTypeArr[selectIndex];
  const { data = {}, mutate, loading } = useRequest(
    (q) => getLiveList(q).toPromise(),
    { ...baseQuery, liveTypeId: currentSelect.value }
  );

  useInterval(mutate, !loading ? 60000 * 2 : null);

  const list = data.rows || [];

  const onSetIndexHandle = (i, liveTypeId) => {
    if (selectIndex === i) return;
    setSelectIndex(i);
    return mutate({ ...baseQuery, liveTypeId });
  };

  if (!list.length && liveTypeArr.length < 2) return null;

  return (
    <Section>
      <div className={styles.title}>
        <RenderJudge
          value={image}
          active={<img className={styles.image} alt={label} src={image} />}
        />
        <div className={styles.label}>{label}</div>
        <RenderJudge
          value={liveTypeArr.length > 1}
          active={liveTypeArr.map((row, index) => (
            <div
              className={ClassNames(styles.button, { [styles.isActive]: index === selectIndex })}
              onClick={() => onSetIndexHandle(index, row.value)}
              key={index}
            >
              <div className={styles.buttonText}>
                {row.label}
              </div>
            </div>
          ))}
        />
      </div>
      <RenderJudge
        value={list.length}
        active={(<ListVideoCard list={list} />)}
        inactive={(
          <RenderJudge
            value={!loading}
            active={<NotData />}
          />
        )}
      />
    </Section>
  );
};

MatchClassify.defaultProps = {
  image: null,
  label: null,
  liveType: null
};

export default MatchClassify;
