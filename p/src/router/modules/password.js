import { lazy } from 'react';

export default [{
  path: '/password/forgot',
  name: 'PasswordForgot',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "password" */'@/pages/modPassword'))
}];
