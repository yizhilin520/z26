import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { empty } from '@/utils/common';
import { useSafeState } from '@/utils/hooks';
import { useSnackbar } from '@/plugins';
import RenderJudge from '@/components/RenderJudge';
import UserDialog from '@/pages/user/components/Dialog';
import Form from '@/pages/user/components/Form';
import Select from '@/components/Select';
import { useStores } from '../utils/store';

// 禁言/踢人弹框操作
const AddKickMute = forwardRef(({ onSubmit }, ref) => {
  const { methods } = useStores();
  const [visible, setVisible] = useSafeState(false);
  const [formData, setFormData] = useSafeState({});
  const [message, setMessage] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  // 打开
  const onOpenHandle = (data) => {
    setFormData(data);
    setMessage({});
    return setVisible(true);
  };
  // 关闭
  const onCloseHandle = () => setVisible(false);

  // 时长
  const durationList = [{
    label: '1天',
    value: 0
  }, {
    label: '7天',
    value: 1
  }, {
    label: '1个月',
    value: 2
  }, {
    label: '永久',
    value: 3
  }];
  const violateList = [{
    label: '色情低俗',
    value: 0
  }, {
    label: '广告刷屏',
    value: 1
  }, {
    label: '恶意信息',
    value: 2
  }, {
    label: '违法违规',
    value: 3
  }];

  // 是否是禁言
  const isMute = formData.optType === 1;
  // 是否是踢人
  const isKick = formData.optType === 2;

  // 选择输入回调
  const onSelectChangeHandle = (f, v) => setFormData({ ...formData, [f]: v });
  // 提交
  const onSubmitHandle = async () => {
    const { account, forbidTimeType, violateType } = formData;

    if (typeof forbidTimeType === 'undefined') {
      if (isKick) return setMessage({ forbidTimeType: '踢人时长没有选择' });
      return setMessage({ forbidTimeType: '禁言时长没有选择' });
    }
    if (typeof violateType === 'undefined') return setMessage({ violateType: '违规类型没有选择' });

    const handle = isMute ? methods.mute : methods.kickOut;

    return handle(formData, account).then(() => {
      onCloseHandle();
      return onSubmit(formData);
    });
  };

  useImperativeHandle(ref, () => ({
    open: onOpenHandle,
    close: onCloseHandle
  }));

  return (
    <UserDialog
      title={(
        <RenderJudge
          value={isMute}
          active="新增禁言"
          inactive="新增踢人"
        />
      )}
      visible={visible}
      onClose={onCloseHandle}
    >
      <Form>
        <Form.Item label="用户账号">
          <div style={{ color: '#323232', fontSize: '13px', padding: '0 12px' }}>{formData.account}</div>
        </Form.Item>
        <RenderJudge
          value={isMute}
          active={(
            <Form.Item label="禁言时长" message={message.forbidTimeType}>
              <Select
                value={formData.forbidTimeType}
                list={durationList}
                width={237}
                placeholder="请选择禁言时长"
                onChange={((forbidTimeType) => onSelectChangeHandle('forbidTimeType', forbidTimeType))}
              />
            </Form.Item>
          )}
        />
        <RenderJudge
          value={isKick}
          active={(
            <Form.Item label="踢人时长" message={message.forbidTimeType}>
              <Select
                value={formData.forbidTimeType}
                list={durationList}
                width={237}
                placeholder="请选择踢人时长"
                onChange={((forbidTimeType) => onSelectChangeHandle('forbidTimeType', forbidTimeType))}
              />
            </Form.Item>
          )}
        />
        <Form.Item label="违规类型" message={message.violateType}>
          <Select
            value={formData.violateType}
            list={violateList}
            width={237}
            placeholder="请选择违规类型"
            onChange={((violateType) => onSelectChangeHandle('violateType', violateType))}
          />
        </Form.Item>
        <Form.Button onClick={onSubmitHandle}>确认</Form.Button>
      </Form>
    </UserDialog>
  );
});

AddKickMute.defaultProps = {
  onSubmit: empty
};

export default AddKickMute;
