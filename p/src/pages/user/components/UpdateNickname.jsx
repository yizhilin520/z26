import React, { forwardRef, useImperativeHandle, useState } from 'react';
import ClassNames from 'classnames';
import { empty } from '@/utils/common';
import { changeNickName, getNickCardNum } from '@/servers/userServer';
import { HttpCode } from '@/enums';
import { useRequest } from '@/utils/hooks';
import Dialog from './Dialog';
import styles from '../style/UpdateNickName.scss';

const UpdateNickname = forwardRef(({ onSubmit, onShowMsg }, ref) => {
  const { data: cardNum } = useRequest(
    (q) => getNickCardNum(q).toPromise()
  );
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState();
  // 打开
  const onOpenHandle = () => setVisible(true);
  // 关闭
  const onCloseHandle = () => {
    setValue(null);
    setVisible(false);
  };
  // 输入框获取值
  const onInputChange = (event) => setValue(event.target.value);
  // 确认按钮
  const onSubmitHandle = async () => {
    if (value.length < 4 || value.length > 11) return onShowMsg({
      open: true,
      msg: '请输入4-11位长度昵称'
    });

    const params = { nickName: value };
    const { data: { code, msg } } = await changeNickName(params).toPromise();

    if (HttpCode.SUCCESS === code) {
      onCloseHandle();
      onShowMsg({
        open: true,
        msg: '修改成功'
      });
      return onSubmit({nickname: value});
    }
    return onShowMsg({
      open: true,
      msg
    });
  };

  useImperativeHandle(ref, () => ({
    open: onOpenHandle,
    close: onCloseHandle
  }));

  return (
    <Dialog title="修改昵称" visible={visible} width={380} onClose={onCloseHandle}>
      <div className={styles.dialogWrapper}>
        <div className={styles.inputItem}>
          <div className={styles.label}>新昵称：</div>
          <div className={styles.inputArea}>
            <input type="text" maxLength={11} onChange={onInputChange} />
            <p className={styles.tips}>每30天才能更改一次昵称哦{cardNum > 0 ? `（当前拥有改名卡*${cardNum}）` : ''}</p>
          </div>
        </div>
        <div className={ClassNames(styles.button, {[styles.disabled]: !value})} onClick={onSubmitHandle}>确认</div>
      </div>
    </Dialog>
  );
});

UpdateNickname.defaultProps = {
  onSubmit: empty
};

export default UpdateNickname;
