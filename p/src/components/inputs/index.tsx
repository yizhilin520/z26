import React, { useContext, useEffect, useState, useRef } from 'react'
import style from './style.scss'

interface Props {
  formKey: string
  setVerify: any
  verify: any
  setForm: any
  form: any
  [name: string]: any
}
// 处理单项表单验证
const InputWidget = (props: Props) => {
  const { formKey, setVerify, verify, setForm, form, imgCode } = props

  const timeoutVef = useRef<any>()
  // 验证
  const updateVrf = (value: string) => {
    setForm({ ...form, [formKey]: value })
    if (timeoutVef.current) clearTimeout(timeoutVef.current)
    timeoutVef.current = setTimeout(() => {
      const [state, index] = verify[formKey].fn(value, form, imgCode)
      setVerify({ ...verify, [formKey]: { ...verify[formKey], fettle: !state, textsIndex: index } })
    }, 500)
  }
  useEffect(() => {
    return () => {
      clearTimeout(timeoutVef.current)
    }
  }, [])
  return <>
    <input
      onBlur={(e) => {
        updateVrf(e.target.value)
      }}
      onChange={(e) => {
        updateVrf(e.target.value)
      }}
      placeholder={verify[formKey] && verify[formKey].placeholder}
      defaultValue={form[formKey]}
      type={verify[formKey] && verify[formKey].type}
      onCopy={() => false}
      className={style.input}
    />
    <p className={verify[formKey].fettle ? style.errorReg : style.errorRegNone}>{verify[formKey].texts[verify[formKey].textsIndex]}</p>
  </>
}
export default InputWidget
