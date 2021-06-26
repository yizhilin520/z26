import React, { useState, useEffect, useRef } from 'react';
import ClassNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import CopyToClipboard from 'copy-to-clipboard';
import Stepper from '@/components/stepper';
import Snackbar from '@material-ui/core/Snackbar';
import Dialog from '@/pages/user/components/Dialog';
import { userAction } from '@/actions';
import { checkName, confiPassWord, validatePwd, validatePhone,checkSmsCode } from '@/utils/regular'
const MD5 = require('md5');
import history from '@/utils/history';

import modpasswd from '@/scss/modPassword/modPassword.scss';
import '@/components/stepper/cssReset.css'
import qqServiceImage from '@/pages/modPassword/images/icon_qq.png';
import copyImage from '@/pages/modPassword/images/icon_copy.png';
import iconEye from '@/pages/user/images/icon_eye.png';
import iconEyeClose from '@/pages/user/images/icon_eye_close.png';

export default function Password() {
  const dispatch = useDispatch();
  const timerSmsCode = useRef<any>()

  const [account, setAccount] = useState('');
  const [bindingInfo, setBindingInfo] = useState({});
  const [resetPassword, setResetPassword] = useState({
    account:'',
    mobilePhone:'',
    smsCode:'',
    password:"",
    confirmPassword:''
  })
  const [errorAccount, setErrorAccount] =useState({
    errorStat: true, // false显示错误
    errorText: '',
    text: [
      '用户名不能为空',
      '用户名不能包含中文',
      '检测到非法字符串',
      '请输入4-11位字母或数字的用户名',
      ''
    ]
  })
  const [errorSmsCode, setErrorSmsCode] =useState({
    errorStat: true, // false显示错误
    errorText: '',
    text: [
      '验证码不能为空',
      '验证码只能为数字，长度为6',
      ''
    ]
  })
  // 密码
  const [errorRsg2, setErrorRsg2] =useState({
    errorStat: true,
    errorText:'',
    text: [
      '密码不能为空',
      '密码不能包含中文',
      '请输入6-12位包含字母或数字的密码',
      ''
    ]
  })

  const [errorRsg3, setErrorRsg3] =useState({
    errorStat: true,
    errorText: '',
    text: [
      '密码不能为空',
      '两次密码输入不一致',
      ''
    ]
  })
  const [snackbar, setSnackbar] = useState({
    open: false,
    message1:''
  });
  const [chatVisible, setChatVisible] = useState(false);
  const [qqList, setQQList] = useState([]);
  
  useEffect(() =>{
    clearTimeout(timerSmsCode.current)

    return () =>{
      clearTimeout(timerSmsCode.current)
    }
  }, [])

  const accountBlur = (value:any) =>{
    setAccount(value);
    let test:any = checkName(value);
    errorAccount.errorStat = test[0]
    errorAccount.errorText = errorAccount.text[test[1]]
    setErrorAccount({...errorAccount})

  }
  // 下一步
  const [stepNumber, setStepNumber] = useState(0)
  const [hiddenObj, setHiddenObj] = useState({
    newPwd: true,
    confirmPwd: true
  });

  const nextClick1 = () =>{
    accountBlur(account)
    if(errorAccount.errorStat === false) return false;
    dispatch({
      type: `user/${userAction.GET_CHECKIDENTITY_EPIC}`,
      payload: {account},
      callback(res: any) {
        if (!res || res.code !== 200) {
          return setSnackbar({
            open: true,
            message1: res.msg || '网络错误'
          })
        }
        if(res?.code === 200){
          if (res?.data?.bindStatus === 1) {
            setBindingInfo(res.data);
            setStepNumber(1);
          } else {
            setChatVisible(true);
            setQQList(res.data.customerQQList);
          }
        }
      }
    });

  }
  // 验证码判断
  const smsCodeBlur = (value:any) =>{
    resetPassword.smsCode= value
    setResetPassword({...resetPassword})

    let test:any = checkSmsCode(resetPassword.smsCode)
    errorSmsCode.errorStat = test[0]
    errorSmsCode.errorText = errorSmsCode.text[test[1]]
    setErrorSmsCode({...errorSmsCode})

  }
  // 倒计时
  const [timing, setTiming] = useState(0)
  const [timingStat, setTimingStat] = useState(false)

  const sendCodeClick = () =>{
    dispatch({
      type: `user/${userAction.GET_CODE_EPIC}`,
      payload: {
        mobilePhone: bindingInfo.mobilePhone,
        sendType: 2
      },
      callback(res: any) {
        if(res?.code === 200){
          setTiming(Number(res.data))
          setTimingStat(true)
        }
        setSnackbar({
          open: true,
          message1: res.msg
        })
      }
    });
  }

  // console.log('时间',timing)
  if(timingStat === true){
    timerSmsCode.current = setTimeout(() =>{
      let time = timing
        setTiming(time -1)
        if(time === 0){
          clearTimeout(timerSmsCode.current)
          setTimingStat(false)
        }

      }, 1000)
  }
  // 新密码
  const newPasssBlur = (val:any) =>{
    resetPassword.password = val;
    setResetPassword({...resetPassword})

    let test:any = validatePwd(resetPassword.password)
    errorRsg2.errorStat = test[0]
    errorRsg2.errorText = errorRsg2.text[test[1]]
    setErrorRsg2({...errorRsg2})
  }

  const twoPasssChang = (val:any) =>{
    resetPassword.confirmPassword = val;
    setResetPassword({...resetPassword})
    twoPasssBlur()
  }
  // 确认密码
  const twoPasssBlur = () =>{
    let test:any = confiPassWord(resetPassword.password, resetPassword.confirmPassword)

    errorRsg3.errorStat = test[0]
    errorRsg3.errorText = errorRsg3.text[test[1]]
    setErrorRsg3({...errorRsg3})
  }
  // 第二步
  const nextClick2 =() =>{
    smsCodeBlur(resetPassword.smsCode)
    newPasssBlur(resetPassword.password)
    twoPasssBlur()

    resetPassword.account = account
    resetPassword.mobilePhone = bindingInfo.mobilePhone
    setResetPassword({...resetPassword})

    if(errorSmsCode.errorStat === false) return false
    if(errorRsg2.errorStat === false) return false
    if(errorRsg3.errorStat === false) return false

    dispatch({
      type: `user/${userAction.GET_RESETPASSWORD_EPIC}`,
      payload: {
        ...resetPassword,
        password: MD5(resetPassword.password),
        confirmPassword:MD5(resetPassword.confirmPassword)
      },
      callback(res: any) {
        if (res?.code ) {
          setSnackbar({
            open: true,
            message1: res.msg
          })
          if(res?.code === 200){
            setStepNumber(2)
            clearTimeout(timerSmsCode.current)
            setTimingStat(false)
            setTiming(0)
          }
        }
      }
    });

  }
  const loginBack = () =>{
    history.push('/')
  }

  const handleCopy = (v) => {
    CopyToClipboard(v);
    setSnackbar({
      open: true,
      message1: '复制成功，如果失败请手动复制！'
    });
  }
  const handleEyeClick = (key) => {
    hiddenObj[key] = !hiddenObj[key];
    setHiddenObj({...hiddenObj});
  };

  return (
    <div className={modpasswd.main}>
      <div className={modpasswd.warp}>
        <div className={modpasswd.stetp}>
          <Stepper stepNumber = {stepNumber}/>
        </div>
        <div className={modpasswd.modctn}>
          {/* tab切换区 */}
          <div className={modpasswd.tabctn}>
            {/* 第一步 */}
            <div className={ClassNames(modpasswd.next1, {[modpasswd.showd]: stepNumber === 0})}> 
              <div className={ClassNames(modpasswd.inputItem, {[modpasswd.error]: !errorAccount.errorStat})}>
                <span className={modpasswd.label}>用户名：</span>
                <input
                  className={modpasswd.phoneinput1}
                  type='text'
                  placeholder='4-11位字母或数字用户名'
                  onBlur={(e) =>{accountBlur(e.target.value)}} onChange={(e) => {accountBlur(e.target.value)}}
                />
                <p className={modpasswd.errorTip}>{errorAccount.errorText}</p>
              </div>
              <div className={ClassNames(modpasswd.nextBtn, {[modpasswd.disabled]: !account})} onClick={(e) =>{nextClick1()}}>下一步</div>
            </div>

            {/* 第二步 */}
            <div className={ClassNames(modpasswd.next2, {[modpasswd.showd]: stepNumber === 1})}>
              <div className={modpasswd.sendingInfo}>
                <p className={modpasswd.desc}>将验证码发送到您绑定的手机号</p>
                <p className={modpasswd.phone}>+86 {bindingInfo.mobilePhoneXh}</p>
              </div>
              
              <div className={ClassNames(modpasswd.inputItem, modpasswd.sms, {[modpasswd.error]: !errorSmsCode.errorStat})}>
                <input
                  className={ClassNames(modpasswd.phoneinput1, modpasswd.smsCode)}
                  type='text'
                  maxLength={6}
                  placeholder='输入手机验证码'
                  onChange={(e) => {smsCodeBlur(e.target.value)}}
                />
                <div className={`${modpasswd.codeset} ${timingStat === true? modpasswd.disable:''}`} onClick={() =>{sendCodeClick()}}>
                  {timingStat === true? `重新获取(${timing}s)`:'发送验证码'}
                </div>
                <p className={modpasswd.errorTip}>{errorSmsCode.errorText}</p>
              </div>
              <div className={ClassNames(modpasswd.inputItem, {[modpasswd.error]: !errorRsg2.errorStat})}>
                <span className={modpasswd.label}>新密码：</span>
                <input
                  className={modpasswd.phoneinput1}
                  type={hiddenObj.newPwd ? 'password' : 'text'}
                  maxLength={12}
                  placeholder='请输入至少6位数密码，包含字母和数字'
                  onBlur={(e) =>{newPasssBlur(e.target.value)}} onChange={(e) => {newPasssBlur(e.target.value)}}
                />
                <img className={modpasswd.icon} src={hiddenObj.newPwd ? iconEyeClose : iconEye} onClick={() => handleEyeClick('newPwd')} />
                <p className={modpasswd.errorTip}>{errorRsg2.errorText}</p>
              </div>
              <div className={ClassNames(modpasswd.inputItem, {[modpasswd.error]: !errorRsg3.errorStat})}>
                <span className={modpasswd.label}>确认密码：</span>
                <input
                  className={modpasswd.phoneinput1}
                  type={hiddenObj.confirmPwd ? 'password' : 'text'}
                  maxLength={12}
                  placeholder='请再次确认密码'
                  onBlur={(e) =>{twoPasssBlur()}} onChange={(e) => {twoPasssChang(e.target.value)}}
                />
                <img className={modpasswd.icon} src={hiddenObj.confirmPwd ? iconEyeClose : iconEye} onClick={() => handleEyeClick('confirmPwd')} />
                <p className={modpasswd.errorTip}>{errorRsg3.errorText}</p>
              </div>
              <div
                className={ClassNames(modpasswd.nextBtn, {[modpasswd.disabled]: !resetPassword.smsCode || !resetPassword.password || !resetPassword.confirmPassword})}
                onClick={(e) =>{nextClick2()}}>
                下一步
              </div>
            </div>
            {/* 第3步 */}
            <div className={`${modpasswd.next3} ${stepNumber === 2? modpasswd.showd:''}`}>
              <p className={modpasswd.next3text}>修改完成，<span onClick={() =>{loginBack()}}>返回首页重新登录</span></p>
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        autoHideDuration={1000}
        onClose={() => {
          setSnackbar({ ...snackbar, open: false });
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbar.open}
        message={snackbar.message1}
        key={'default'}
      />
      <Dialog title="联系客服" visible={chatVisible} width={380} onClose={() => setChatVisible(false)}>
        <div className={modpasswd.dialogWrapper}>
          <span className={modpasswd.desc}>您尚未绑定手机号，如忘记密码，请联系客服。</span>
          <div className={modpasswd.chatList}>
            {
              qqList.map((item, index) => {
                return (
                  <div className={modpasswd.chatItem}>
                    <img className={modpasswd.qqImg} src={qqServiceImage} />
                    <div className={modpasswd.chatInfo}>
                      <p className={modpasswd.chatName}>QQ客服{index + 1}</p>
                      <p className={modpasswd.qqNo}>{item}</p>
                    </div>
                    <div className={modpasswd.btnCopy} onClick={() => handleCopy(item)}>
                      <img src={copyImage} />
                      <span>复制</span>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </Dialog>
    </div>
  );
}
