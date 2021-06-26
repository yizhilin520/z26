import React, { forwardRef, useImperativeHandle } from 'react';
import { usePersistFn, useSet } from 'ahooks';
import { empty } from '@/utils/common';
import { Context } from './utils/store';

const Form = forwardRef(({ model, rules, children }, ref) => {
  const [set, { add, remove }] = useSet([]);
  const fields = Array.from(set);
  // 添加字段
  const addFieldHandle = usePersistFn((f) => {
    if (f && f.prop) add(f);
  });
  // 移除字段
  const removeFieldHandle = usePersistFn((f) => {
    if (f && f.prop) remove(f);
  });
  // 验证
  const validateHandle = usePersistFn((callback, p = []) => {
    if (!model) return;
    let cb = callback;

    let promise;
    // if no callback, return promise
    if (typeof callback !== 'function' && window.Promise) {
      promise = new window.Promise((resolve, reject) => {
        cb = (isValid, f) => (isValid ? resolve() : reject(f));
      });
    } else if (!callback) {
      cb = empty;
    }

    let valid = true;
    const invalidFields = {};

    const pArr = Array.isArray(p) ? p : [p];
    const fieldsArr = pArr.length ? fields.filter((f) => pArr.includes(f.prop)) : fields;
    fieldsArr.forEach((f) => {
      f.validate((fieldValid) => {
        if (!fieldValid.valid) valid = false;

        invalidFields[f.prop] = fieldValid;
      });
    });

    if (cb) cb(valid, invalidFields);

    if (promise) return promise;
  });
  // 清除验证
  const clearValidateHandle = usePersistFn((p = []) => {
    const pArr = Array.isArray(p) ? p : [p];
    const fieldsArr = pArr.length ? fields.filter((f) => pArr.includes(f.prop)) : fields;

    fieldsArr.forEach((f) => f.clearValidate());
  });

  useImperativeHandle(ref, () => ({
    // 验证
    validate: validateHandle,
    // 清除验证
    clearValidate: clearValidateHandle
  }));

  const providerVal = {
    state: {
      model,
      rules
    },
    methods: {
      // 添加字段
      addField: addFieldHandle,
      // 移除字段
      removeField: removeFieldHandle
    }
  };
  return (
    <Context.Provider value={providerVal}>
      {children}
    </Context.Provider>
  );
});

export default Form;
