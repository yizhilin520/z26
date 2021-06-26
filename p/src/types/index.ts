// action类型
export interface Action {
  type: string;
  payload?: any;
  callback?: () => void
}

// dispatch传进来的action类型
export interface PayloadIn {
  type: string
  payload: {
    [random: string]: any
  }
  [name: string]: any
}

// epic传到reducer里的action类型
export interface PayloadOut {
  type: string;
  payload: {
    [random: string]: any;
  };
  callback?: () => void
  [name: string]: any
}
