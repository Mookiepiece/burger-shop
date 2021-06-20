import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Mitt from 'starfall/lib/_utils/mitt';
import routes from '@/router/routes';
import { matchRoutes } from 'react-router-config';
import { loadPages } from '@/server/loadPageInitialProps';

const routerMitt =
  Mitt<{
    PUSH: { path: string; state: unknown };
    REPLACE: { path: string; state: unknown };
    GO_BACK: undefined;
  }>();

export const RouterProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const history = useHistory();

  useEffect(() => {
    routerMitt.on('PUSH', async ({ path, state }) => {
      const routesMatched = matchRoutes(routes, path)
        .map(({ route }) => route)
        .filter(r => 'component' in r) as any;
      console.log(routesMatched, path);
      await loadPages(routesMatched);

      history.push(path, state);
    });
    routerMitt.on('REPLACE', ({ path, state }) => {
      history.replace(path, state);
    });
    routerMitt.on('GO_BACK', () => {
      history.goBack();
    });
  }, [history]);

  return children;
};

const Router = {
  async push(path: string, state?: unknown): Promise<void> {
    routerMitt.emit('PUSH', { path, state });
  },
  replace(path: string, state: unknown): void {
    routerMitt.emit('REPLACE', { path, state });
  },
  goBack(): void {
    routerMitt.emit('GO_BACK', undefined);
  },
};

export default Router;
