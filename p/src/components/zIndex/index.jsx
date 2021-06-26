import React from 'react';
import PropTypes from 'prop-types';

const defaultZIndex = 1000;
const vars = {
  normal: defaultZIndex,
  header: defaultZIndex + 1,
  sideTools: defaultZIndex + 2,
  shade: defaultZIndex + 3,
  dialog: defaultZIndex + 4,
  toast: defaultZIndex + 5
};

const ZIndex = ({ tag, value, className, style, children, ...props }) => React.createElement(
  tag,
  { ...props || {}, className, style: { ...style || {}, zIndex: value } },
  children
);

ZIndex.defaultProps = {
  tag: 'div',
  value: vars.normal
};

ZIndex.propTypes = {
  value: PropTypes.number
};

ZIndex.value = vars;

export default ZIndex;
