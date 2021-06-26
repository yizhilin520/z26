import ReactDOM from 'react-dom';
import React from 'react';

export default {
  name: 'React2Vue',
  inheritAttrs: false,
  props: {
    component: null
  },
  beforeMount() {
    this.$nextTick(() => {
      const { component, $attrs, $el } = this;

      ReactDOM.render(React.createElement(component, $attrs), $el);
    });
  },
  beforeDestroy() {
    ReactDOM.unmountComponentAtNode(this.$el);
  },
  render(createElement) {
    return createElement('div');
  }
};
