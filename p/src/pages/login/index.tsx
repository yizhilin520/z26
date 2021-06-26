import React, {useEffect, useRef, useState} from 'react'
import {Link} from 'react-router-dom'
import {homeAction, userAction} from '@/actions'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '@/reducers'
import Dialogs from '@/components/dialogs'
import Snackbar, {SnackbarOrigin} from '@material-ui/core/Snackbar';
import ComponTabs from '@/components/tabs';

import './login.scss'
import LoginForm from './LoginForm';

const MD5 = require('md5');

export interface State extends SnackbarOrigin {
  open: boolean;
}


interface Props {
  open: boolean
  handleClose: () => Function
  regLogIndex: number
}

const Login = (props: any) => {
  const dispatch = useDispatch()
  const controlLogin = useSelector((state: RootState) => state.home['controlLogin'])
  const {activeIndex, open} = controlLogin
  const [index, setIndex]: [number, Function] = useState<number>(activeIndex)
  const handleClose = () => {
    dispatch({
      type: `home/${homeAction.UPDATE_OPEN_LOGIN}`,
      payload: {activeIndex: index}
    })
  }
  useEffect(() => {
    setIndex(activeIndex)
  }, [activeIndex])

  if (!open) return null

  return (
    <Dialogs
      scroll="body"
      title={<ComponTabs index={index} setIndex={setIndex} titles={['登录', '注册']} centered/>}
      content={<LoginForm index={index} onClose={handleClose} isOpen/>}
      handleClose={handleClose} aria-labelledby="customized-dialog-title" open
    />
  )
}


export default Login
