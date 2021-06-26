import ReactDOM from 'react-dom';
import { addOnceEventListener } from '@/utils/common';
import styles from '../style/Danmaku.scss';

const DEFAULT_OPTIONS = {
  height: 32,
  duration: 8
};

class Danmaku {
  constructor(container, options) {
    this.container = container;
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options || {}
    };
    this.danTunnel = {};
  }

  /**
   * @param {Object} dan - {text, border}
   * text - 内容
   * border - 是否显示边框
   */
  push(dan) {
    if (!dan) return;
    const { text, border, style } = dan || {};

    const { container, options, danTunnel } = this;
    const { offsetWidth, offsetHeight } = container;
    const { height, duration } = options;

    const itemY = Math.floor(offsetHeight / height);

    const danItemRight = (ele) => {
      // eslint-disable-next-line radix
      const eleWidth = ele.offsetWidth || parseInt(ele.style.width);
      const eleRight = ele.getBoundingClientRect().right || container.getBoundingClientRect().right + eleWidth;
      return container.getBoundingClientRect().right - eleRight;
    };

    const danSpeed = (width) => (offsetWidth + width) / duration;

    const getTunnel = (ele, width) => {
      const tmp = offsetWidth / danSpeed(width);

      for (let i = 0; i < itemY; i += 1) {
        const item = danTunnel[`${i}`];
        if (item && item.length) {
          for (let j = 0; j < item.length; j += 1) {
            const danRight = danItemRight(item[j]) - 10;
            // eslint-disable-next-line radix
            if (danRight <= offsetWidth - tmp * danSpeed(parseInt(item[j].style.width)) || danRight <= 0) {
              break;
            }
            if (j === item.length - 1) {
              this.danTunnel[`${i}`].push(ele);
              addOnceEventListener(ele, 'animationend', () => {
                this.danTunnel[`${i}`].splice(0, 1);
                container.removeChild(ele);
              });
              return i % itemY;
            }
          }
        } else {
          this.danTunnel[`${i}`] = [ele];
          addOnceEventListener(ele, 'animationend', () => {
            this.danTunnel[`${i}`].splice(0, 1);
            container.removeChild(ele);
          });
          return i % itemY;
        }
      }
      return -1;
    };

    const docFragment = document.createDocumentFragment();
    const danEl = document.createElement('div');

    danEl.classList.add(styles.item);
    if (border) danEl.classList.add(styles.isBorder);
    if (typeof text === 'string') {
      // html string
      danEl.innerHTML = text;
    } else {
      // react component
      ReactDOM.render(text, danEl);
    }

    // insert
    docFragment.appendChild(danEl);
    container.appendChild(docFragment);

    const itemWidth = danEl.clientWidth || 0;
    const tunnel = getTunnel(danEl, itemWidth);

    if (tunnel >= 0) {
      const danStyle = {
        ...style || {},
        height: `${height}px`,
        lineHeight: `${height}px`,
        top: `${height * tunnel}px`,
        animationDuration: `${duration}s`,
        transform: `translate3d(-${Math.ceil(offsetWidth)}px, 0, 0)`
      };
      Object.keys(danStyle).forEach((name) => {
        danEl.style[name] = danStyle[name];
      });
      danEl.classList.add(styles.isMove);
    } else {
      console.log('not appendChild')
      container.removeChild(danEl);
    }

    return docFragment;
  }
}

export default Danmaku;
