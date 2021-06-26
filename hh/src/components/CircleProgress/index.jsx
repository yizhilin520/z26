import React from 'react';
import ClassNames from 'classnames';
import { viewSizeFormat } from '@/common/format';
import RenderJudge from '@/components/RenderJudge';

import styles from './style.scss';

const CircleProgress = ({
  className,
  percentage,
  strokeWidth,
  width,
  backgroundColor,
  color,
  strokeLinecap,
  showText,
  reverse
}) => {
  const viewWidth = viewSizeFormat(width);
  const viewStrokeWidth = viewSizeFormat(strokeWidth);
  const relativeStrokeWidth = ((viewSizeFormat(viewStrokeWidth) / viewWidth) * 100).toFixed(1);
  const radius = parseInt(50 - parseFloat(relativeStrokeWidth) / 2, 10);
  const trackPath = `M 50 50 m 0 -${radius} a ${radius} ${radius} 0 1 1 0 ${radius * 2} a ${radius} ${radius} 0 1 1 0 -${radius * 2}`;
  const perimeter = 2 * Math.PI * radius;
  const trailPathStyle = {
    strokeDasharray: `${perimeter}px, ${perimeter}px`
  };
  const circlePathStyle = {
    strokeDasharray: `${perimeter * (percentage / 100)}px, ${perimeter}px`,
    transition: 'stroke-dasharray 0.6s ease 0s, stroke 0.6s ease'
  };
  return (
    <div
      className={ClassNames(styles.container, { [styles.isReverse]: reverse }, className)}
      style={{ width: `${viewWidth}px`, height: `${viewWidth}px` }}
    >
      <svg viewBox="0 0 100 100">
        <path
          d={trackPath}
          stroke={backgroundColor}
          strokeWidth={relativeStrokeWidth}
          fill="none"
          style={trailPathStyle}
        />
        <path
          d={trackPath}
          stroke={color}
          fill="none"
          strokeLinecap={strokeLinecap}
          strokeWidth={percentage ? relativeStrokeWidth : 0}
          style={circlePathStyle}
        />
      </svg>
      <RenderJudge
        value={showText}
        active={(
          <div className={styles.text}>{`${percentage}%`}</div>
        )}
      />
    </div>
  );
};

CircleProgress.defaultProps = {
  percentage: 0,
  strokeWidth: 16,
  width: 200,
  backgroundColor: '#e5e9f2',
  color: '#13ce66',
  strokeLinecap: 'round',
  showText: true
};

export default CircleProgress;
