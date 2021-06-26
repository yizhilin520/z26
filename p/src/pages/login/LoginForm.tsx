import React, {useEffect, useRef, useState} from 'react'
import {Link} from 'react-router-dom'
import Button from '@material-ui/core/Button'
import {homeAction, userAction} from '@/actions'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '@/reducers'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import GraphCode from '@/components/GraphCode';

import {checkName, confirmPassword, localStorageGet, localStoragePut, testImgCode, validatePwd} from '@/utils/regular'
import Snackbar, {SnackbarOrigin} from '@material-ui/core/Snackbar';
import {RegForm, Verify} from './function'
import InputWidget from '@/components/inputs';
import './login.scss'
import history from '@/utils/history';

const MD5 = require('md5');
import { getExpertExamineStatus } from '@/servers/userServer';
import { HttpCode } from '@/enums';

export interface State extends SnackbarOrigin {
  open: boolean;
}


interface Props {
  open: boolean
  handleClose: () => Function
  regLogIndex: number
}



const LoginForm: Function = ({index, onClose, isOpen, isProfessor}) => {

  const dispatch = useDispatch()
  const randCode = useSelector((state: RootState) => state.user['randCode'])
  const timeoutDrawing = useRef<any>()
  const timeoutMsg = useRef<any>()
  const timeoutClose = useRef<any>()
  const timeoutClosep22 = useRef<any>()
  const loginData = localStorageGet('loginData')
  const [message, setMessage] = useState<string>()
  const [snackbar, setSnackbar] = useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center'
  })
  const {vertical, horizontal, open} = snackbar
  // 登录表单
  const [loginForm, setLoginForm]: [LoginForm, Function] = useState<LoginForm>({
    account: loginData?.account || '',
    password: loginData?.password || ''
  })
  // 注册表单
  const [regForm, setRegForm]: [any, Function] = useState<RegForm>({
    account: '',
    password: '',
    confirmPassword: '',
    imgCode: '',
    captchaKey: ''
  })
  // 登录验证
  const [verifyLogin, setVerifyLogin]: [Verify, Function] = useState<Verify>({
    account: {
      fn: checkName,
      type: 'text',
      textsIndex: null,
      texts: [
        '用户名不能为空',
        '用户名不能包含中文',
        '检测到非法字符串',
        '请输入4-11位字母和数字的用户名',
        '请输入正确的用户名'
      ],
      placeholder: '请输入4-11位字母和数字的用户名',
      fettle: false
    },
    password: {
      fn: validatePwd,
      type: 'password',
      textsIndex: null,
      texts: [
        '密码不能为空',
        '密码不能包含中文',
        '请输入6-12位字母或数字的密码',
        '请输入正确的密码'
      ],
      placeholder: '6-12位字母或数字的密码',
      fettle: false
    }
  })
  // 注册验证
  const [verifyReg, setVerifyReg]: [Verify, Function] = useState<Verify>({
    account: {
      fn: checkName,
      type: 'text',
      textsIndex: null,
      texts: [
        '用户名不能为空',
        '用户名不能包含中文',
        '检测到非法字符串',
        '请输入4-11位字母和数字的用户名',
        '请输入正确的用户名'
      ],
      placeholder: '请输入4-11位字母和数字的用户名',
      fettle: false
    },
    password: {
      fn: validatePwd,
      type: 'password',
      textsIndex: null,
      texts: [
        '密码不能为空',
        '密码不能包含中文',
        '请输入6-12位字母或数字的密码',
        '请输入正确的密码'
      ],
      placeholder: '6-12位字母或数字的密码',
      fettle: false
    },
    confirmPassword: {
      fn: (val, form) => confirmPassword(form.password, val),
      type: 'password',
      textsIndex: null,
      texts: [
        '确认密码不能为空',
        '密码两次输入不一致',
      ],
      placeholder: '6-12位字母或数字的密码',
      fettle: false
    },
    imgCode: {
      fn: testImgCode,
      type: 'text',
      textsIndex: null,
      texts: [
        '请输入正确的验证码',
        '验证码不能为空',
        '验证码为4位',
      ],
      placeholder: '请输入图形验证码',
      fettle: false
    }
  })
  // 处理返回数据
  const callback = (res: any) => {
    // if (res.code === 200) setActiveIndex(0)
    if (res.code === 200) {
      dispatch({
        type: `user/${userAction.UPDATE_LOGIN_REDUCER}`,
        payload: {data: res.data}
      })
      if(isProfessor){
        Profess(res.data.uid)
        onClose();
        return false;
      }
      timeoutClose.current = setTimeout(() => {
        onClose()
        location.reload()
      }, 1000)
    }
    setMessage(res.msg)
    setSnackbar({...snackbar, open: true})
  }
  const Profess = async (uid) =>{
    const { data: { code, msg, data } } = await getExpertExamineStatus({userId:uid}).toPromise();
    if (HttpCode.SUCCESS === code) {
      if(data.status !== 1 ){
        history.push('/professor/apply')
      }else if(data.status === 1){
        history.push('/professor/home')
      }

    }
  }
  // 调用登录接口
  const loginBtn: Function = () => {
    if (!regLogin(loginForm, verifyLogin, setVerifyLogin)) {
      return false
    }
    dispatch({
      type: `user/${userAction.GET_LOGIN_EPIC}`,
      payload: {
        ...loginForm,
        password: MD5(loginForm.password),
      },
      callback
    })
    // 如果保存密码
    if (storage) {
      localStoragePut('loginData', {...loginForm, storage: storage})
    } else {
      // 否则删除
      localStoragePut('loginData', {...loginForm, password: '', storage: storage})
      // localStorageGet('loginData', 'delete')
    }
  }
  // 调用注册接口
  const regBtn: Function = () => {
    if (!regLogin(regForm, verifyReg, setVerifyReg)) return false
    dispatch({
      type: `user/${userAction.GET_REGISTER_EPIC}`,
      payload: { // md5加密
        ...regForm,
        password: MD5(regForm.password),
        confirmPassword: MD5(regForm.confirmPassword)
      },
      callback
    })
  }
  // 登录和注册提交验证
  const regLogin = (form: any, verify: any, setVerify: Function) => {
    let fettles: boolean[] = []
    let obj: any = {}
    Object.keys(form).filter(item => item !== 'captchaKey').forEach(key => {
      const [state, index] = verify[key].fn(form[key], form, randCode.imgCode)
      obj[key] = {...verify[key], fettle: !state, textsIndex: index}
      // 有值的时候push
      form[key] && fettles.push(verify[key].fettle)
    })
    setVerify({...obj})
    // 去掉captchaKey, 全部存在则提交
    if (!fettles.includes(true) && fettles.length === (Object.keys(form).includes('captchaKey') ? Object.keys(form).length - 1 : Object.keys(form).length)) {
      return true
    }
    return false
  }

  // 调用图形验证码
  const randCodeBtn = () => {
    dispatch({
      type: `user/${userAction.GET_RAND_CODE_EPIC}`,
    })
  }

  // 只有登录注册弹窗弹出时候才拉取验证码
  useEffect(() => {
    isOpen && randCodeBtn()
  }, [isOpen])
  // randCode更新
  useEffect(() => {
    updateImgCode()
  }, [randCode.captchaKey])
  // 更新图片
  const updateImgCode = () => {
    setRegForm({...regForm, captchaKey: randCode.captchaKey})
  }

  // 清除副作用
  useEffect(() => {
    return () => {
      // 清除副作用
      clearTimeout(timeoutMsg.current)
      clearTimeout(timeoutDrawing.current)
      clearTimeout(timeoutClose.current)
      clearTimeout(timeoutClosep22.current)
    }
  }, [])

  const ModiPassword = () => {
    onClose()
    history.push('/password/forgot');
  }

  // 记住密码
  const [storage, setStorage] = useState<boolean>(loginData?.storage || false)
  return (
    <div className='treeNodeUnselectable'>
      <Snackbar
        anchorOrigin={{vertical, horizontal}}
        open={open}
        onClose={() => setSnackbar({...snackbar, open: false})}
        message={message}
        key={vertical + horizontal}
      />
      {/* 登录 */}
      <div style={{display: index === 0 ? 'block' : 'none'}} className='logoform'>
        <div className='zhanghao'>
          {
            Object.keys(loginForm).map((key) =>
              <div className='regphone' key={key}>
                <InputWidget formKey={key} setVerify={setVerifyLogin} verify={verifyLogin} setForm={setLoginForm}
                             form={loginForm}/>
              </div>
            )
          }
        </div>
        <div className='ispassword'>
          <CheckboxLab storage={storage} setStorage={setStorage}/> <p className='nopassword'
                                                                      onClick={() => ModiPassword()}>忘记密码？</p>
        </div>
        <div className='passbtn'>
          <Button variant="contained" onClick={() => loginBtn()}>登录</Button>
        </div>
        <p className='logintext'>
          登录注册即同意
          <Link to="/protocol/user" target="_blank" className='logintext'>《用户协议》</Link>
        </p>
      </div>
      {/* 注册 */}
      <div style={{display: index === 1 ? 'block' : 'none'}}>
        {
          Object.keys(regForm).filter(item => item !== 'captchaKey').map((key) => {
            return key !== 'imgCode' ?
              <div className='regphone' key={key}>
                <InputWidget formKey={key} setVerify={setVerifyReg} verify={verifyReg} setForm={setRegForm}
                             form={regForm}/>
              </div> :
              <div className='regphone regyanzhengma' key={key}>
                <InputWidget formKey={key} setVerify={setVerifyReg} verify={verifyReg} setForm={setRegForm}
                             form={regForm} imgCode={randCode.imgCode}/>
                <GraphCode width={120} height={40} onClick={randCodeBtn} className='getImgCode' code={randCode.imgCode}/>
              </div>
          })
        }
        <div className='regBtnt'>
          <Button onClick={() => regBtn()} variant="contained">注册</Button>
        </div>
        <p className='regsttext'>
          登录注册即同意
          <Link to="/protocol/user" target="_blank" className='regsttext'>《用户协议》</Link>
        </p>
      </div>
    </div>
  )
}
// 记住密码
const CheckboxLab = (props: any) => {
  const {storage, setStorage} = props
  return (
    <FormControlLabel
      control={
        <Checkbox
          icon={<img src="/static/images/user/un-checked.webp"/>}
          checkedIcon={<img src="/static/images/user/check.webp"/>}
          checked={storage}
          onChange={(e: React.ChangeEvent<{}>) => setStorage(e.target.checked)}
          name='checkedB'
          color='primary'
        />
      }
      label='记住密码'
    />
  )
}


export default LoginForm
