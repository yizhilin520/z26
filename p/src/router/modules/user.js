import { lazy } from 'react';

export default [{
  path: '/user/:type?',
  name: 'user',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "user" */'@/pages/user')),
  meta: {
    loginRequired: true
  }
}];
