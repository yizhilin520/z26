import { lazy } from 'react';

export default [{
  path: '/protocol/user',
  name: 'ProtocolUser',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "protocol" */'@/pages/protocol/user'))
}, {
  path: '/protocol/anchor',
  name: 'ProtocolAnchor',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "protocol" */'@/pages/protocol/anchor'))
}, {
  path: '/protocol/expert',
  name: 'ProtocolExpert',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "protocol" */'@/pages/protocol/expert'))
}, {
  path: '/protocol/expert/article',
  name: 'ProtocolExpertArticle',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "protocol" */'@/pages/protocol/expert/article'))
}, {
  path: '/protocol/convert',
  name: 'ProtocolConvert',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "protocol" */'@/pages/protocol/convert'))
}, {
  path: '/protocol/privacy',
  name: 'ProtocolPrivacy',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "protocol" */'@/pages/protocol/privacy'))
}];
