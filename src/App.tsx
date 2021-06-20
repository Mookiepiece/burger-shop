import React, { useEffect } from 'react';
import './App.scss';
import 'nprogress/nprogress.css';
import 'starfall/src/_theme/index.scss';
import { RouteView } from '@/router/RouteView';
import { RouterProvider } from './router/Router';
import routes from './router/routes';
import LoadingSpin from './components/LoadingSpin';
import { useGloading } from './utils/Gloading';
import { useLocation } from 'react-router';
import { useHistory } from 'react-router-dom';
import { Modal } from 'starfall';

const App: React.FC = () => {
  const loading = useGloading();
  const location = useLocation();

  useEffect(() => {
    console.log('histry', location.pathname);
  }, [location.pathname]);

  return (
    <RouterProvider>
      <>
        <div style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : undefined }}>
          <RouteView root={routes} />
        </div>
        {/* <LoadingSpin loading={loading} /> */}
        <MyPrompt />
      </>
    </RouterProvider>
  );
};

const MyPrompt = () => {
  const history = useHistory();

  useEffect(() => {
    const unlock = history.block((props, action) => {
      if (action === 'POP' && Modal.registry.length) {
        Modal.Mitt.emit('REMOTE_CLOSE', Modal.registry.slice(-1)[0]);
        return false;
      }
    });

    return unlock;
  });
  return null;
};
export default App;
