import React, { Suspense, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useLogin } from '@/utils/hooks';
import useRouterActions from '@/actions/router';

import routes from './routes';

const RouterControl = ({ component, meta, ...props }) => {
  const routerActions = useRouterActions();

  useEffect(() => {
    routerActions.setRouterMeta(meta);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  return React.createElement(component, { ...props, meta });
};

RouterControl.defaultProps = {
  meta: {}
};

const AppRouter = () => {
  const { isLogin } = useLogin();

  let routeList = routes;

  // 没有登录就剔除需要登录的路由
  if (!isLogin) routeList = routes.filter(({ meta = {} }) => !meta.loginRequired);

  return (
    <Suspense fallback={null}>
      <Switch>
        {routeList.map((row, index) => (
          <Route
            render={(props) => <RouterControl component={row.component} meta={row.meta} {...props} />}
            path={row.path}
            strict={row.strict}
            exact={row.exact}
            key={row.name || index}
          />
        ))}
      </Switch>
    </Suspense>
  );
};

export default AppRouter;
