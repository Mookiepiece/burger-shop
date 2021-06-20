import React from 'react';
import loadable from '@loadable/component';
import LoadingPage from '@/components/LoadingPage';
import { RouteView } from './RouteView';
import type { DocRoute } from './RouteView';
import QuoteLayout from '@/layouts/QuoteLayout';

const LoadableHome = loadable(() => import('@/pages/Home'), { fallback: <LoadingPage /> });
const LoadableFoo = loadable(() => import('@/pages/Foo'), { fallback: <LoadingPage /> });
const LoadableFooPlus = loadable(() => import('@/pages/FooPlus'), { fallback: <LoadingPage /> });
const LoadableQuoteStepSkipFlow = loadable(() => import('@/pages/QuoteStepSkipFlow'), { fallback: <LoadingPage /> });
const LoadableQuoteStepLettuce = loadable(() => import('@/pages/QuoteStepLettuce'), { fallback: <LoadingPage /> });
const LoadableQuoteStepLettucepiece = loadable(() => import('@/pages/QuoteStepLettucepiece'), {
  fallback: <LoadingPage />,
});
const LoadableQuoteBuilder = loadable(() => import('@/pages/QuoteBuilder'), { fallback: <LoadingPage /> });

const routes: DocRoute[] = [
  {
    path: '/',
    component: function AppRoot() {
      return <RouteView />;
    } as React.FC,
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
        path: '/quote',
        component: QuoteLayout,
        routes: [
          {
            path: '/quote/skip',
            component: LoadableQuoteStepSkipFlow,
          },
          {
            path: '/quote/lettuce',
            component: LoadableQuoteStepLettuce,
          },
          {
            path: '/quote/lettucepiece',
            component: LoadableQuoteStepLettucepiece,
          },
          {
            path: '/quote/builder',
            component: LoadableQuoteBuilder,
          },
          {
            path: '/quote',
            redirect: '/quote/skip',
          },
          {
            path: '/quote/*',
            redirect: '/quote',
          },
        ],
      },
      {
        path: '*',
        redirect: '/index',
      },
    ],
  },
];

export default routes;
