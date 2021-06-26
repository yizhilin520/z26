import { forwardRef, useEffect, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import AsyncValidator from 'async-validator';
import { usePersistFn } from 'ahooks';
import { useSafeState } from '@/utils/hooks';
import { empty } from '@/utils/common';
import { useStores } from './utils/store';

const FormItem = forwardRef(({ prop, rules, children }, ref) => {
  const [validateMessage, setValidateMessage] = useSafeState(null);
  const { state, methods } = useStores();
  // 验证
  const validateHandle = usePersistFn((callback) => {
    if (!prop) return false;
    const validRules = rules || state.rules[prop];
    if (!validRules) return false;

    const descriptor = { [prop]: validRules };
    const validator = new AsyncValidator(descriptor);

    const model = {};

    model[prop] = state.model[prop];

    validator.validate(model, { firstFields: true }, (errors) => {
      const message = errors ? errors[0].message : '';

      setValidateMessage(message);

      const returnObj = { message, valid: !errors };

      if (callback) callback(returnObj);
    });
  });
  // 清除验证
  const clearValidateHandle = usePersistFn(() => {
    setValidateMessage(null);
  });

  useEffect(() => {
    const field = {
      prop,
      validate: validateHandle,
      clearValidate: clearValidateHandle
    };
    methods.addField(field);
    return () => methods.removeField(field);
  }, []);

  useImperativeHandle(ref, () => ({
    // 验证
    validate: validateHandle,
    // 清除验证
    clearValidate: clearValidateHandle
  }));

  return children({ message: validateMessage, validate: validateHandle, clearValidate: clearValidateHandle });
});

FormItem.defaultProps = {
  children: empty
};

FormItem.propTypes = {
  children: PropTypes.func
};

export default FormItem;
