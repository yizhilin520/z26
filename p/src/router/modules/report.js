import { lazy } from 'react';

export default [{
  path: '/report/:id',
  name: 'report',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "feedback" */'@/pages/report'))
}];