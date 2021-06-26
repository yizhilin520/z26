import React, { useRef } from 'react';
import ClassNames from 'classnames';
import { useSetState } from 'ahooks';
import DatePicker, { registerLocale } from 'react-datepicker';
import { zhCN } from 'date-fns/locale';
import { empty } from '@/utils/common';
import Form from '@/components/Form/Form';
import FormItem from '@/components/Form/FormItem';
import Iconfont from '@/components/Iconfont';

import 'react-datepicker/dist/react-datepicker.css';
import '@/components/datePicker/date.scss';
import styles from '../style/EventInput.scss';

registerLocale('zhCN', zhCN);

const EventInput = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useSetState();
  const formRef = useRef();

  // 验证配置
  const formRules = {
    matchTypeName: [
      { required: true, message: '请输入您要关联的赛事类型' },
      { max: 32, message: '赛事类型最多输入32个字符' }
    ],
    matchName: [
      { required: true, message: '请输入您要关联的赛事名称' },
      { max: 32, message: '赛事名称最多输入32个字符' }
    ],
    matchTime: [
      { required: true, message: '请选择比赛开始时间' }
    ]
  };

  // input输入回调
  const onInputChangeHandle = (field, event) => setFormData({ [field]: event.target.value });

  // 提交
  const onSubmitHandle = async () => {
    try {
      await formRef.current.validate();
    } catch (e) {
      return e;
    }

    return onSubmit(formData);
  };

  return (
    <Form model={formData} rules={formRules} ref={formRef}>
      <div className={styles.container}>
        <FormItem prop="matchTypeName">
          {({ message }) => (
            <div className={styles.item}>
              <div className={styles.label}>赛事类型：</div>
              <input
                className={styles.input}
                type="text"
                placeholder="请输入您要关联的赛事类型"
                maxLength={32}
                onChange={(e) => onInputChangeHandle('matchTypeName', e)}
              />
              <div className={styles.message}>{message}</div>
            </div>
          )}
        </FormItem>
        <FormItem prop="matchName">
          {({ message }) => (
            <div className={styles.item}>
              <div className={styles.label}>关联赛事：</div>
              <input
                className={styles.input}
                type="text"
                placeholder="请输入您要关联的赛事名称"
                maxLength={32}
                onChange={(e) => onInputChangeHandle('matchName', e)}
              />
              <div className={styles.message}>{message}</div>
            </div>
          )}
        </FormItem>
        <FormItem prop="matchTime">
          {({ message }) => (
            <div className={styles.item}>
              <div className={styles.label}>比赛时间：</div>
              <DatePicker
                selected={formData.matchTime}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                placeholderText="请选择比赛开始时间"
                dateFormat="yyyy-MM-dd HH:mm:ss"
                locale="zhCN"
                customInput={(
                  <input
                    className={ClassNames(styles.input, styles.isSuffixIcon)}
                    type="text"
                    readOnly
                  />
                )}
                onChange={(d) => setFormData({ matchTime: d.getTime() })}
              />
              <Iconfont name="xiala" className={styles.suffixIcon} />
              <div className={styles.message}>{message}</div>
            </div>
          )}
        </FormItem>
        <div className={styles.item}>
          <div className={styles.label} />
          <div className={styles.footerButton}>
            <div className={styles.button} onClick={onClose}>取消</div>
            <div className={ClassNames(styles.button, styles.isActive)} onClick={onSubmitHandle}>确认</div>
          </div>
        </div>
      </div>
    </Form>
  );
};

EventInput.defaultProps = {
  onSubmit: empty
};

export default EventInput;
