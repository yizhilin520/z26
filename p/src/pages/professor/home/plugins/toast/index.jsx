import React from 'react';
import { render } from 'react-dom';
import Toast from './Toast';

let instance;
let timer;
const ToastInstance = (options) => {
  let opt = options;
  if (typeof options === 'string') opt = { text: options };

  if (!instance) instance = document.createElement('div');

  const { text, duration = 4000 } = opt || {};

  render(<Toast text={text} />, instance);

  clearTimeout(timer);
  if (duration) timer = setTimeout(ToastInstance.close, duration);

  document.body.appendChild(instance);

  return ToastInstance;
};

ToastInstance.close = () => {
  if (!instance) return false;
  document.body.removeChild(instance);
};

export default ToastInstance;
