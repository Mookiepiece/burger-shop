import type { PagePlus } from '@/pages/Page.d';
import { useSsrContext } from '@/server/SsrContext';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router';

const RouterViewContext = React.createContext<DocRoute[]>([]);

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
export const RouteView: React.FC<{ root?: DocRoute[]; from?: string }> = React.memo(function RouteView({ root, from }) {
  const _routerViewContextValue = useContext(RouterViewContext);

  const myRoutes = root || _routerViewContextValue;

  const components = useMemo(() => {
    return myRoutes.map(route => {
      if ('component' in route) {
        const { component: Component, routes: children, ...rest } = route;

        const Page = React.memo(function Page() {
          const ssrContextValue = useSsrContext();

          const [initialProps, setInitialProps] = useState(() => {
            if (ssrContextValue) return ssrContextValue.state.meta.pageInitialProps;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (typeof window === 'object') return (window as any).g_initialProps;
            return;
          });

          useEffect(() => {
            // umijs renderClient
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (typeof window === 'object') (window as any).g_initialProps = null;

            const excuteGetInitialProps = async () => {
              if ('load' in Component && Component.load) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const Page = ((await Component.load()) as any).default;

                if ('getInitialProps' in Page && Page.getInitialProps) {
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
              excuteGetInitialProps();
            }
          }, [initialProps, ssrContextValue]);
          return (
            <RouterViewContext.Provider value={children || []}>
              <Component {...initialProps} />
            </RouterViewContext.Provider>
          );
        });

        return {
          component: Page,
          ...rest,
        };
      }
      return route;
    });
  }, [myRoutes]);

  return components.length ? (
    <Switch>
      {components.map(route => {
        if ('redirect' in route) {
          const { path, exact, redirect } = route;
          return <Redirect key={path} from={path} exact={exact} to={redirect} />;
        }
        const { path, exact, component: C } = route;

        return <Route key={path} path={path} exact={exact} render={() => <C />} />;
      })}
    </Switch>
  ) : null;
});
