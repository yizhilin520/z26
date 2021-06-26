import { combineReducers } from 'redux';
import userReducer from './userReducer';
import scoreReducer from './scoreReducer';
import homeReducer from './homeReducer';
import routerReducer from './router';
import configReducer from './config';

const rootReducer = combineReducers({
  user: userReducer,
  score: scoreReducer,
  home: homeReducer,
  router: routerReducer,
  config: configReducer
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>
