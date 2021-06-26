import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import Helmet from 'react-helmet';
import history from '@/utils/history';
import { Provider as PluginProvider } from '@/plugins';
import Login from '@/components/Login';
import AdvertDialog from '@/components/AdvertDialog';
import SignIn from '@/components/SignIn';
import AppRouter from './router';
import store from './store';

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
    <Router history={history}>
      <PluginProvider>
        <AppRouter />
        <AdvertDialog>
          <SignIn />
        </AdvertDialog>
        <Login />
      </PluginProvider>
    </Router>
  </Provider>
);

export default App;
