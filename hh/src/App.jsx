import React from 'react';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import { UseRequestProvider } from 'ahooks';
import store from './store';
import AppRouter from './router';

// 全局请求配置
const GlobalRequestOptions = {
  formatResult: (rData) => (rData || {}).data,
  defaultLoading: true
};

const App = () => (
  <Provider store={store}>
    <Helmet
      title="2021足球欧洲杯_欧洲杯体育视频直播_JRS直播_欧洲杯预算赛赛程_足球直播"
      meta={[{
        name: 'keywords',
        content: '欧洲杯JRS分组,欧洲杯最新消息,欧洲杯决赛冠军,nba直播'
      }, {
        name: 'description',
        content: '免费提供各类高清足球直播,2021足球欧洲杯_欧洲杯体育视频直播_JRS直播_欧洲杯预算赛赛程_足球直播,包涵的赛事为提供英超,欧洲杯JRS分组,欧洲杯最新消息,欧洲杯决赛冠军,nba直播等。U球体育以最全最高清信号让您畅享各大联赛,打造最好体育直播吧。'
      }]}
    />
    <UseRequestProvider value={GlobalRequestOptions}>
      <AppRouter />
    </UseRequestProvider>
    <div className="weixin-tip" id="weixin">
      <p>请复制地址，用默认浏览器打开</p>
    </div>
  </Provider>
);

export default App;
