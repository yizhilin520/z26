import React from 'react';
import { render } from 'react-dom';
import Modal from './Modal';

let instance;

const argsHandler = (options) => {
  let opt = options;
  if (typeof options === 'string') opt = { text: options };
  return opt;
};

const ModalInstance = (options) => {
  const opt = argsHandler(options);
  if (!instance) instance = document.createElement('div');

  const { text, title, showCancel = false, onCancel, onConfirm } = opt || {};

  render(<Modal
    text={text}
    title={title}
    showCancel={showCancel}
    onCancel={() => {
      ModalInstance.close();
      if (onCancel) onCancel();
    }}
    onConfirm={() => {
      ModalInstance.close();
      if (onConfirm) onConfirm();
    }}
  />, instance);

  document.body.appendChild(instance);

  return ModalInstance;
};

ModalInstance.confirm = (options) => {
  const opt = argsHandler(options);
  opt.showCancel = true;
  return ModalInstance(opt);
};

ModalInstance.alert = (options) => {
  const opt = argsHandler(options);
  opt.showCancel = false;
  return ModalInstance(opt);
};

ModalInstance.close = () => {
  if (!instance) return false;
  document.body.removeChild(instance);
};

export default ModalInstance;
