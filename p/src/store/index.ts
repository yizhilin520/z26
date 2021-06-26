import { applyMiddleware, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import rootReducer from '@/reducers';
import rootEpic from '@/epics';

const epicMiddleware = createEpicMiddleware();
// 注册中间件
const applyCreateStore = composeWithDevTools(applyMiddleware(epicMiddleware))(
  createStore
);
// 使用combineReducers合并后,每个reducer会对应一个独立的store数据
const store = applyCreateStore(rootReducer);

epicMiddleware.run(rootEpic);

export default store;
