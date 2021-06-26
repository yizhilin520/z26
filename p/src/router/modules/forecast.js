import { lazy } from 'react';

export default [{
  path: '/forecast/:page?',
  name: 'ForecastHome',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "forecast" */'@/pages/forecast/home'))
}, {
  path: '/forecast/detail/:sportId/:expertId/:planId',
  name: 'ForecastDetail',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "forecast" */'@/pages/forecast/detail'))
}, {
  path: '/forecast/expert/:expertId',
  name: 'ForecastDetail',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "forecast" */'@/pages/forecast/expert'))
}];
