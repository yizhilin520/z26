
import React, { useState, useEffect, useRef } from 'react';
import { RootState } from '@/reducers';
import Snackbar, { SnackbarOrigin } from '@material-ui/core/Snackbar';
const snackbar = (props:any) => {
  const [config,setConfig ] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message:'',
  })
  useEffect(()=>{
    if(!props.message) return 
    setConfig({
      ...config,
      open:true,
      message:props.message
    })
    const timer = setTimeout(()=>{
      setConfig({
        ...config,
        open:false,
        message:''
      })
      clearTimeout(timer)
    },3000)
  },[props.message])
  const {vertical,horizontal,message,open} = config
  return (
    <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        message={message}
        key={vertical + horizontal}
      />
  )
}

export default snackbar