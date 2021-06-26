import React from 'react';
import MaterialDialog from '@material-ui/core/Dialog';
import RenderJudge from '@/components/RenderJudge';
import Iconfont from '@/components/Iconfont';
import { empty } from '@/utils/common';

// import styles from '../style/Dialog.scss';

const Dialog = ({ visible, width, children, onClose, ...props }) => (
  <MaterialDialog open={visible} maxWidth={false} scroll="body" {...props}>
    <div >
      {children}
    </div>
  </MaterialDialog>
);

Dialog.defaultProps = {
  width: 372,
  onClose: empty
};

export default Dialog;
