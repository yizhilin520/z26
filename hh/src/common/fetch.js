/**
 * @intro: http统一封装,同时支持callback模式调用.
 */
import axios from 'axios';
import Store from '@/store';
import { isFormData, judgeCode } from './verify';
// eslint-disable-next-line import/no-cycle
import { uuid as generateUUID } from './utils';

/**
 * 获取一个device id
 */
export const getDeviceId = () => {
  // 客户端
  const deviceIdKey = 'x-device-id';
  const deviceIdStore = localStorage.getItem(deviceIdKey);
  if (deviceIdStore) return deviceIdStore;
  const uuid = generateUUID();
  localStorage.setItem(deviceIdKey, uuid);
  return uuid;
};

const service = axios.create({
  // 设置全局默认的headers
  headers: {
    'Content-Type': 'application/json'
  },
  // 设置请求超时设置
  timeout: 30000,
  responseType: 'json',
  // 请求转换
  transformRequest: [
    (data, headers) => {
      // eslint-disable-next-line no-param-reassign
      if (isFormData(data)) headers['Content-Type'] = 'multipart/form-data';
      // eslint-disable-next-line no-param-reassign
      headers['hq-deviceId'] = getDeviceId();
      // eslint-disable-next-line no-param-reassign
      if (!headers['hq-source']) headers['hq-source'] = 3;
      // eslint-disable-next-line no-param-reassign
      headers['client-type'] = 'h5';
      const { token } = Store.getState()?.user || {};
      // eslint-disable-next-line no-param-reassign
      headers.Authorization = token;

      try {
        return JSON.stringify(data);
      } catch (e) {
        return data;
      }
    }
  ]
});

// response拦截
service.interceptors.response.use(
  (response) => {
    const { data = {} } = response;

    if (judgeCode(data.code)) {
      // 请求成功
      return data;
    }

    // eslint-disable-next-line
    return Promise.reject({
      ...data,
      type: 'business'
    });
  },
  (err) => {
    const resError = err.response || {};
    const { data } = resError;
    if (data) {
      // eslint-disable-next-line
      return Promise.reject({
        ...data,
        type: 'business'
      });
    }

    const errorObj = {
      code: resError.status || '500',
      message: err.message || 'System Busy!'
    };
    const type = 'system';

    // eslint-disable-next-line
    return Promise.reject({
      ...errorObj,
      type
    });
  }
);

export default service;
