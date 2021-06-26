
export interface VerifyItem {
  fn: ($val: string, $form: any, $code: string) => string | boolean
  texts: string[]
  fettle: boolean
  placeholder: string
  type: string
  textsIndex: number | null
}
export interface Verify {
  account: VerifyItem
  password: VerifyItem
  confirmPassword?: VerifyItem
  imgCode?: VerifyItem
  [key: string]: any
}

export interface RegForm {
  account: string
  imgCode: string
  password: string
  confirmPassword: string
  captchaKey: string
  [name: string]: any
}

export interface LoginForm {
  account: string
  password: string
}
