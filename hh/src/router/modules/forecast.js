import { lazy } from 'react';

export default [{
  path: '/forecast',
  name: 'forecast',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "forecast" */ '@/pages/forecast'))
}];
