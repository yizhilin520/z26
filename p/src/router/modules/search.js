import { lazy } from 'react';

export default [{
  path: '/search',
  name: 'search',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "live" */'@/pages/search'))
}];

