import { DocRoute } from '../router/RouteView';
import { LoadableComponent } from '@loadable/component';
import Gloading from '@/utils/Gloading';

/**
 * get current page component getInitialProps data
 * @param params
 */
export const loadPageGetInitialProps = async (
  routesMatched: {
    path: string;
    component: React.FC<{ children: DocRoute[] }> | LoadableComponent<{ children: DocRoute[] }>;
  }[]
): Promise<{
  pageInitialProps: any;
  routesMatched: any;
}> => {
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

/**
 * get current page component getInitialProps data
 * @param params
 */
export const loadPages = async (
  routesMatched: {
    path: string;
    component: React.FC<{ children: DocRoute[] }> | LoadableComponent<{ children: DocRoute[] }>;
  }[]
): Promise<void> => {
  Gloading.lock();
  await Promise.all(
    routesMatched.map(async ({ component }) => {
      let Component: any = component;
      console.log('23', Component?.load);
      // preload for dynamicImport
      if (Component?.load) {
        const preloadComponent = await Component.load();
        console.log('3', preloadComponent);
        Component = preloadComponent?.default || preloadComponent;
      }
    })
  );
  Gloading.unlock();
};
