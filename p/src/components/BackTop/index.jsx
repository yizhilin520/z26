import React from 'react';
import PropTypes from 'prop-types';
import { empty } from '@/utils/common';
import { useScroll } from '@/utils/hooks';

const cubic = (value) => value ** 3;
const easeInOutCubic = (value) => (value < 0.5
  ? cubic(value * 2) / 2
  : 1 - cubic((1 - value) * 2) / 2);

const BackTop = ({ tag, visibilityHeight, onClick, className, children, ...props }) => {
  const { documentElement, body } = document;
  const { top } = useScroll();

  const visible = top >= visibilityHeight;

  const scrollToTop = () => {
    const beginTime = Date.now();
    const beginValue = body.scrollTop || documentElement.scrollTop;
    const rAF = window.requestAnimationFrame || ((func) => setTimeout(func, 16));
    const frameFunc = () => {
      const progress = (Date.now() - beginTime) / 500;
      let scrollTop;
      if (progress < 1) {
        scrollTop = beginValue * (1 - easeInOutCubic(progress));
        rAF(frameFunc);
      } else {
        scrollTop = 0;
      }
      documentElement.scrollTop = scrollTop;
      body.scrollTop = scrollTop;
    };
    rAF(frameFunc);
  };

  const handleClick = (e) => {
    scrollToTop();
    onClick(e);
  };

  if (!visible) return null;

  return React.createElement(
    tag,
    { ...props || {}, className, onClick: handleClick },
    children
  );
};

BackTop.defaultProps = {
  tag: 'div',
  visibilityHeight: 200,
  onClick: empty
};

BackTop.propTypes = {
  tag: PropTypes.string,
  visibilityHeight: PropTypes.number,
  onClick: PropTypes.func
};
export default BackTop;
