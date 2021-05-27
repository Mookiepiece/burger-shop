import type { PagePlus } from '@/pages/Page.d';
import { useSsrContext } from '@/server/SsrContext';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import routes from './routes';

export const RouterViewContext = React.createContext<DocRoute[]>(routes);

export type DocRoute =
  | {
      path: string;
      exact?: true;
      redirect: string;
    }
  | {
      path: string;
      exact?: true;
      component: PagePlus;
      routes?: DocRoute[];
    };

/**
 * Note that do not using a react component as RouteView like Vue
 * because Routes should be the children of a Switch, not descendants.
 * OMG, I wrote this👆 in strawberry-fury docs
 */
export const RouteView: React.FC = () => {
  const routerViewContextValue = useContext(RouterViewContext);

  const components = useMemo(() => {
    return routerViewContextValue.map(route => {
      if ('component' in route) {
        const { component: Component, routes: children, ...rest } = route;

        const Page = () => {
          const ssrContextValue = useSsrContext();

          const [initialProps, setInitialProps] = useState(() => {
            if (ssrContextValue) return ssrContextValue.state.meta.pageInitialProps;
            if (typeof window === 'object') return (window as any).g_initialProps;
            return;
          });
          useEffect(() => {
            // umijs renderClient
            if (typeof window === 'object') (window as any).g_initialProps = null;

            const a = async () => {
              if ('load' in Component && Component.load) {
                const Page = ((await Component.load()) as any).default;
                if ('getInitialProps' in Page && Page.getInitialProps) {
                  console.log('excuted getINitialprops---', Page.getInitialProps);
                  setInitialProps(await Page.getInitialProps());
                } else {
                  setInitialProps({});
                }
                return;
              }

              if ('getInitialProps' in Component && Component.getInitialProps) {
                setInitialProps(await Component.getInitialProps());
              } else {
                setInitialProps({});
              }
            };
            if (!initialProps) {
              a();
            }
          }, [initialProps]);
          return (
            <RouterViewContext.Provider value={children || []}>
              <Component {...initialProps} />
            </RouterViewContext.Provider>
          );
        };

        return {
          component: Page,
          ...rest,
        };
      }
      return route;
    });
  }, [routerViewContextValue]);

  return components.length ? (
    <Switch>
      {components.map(route => {
        if ('redirect' in route) {
          const { path, exact, redirect } = route;
          return <Redirect key={path} from={path} exact={exact} to={redirect} />;
        }
        const { path, exact, component } = route;

        return <Route key={path} path={path} exact={exact} component={component} />;
      })}
    </Switch>
  ) : null;
};
