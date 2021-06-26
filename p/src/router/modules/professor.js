import { lazy } from 'react';

export default [{
  path: '/professor/:professor?/:page?',
  name: 'ProfessorPage',
  exact: true,
  component: lazy(() => import(/* webpackChunkName: "professor" */'@/pages/professor'))
}];
