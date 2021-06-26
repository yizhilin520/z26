import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useSelector } from 'react-redux';
import { empty } from '@/utils/common';
import { getShutUpForbidSendMsg } from '@/servers/userServer';
import Select from '@/components/Select';
import { HttpCode } from '@/enums';
import Dialog from './Dialog';
import Form from './Form';

const AddMuteUser = forwardRef((({ onSubmit }, ref) => {
  const { uid, roomId } = useSelector(({ user }) => user.userInfo);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState({});
  const [value, setValue] = useState({});
  // 打开
  const onOpenHandle = () => {
    setValue({});
    setMessage({});
    return setVisible(true);
  };
  // 关闭
  const onCloseHandle = () => setVisible(false);
  // input输入回调
  const onInputChangeHandle = (f, v) => {
    let val = v;
    if (v.target) val = v.target.value;
    const qy = { ...value, [f]: val };
    return setValue(qy);
  };
  // 提交
  const onSubmitHandle = async () => {
    const { account, forbidTimeType, violateType } = value;
    if (!account) return setMessage({ account: '用户账号不能为空' });
    if (account.length < 4 || account.length > 11) return setMessage({ account: '请输入4-11位长度用户账号' });
    if (typeof forbidTimeType === 'undefined') return setMessage({ forbidTimeType: '禁言时长没有选择' });
    if (typeof violateType === 'undefined') return setMessage({ violateType: '违规类型没有选择' });

    const params = { account, forbidTimeType, violateType, roomId, optType: 1 };
    const { data: { code, msg } } = await getShutUpForbidSendMsg(params).toPromise();
    if (HttpCode.SUCCESS === code) {
      onCloseHandle();
      return onSubmit(params);
    }
    return setMessage({ violateType: msg });
  };
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
  useImperativeHandle(ref, () => ({
    open: onOpenHandle,
    close: onCloseHandle
  }));

  return (
    <Dialog title="新增禁言" visible={visible} onClose={onCloseHandle}>
      <Form>
        <Form.Item label="用户账号" message={message.account}>
          <Form.Input placeholder="请输入用户账号" onChange={((e) => onInputChangeHandle('account', e))} />
        </Form.Item>
        <Form.Item label="禁言时长" message={message.forbidTimeType}>
          <Select
            value={value.forbidTimeType}
            list={durationList}
            width={237}
            placeholder="请选择禁言时长"
            onChange={((v) => onInputChangeHandle('forbidTimeType', v))}
          />
        </Form.Item>
        <Form.Item label="违规类型" message={message.violateType}>
          <Select
            value={value.violateType}
            list={violateList}
            width={237}
            placeholder="请选择违规类型"
            onChange={((v) => onInputChangeHandle('violateType', v))}
          />
        </Form.Item>
        <Form.Button onClick={onSubmitHandle}>确认</Form.Button>
      </Form>
    </Dialog>
  );
}));

AddMuteUser.defaultProps = {
  onSubmit: empty
};

export default AddMuteUser;
