import { lazy } from 'react';

export default [{
  path: '/score',
  name: 'score',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "score" */ '@/pages/score'))
}, {
  path: '/score/detail/:id',
  name: 'score',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "score" */ '@/pages/score/detail'))
}];
