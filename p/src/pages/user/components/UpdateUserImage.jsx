import React, { forwardRef, useImperativeHandle, useState } from 'react';
import ClassNames from 'classnames';
import Cropper from 'react-cropper';
import { empty } from '@/utils/common';
import { updateUserImage } from '@/servers/userServer';
import 'cropperjs/dist/cropper.css';
import { HttpCode } from '@/enums';
import RenderJudge from '@/components/RenderJudge';
import Dialog from './Dialog';

import styles from '../style/UpdateUserImage.scss';

const UpdateUserImage = forwardRef(({ onSubmit }, ref) => {
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState();
  const [instance, setInstance] = useState();
  const [message, setMessage] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // 打开
  const onOpenHandle = (url) => {
    setImage(url);
    setMessage(null);
    setSubmitLoading(false);
    setVisible(true);
  };
  // 关闭
  const onCloseHandle = () => setVisible(false);
  // 提交
  const onSubmitHandle = async () => {
    if (!instance || submitLoading) return;
    setSubmitLoading(true);

    try {
      const file = await new Promise((resolve) => {
        instance.getCroppedCanvas().toBlob((blob) => {
          // 重命名下 不会后端可能会出现.blob的后缀
          const suffix = (blob.type || '').replace(/^image\//, '').replace(/jpeg/, 'jpg');
          resolve(new File([blob], `${Date.now()}.${suffix}`, { type: blob.type }));
        });
      });
      const formData = new FormData();
      formData.append('file', file);
      const { data: { code, msg, data } } = await updateUserImage(formData).toPromise();

      if (HttpCode.SUCCESS === code) {
        onCloseHandle();
        return onSubmit({ headImage: data });
      }
      return setMessage(msg);
    } catch (e) {
      return setMessage('上传失败');
    } finally {
      setSubmitLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    open: onOpenHandle,
    close: onCloseHandle
  }));

  return (
    <Dialog title="修改头像" visible={visible} onClose={onCloseHandle} width={520}>
      <div className={styles.container}>
        <div className={styles.preview} />
        <div className={styles.wrapper}>
          <Cropper
            style={{ width: '100%', height: '100%' }}
            preview={`.${styles.preview}`}
            src={image}
            aspectRatio={1}
            onInitialized={setInstance}
          />
        </div>
      </div>
      <div className={styles.footer}>
        <RenderJudge
          value={message}
          active={<div className={ClassNames(styles.tips, styles.isError)}>{message}</div>}
          inactive={<div className={styles.tips}>温馨提示：仅支持jpg、jpeg、png格式</div>}
        />
        <div className={ClassNames(styles.button, styles.isActive)} onClick={onSubmitHandle}>确认</div>
        <div className={styles.button} onClick={onCloseHandle}>取消</div>
      </div>
    </Dialog>
  );
});

UpdateUserImage.defaultProps = {
  onSubmit: empty
};

export default UpdateUserImage;
