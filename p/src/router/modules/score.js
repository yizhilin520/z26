import { lazy } from 'react';

export default [{
  path: '/score/football',
  name: 'scoreFootball',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "score" */'@/pages/score/football'))
}, {
  path: '/score/basketball',
  name: 'ScoreBasketball',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "score" */'@/pages/score/basketball'))
}, {
  path: '/score/detail/:eventId/:page?',
  name: 'ScoreDetail',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "score" */'@/pages/score/detail'))
}];
