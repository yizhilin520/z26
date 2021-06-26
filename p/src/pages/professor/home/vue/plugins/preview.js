import Vue from 'vue';
import { Modal } from 'iview';
import Src from '../components/preview';

const Template = Vue.extend(Src);
let instance;

const Preview = (data) => {
  if (!instance) {
    instance = new Template({
      el: document.createElement('div')
    });
  }

  instance.data = data;

  Vue.nextTick(() => {
    // 调用组件中的方法获取zIndex
    instance.zIndex = Modal.methods.handleGetModalIndex() + 1000;

    instance.visible = true;
    instance.onClose = Preview.close;
  });

  document.body.append(instance.$el);

  return Preview;
};

Preview.close = () => {
  if (!instance) return false;
  instance.visible = false;

  try {
    document.body.removeChild(instance.$el);
  } catch (e) {
    // eslint-disable-next-line
  }
};

export default Preview;
