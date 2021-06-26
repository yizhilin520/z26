import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { empty } from '@/utils/common';
import { getRoomManageAdd } from '@/servers/userServer';
import { HttpCode } from '@/enums';
import Dialog from './Dialog';
import Form from './Form';

const AddHouseManage = forwardRef(({ onSubmit }, ref) => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState();
  const [warningMessage, setWarningMessage] = useState();
  // 打开
  const onOpenHandle = () => setVisible(true);
  // 关闭
  const onCloseHandle = () => {
    setWarningMessage(null);
    setValue(null);
    setVisible(false);
  };
  // 输入框获取值
  const onInputChange = (event) => setValue(event.target.value);

  // 提交
  const onSubmitHandle = async () => {
    if (!value) return setWarningMessage('用户昵称不能为空');

    const params = { roomManageNickName: value };
    const { data: { code, msg } } = await getRoomManageAdd(params).toPromise();

    if (HttpCode.SUCCESS === code) {
      onCloseHandle();
      return onSubmit(params);
    }
    return setWarningMessage(msg);
  };

  useImperativeHandle(ref, () => ({
    open: onOpenHandle,
    close: onCloseHandle
  }));

  return (
    <Dialog title="添加房管" visible={visible} onClose={onCloseHandle}>
      <Form>
        <Form.Item label="用户昵称" message={warningMessage}>
          <Form.Input placeholder="请输入用户昵称" onChange={onInputChange} />
        </Form.Item>
        <Form.Button onClick={onSubmitHandle}>确认</Form.Button>
      </Form>
    </Dialog>
  );
});
AddHouseManage.defaultProps = {
  onSubmit: empty
};

export default AddHouseManage;
