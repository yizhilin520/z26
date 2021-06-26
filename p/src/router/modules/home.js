import { lazy } from 'react';

export default [{
  path: '/',
  name: 'home',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "home" */ '@/pages/home'))
}];
