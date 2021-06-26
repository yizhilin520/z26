import { lazy } from 'react';

export default [{
  path: '/live/room/:id',
  name: 'LiveRoom',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "live" */ '@/pages/live/room'))
}];
