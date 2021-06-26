import { lazy } from 'react';

export default [{
  path: '/download',
  name: 'download',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "download" */ '@/pages/download'))
}];
