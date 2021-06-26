import { localStorageGet, localStoragePut } from '@/utils/regular';
import { scoreSmallStatusFormat } from '@/utils/common';

import BasketIcon from '../images/basket.gif';

const TOP_LOCAL_KEY = '_page_basketball_top_match';

// 获取localStorage中的置顶数据
export const getLocalTopObject = () => localStorageGet(TOP_LOCAL_KEY) || {};

// 设置置顶数据到localStorage中
export const setLocalTop = (k) => {
  const obj = getLocalTopObject();
  const isSelect = !!obj[k];
  if (isSelect) {
    delete obj[k];
  } else {
    obj[k] = true;
  }

  localStoragePut(TOP_LOCAL_KEY, obj);

  return obj;
};

// 小状态格式化显示
export const smallStatusFormatter = (status, isNcaaLeague = false) => {
  const { label, disable } = scoreSmallStatusFormat(status);
  const s = Number(status);

  if (disable) return ({ label });

  if (isNcaaLeague) {
    if (s === 11 || s === 12) return ({ label: '上半场', image: BasketIcon });
    if (s === 13 || s === 14) return ({ label: '下半场', image: BasketIcon });
  }

  return ({ label, image: BasketIcon });
};
