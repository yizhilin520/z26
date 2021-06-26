import { lazy } from 'react';

export default [{
  path: '/feedback',
  name: 'feedback',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "feedback" */'@/pages/feedback'))
}];