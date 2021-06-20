import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import App from '../App';
import Gloading from '@/utils/Gloading';

Gloading.lock();
loadableReady().then(() => {
  hydrate(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('root')
  );
  Gloading.unlock();
});

if (module.hot) {
  module.hot.accept();
}
