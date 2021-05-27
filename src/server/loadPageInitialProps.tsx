import { matchRoutes } from 'react-router-config';
import { DocRoute } from '../router/RouterView';
import routes from '../router/routes';
import type { Context } from 'koa';
import { LoadableComponent } from '@loadable/component';

/**
 * get current page component getInitialProps data
 * @param params
 */
export const loadPageGetInitialProps = async (
  ctx: Context
): Promise<{
  pageInitialProps: any;
  routesMatched: any;
}> => {
  const routesMatched: {
    path: string;
    component: React.FC<{ children: DocRoute[] }> | LoadableComponent<{ children: DocRoute[] }>;
  }[] = matchRoutes(routes, ctx.path)
    .map(({ route }) => route)
    .filter(r => 'component' in r) as any;

  const promises = routesMatched
    .map(async ({ component }) => {
      let Component: any = component;
      // preload for dynamicImport
      if (Component?.load) {
        const preloadComponent = await Component.load();
        Component = preloadComponent?.default || preloadComponent;
      }

      if (Component?.getInitialProps) {
        return Component.getInitialProps ? await Component.getInitialProps() : {};
      }
    })
    .filter(Boolean);
  // umi这里把所有initialProps合并成一个了
  const pageInitialProps = (await Promise.all(promises)).reduce((acc, curr) => Object.assign({}, acc, curr), {});
  return {
    pageInitialProps,
    routesMatched,
  };
};
