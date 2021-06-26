import { combineEpics } from 'redux-observable'
import * as userEpic from './userEpic'
import * as scoreEpic from './scoreEpic'
import * as homeEpic from './homeEpic'

function distructor(obj: any) {
  return Object.keys(obj).map((item, index) => {
    return obj[item]
  })
}

const rootEpic = combineEpics(
    ...distructor(userEpic),
    ...distructor(homeEpic),
    ...distructor(scoreEpic)
)

export default rootEpic
