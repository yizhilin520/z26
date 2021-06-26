import { createContext, useContext } from 'react';
import { empty } from '@/utils/common';

const defaultStore = {
  state: {
    model: {},
    rules: {}
  },
  methods: {
    // 添加字段
    addField: empty,
    // 移除字段
    removeField: empty
  }
};

export const Context = createContext(defaultStore);

export const useStores = () => useContext(Context);
