import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useRequest } from 'ahooks';
import { getChannelVersionConfig } from '@/services/common';
import Loading from '@/components/Loading';
import useRouterActions from '@/store/actions/router';

import routes from './routes';

const RouterCtrl = ({ component, ...rest }) => {
  const routerActions = useRouterActions();

  useEffect(() => {
    routerActions.setRouterMeta(rest.meta);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  return React.createElement(component, rest);
};

const AppRouter = () => {
  const routerActions = useRouterActions();

  useRequest(getChannelVersionConfig,
    {
      onSuccess: routerActions.setConfig
    });

  return (
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        <Switch>
          {routes.map((row, index) => (
            <Route
              render={(props) => (<RouterCtrl component={row.component} meta={row.meta} {...props} />)}
              path={row.path}
              strict={row.strict}
              exact={row.exact}
              key={row.name || index}
            />
          ))}
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
};

export default AppRouter;
