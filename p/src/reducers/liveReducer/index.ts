import { homeAction } from '@/actions'
import { Action } from '@/types'
import { deepCopy } from '@/utils/common'
import { MathNum } from '@/utils/regular'


export interface LiveStore {
  uGlod:any
}

const initStore: LiveStore = {
  uGlod:{
    uGoldNum:0,
    uBeanNum:0
  }
}

export default function HomeReducer(
  state: LiveStore = initStore,
  action: Action
): LiveStore {
  try {
    const copyState = deepCopy(state)
    switch (action.type) {
      // 更新金币
      case `home/${homeAction.UPDATE_USER_UGLODNUM}`: {
        console.log('aaaaaa',state)
        return Object.assign(copyState, {
          ...copyState,
          uGlod:{
            ...copyState.uGlod,
            uGoldNum:action.payload.data.uGoldNum,
            uBeanNum:action.payload.data.uBeanNum,
          }
        })
      }
      default: {
        return copyState
      }
    }
  } catch (error) {
    return state
  }
}
