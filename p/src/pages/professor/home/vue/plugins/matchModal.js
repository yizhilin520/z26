/**
 * @intro: 用于赛事选择.
 */
import Vue from 'vue';
import {Modal} from 'iview'
import Src from '../components/matchModal';

const empty = () => {
};
const Template = Vue.extend(Src);
let instance;

const MatchInstance = (options) => {
  if (typeof options === 'number') options = { playType: options };

  if (!instance) {
    instance = new Template({
      el: document.createElement('div')
    });
  }

  Vue.nextTick(() => {
    // playType 1竞彩足球；2足球让球；3足球大小；4竞彩篮球；5篮球让分；6篮球大小分
    // activeIds 已经选择的id
    const { playType, activeIds = [], tipsLabel, userId, onCancel = empty, onConfirm = empty } = options || {};
    instance.onCancel = () => {
      MatchInstance.close();
      onCancel();
    };
    instance.onConfirm = (data) => {
      MatchInstance.close();
      onConfirm(data);
    };
    // 调用组件中的方法获取zIndex
    instance.zIndex = Modal.methods.handleGetModalIndex() + 1000

    // 已经选择的赛事ids
    instance.activeIds = activeIds;

    instance.tipsLabel = tipsLabel;

    instance.userId = userId;

    instance.initPageParams(playType);
  });

  document.body.appendChild(instance.$el);

  return MatchInstance;
};

MatchInstance.close = () => {
  if (!instance) return false;
  document.body.removeChild(instance.$el);
  instance.visible = false;
};

export default MatchInstance;
