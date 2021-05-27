/* eslint-disable react/display-name */
import React from 'react';
import loadable from '@loadable/component';
import LoadingPage from '@/components/LoadingPage';
import { RouteView } from './RouterView';
import type { DocRoute } from './RouterView';

const LoadableHome = loadable(() => import('@/pages/Home'), { fallback: <LoadingPage /> });
const LoadableFoo = loadable(() => import('@/pages/Foo'), { fallback: <LoadingPage /> });
const LoadableFooPlus = loadable(() => import('@/pages/FooPlus'), { fallback: <LoadingPage /> });
const routes: DocRoute[] = [
  {
    path: '/',
    component: () => <RouteView />,
    routes: [
      {
        path: '/index',
        component: LoadableHome,
      },
      {
        path: '/foo',
        component: LoadableFoo,
        routes: [{ path: '/foo/foo-plus', component: LoadableFooPlus }],
      },
      {
        path: '/',
        exact: true,
        redirect: '/index',
      },
    ],
  },
];

export default routes;
