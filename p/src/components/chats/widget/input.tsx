import React, { useContext, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/reducers';
import { generateMsgId } from '@/utils/common';
import { useLogin, useSafeState } from '@/utils/hooks';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import { ChatsContext } from '../index';
import style from './widget.scss';

const CustomSnackbar = withStyles({
  root: {
    position: 'absolute',
    top: '-56px'
  }
})(Snackbar);

let sendTimestamp;
let messageList = [];
const ChatInput: React.FC = (props: any) => {
  const { room_id } = props;
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [value, setValue] = useState<string>();
  const inputEl: any = useRef(null);
  const { state } = useContext(ChatsContext);
  const { isLogin, login } = useLogin();
  const [errorMessage, setErrorMessage] = useSafeState({});

  const { uid, nickName, roomId, level, isVip } = userInfo;

  // 发送验证 返回true或false
  const sendCheckHandle = (value) => {
    if (messageList.length >= 3) {
      // 与最近3条内容做比较，如果与前三条其中的任意两条内容完全相同，则限制本次发送
      let count = 0;
      for (let i = 0, { length } = messageList; i < length; i++) {
        if (value === messageList[i]) count += 1;
      }
      if (count >= 2) {
        setErrorMessage({
          visible: true,
          value: '您发言太频繁，休息一会在发送吧',
          key: Date.now()
        });
        return false;
      }
      // 发送验证 10S内连续发送3条内容 第四次验证
      if (sendTimestamp && Date.now() - sendTimestamp < 10000) {
        setErrorMessage({
          visible: true,
          value: '您发言太频繁，休息一会在发送吧',
          key: Date.now()
        });
        return false;
      }

      return true;
    }
    return true;
  };

  const sendMessage = () => {
    if (!isLogin) return login();
    if (!value) return;

    if (!sendCheckHandle(value)) return;

    const { socket } = state;
    const emitMsg = {
      messageId: generateMsgId(), // 消息唯一ID
      username: nickName, // 进入直播间但是未登录统一username为'访客'
      messageType: 1, // 1文本, 2礼物, 3表情, 4登录, 5登出
      userId: uid,
      message: value, // 文本或者礼物对应的key值和表情
      ext: {
        isUp: roomId === room_id ? 1 : 0, // 是否是主播自己 1是 0 否
        isVip, // 是否是会员 1是 0 否
        level // 用户级别 默认1
      }
    };
    socket.emit('message', emitMsg);

    messageList.push(value);
    if (messageList.length > 3) {
      messageList = messageList.slice(messageList.length - 3, messageList.length);
    }
    sendTimestamp = Date.now();

    setValue('');
    inputEl.current.value = '';
    inputEl.current.focus();
  };
  const handleKeyPress = (e: React.ChangeEvent<{}>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      return sendMessage();
    }
    return false;
  };
  const onInputClickHandle=()=>{
    if (!isLogin) {
      login();
      inputEl.current.blur()
    }
  }
  const sendMsg = () => {
  };
  return (
    <div className={style.roombottom}>
      <div className={style.msginput}>
        <textarea
          className={style.inputBox}
          placeholder="请输入文字"
          maxLength={140}
          ref={inputEl}
          onChange={(e) => setValue(e.target.value.replace(/^\s*|\s*$/g, ''))}
          onKeyPress={handleKeyPress}
          onClick={onInputClickHandle}
        />
        <div onClick={sendMessage} className={style.msgBtn}>发送</div>
      </div>
      <CustomSnackbar
        autoHideDuration={1500}
        onClose={() => setErrorMessage({})}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={errorMessage.visible}
        message={errorMessage.value}
        key={`sendErrMsg_${errorMessage.key}`}
      />
    </div>
  );
};

export default ChatInput;
