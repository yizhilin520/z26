import { lazy } from 'react';

export default [{
  path: '*',
  name: 'notPage',
  component: lazy(() => import(/* webpackChunkName: "notPage" */ '@/pages/notPage'))
}];
