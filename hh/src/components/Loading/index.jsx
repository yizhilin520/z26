import React from 'react';
import ReactDom from 'react-dom';
import RenderJudge from '@/components/RenderJudge';
import ZIndex from '@/components/ZIndex';

import styles from './style.scss';

const Loading = ({ label }) => ReactDom.createPortal((
  <ZIndex className={styles.container} value={ZIndex.value.loading}>
    <div className={styles.circular}>
      <div className={styles.spinner}>
        <svg viewBox="25 25 50 50" className={styles.image}>
          <circle cx="50" cy="50" r="20" fill="none" className={styles.circle} />
        </svg>
      </div>
    </div>
    <RenderJudge
      value={label}
      active={(<div className={styles.text}>{label}</div>)}
    />
  </ZIndex>
), document.body);

Loading.defaultProps = {
  label: '加载中'
};

export default Loading;
