import { DocRoute } from '@/router/RouterView';
import { LoadableComponent } from '@loadable/component';
import React from 'react';

export type PagePlus<T extends { children?: DocRoute[] } | Record<string, any> = { children?: DocRoute[] }> = (
  | React.FC<any>
  | LoadableComponent<any>
) & {
  getInitialProps?: () => Promise<Partial<T> | undefined>;
};

export type Page<T extends { children?: DocRoute[] } | Record<string, any> = { children?: DocRoute[] }> =
  React.FC<T> & {
    getInitialProps?: () => Promise<Partial<T> | undefined>;
  };
