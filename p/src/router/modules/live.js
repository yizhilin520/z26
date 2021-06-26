import { lazy } from 'react';

export default [{
  path: '/live/list/:type?',
  name: 'LiveList',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "live" */'@/pages/live/list'))
}, {
  path: '/live/room/:id',
  name: 'LiveRoom',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "live" */'@/pages/live/room'))
}, {
  path: '/live/playback/:id',
  name: 'LivePlayBack',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "live" */'@/pages/live/playback'))
}];
