import App from '../App';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { StaticRouterContext } from 'react-router';
import Koa from 'koa';
import serve from 'koa-static';
import Router from '@koa/router';
import { renderToString } from 'react-dom/server';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import path from 'path';
import { loadPageGetInitialProps } from './loadPageInitialProps';
import { SsrContext } from './SsrContext';

const router = new Router();
router.get('/(.*)', async ctx => {
  // We create an extractor from the statsFile
  const extractor = new ChunkExtractor({
    statsFile: path.resolve('build/loadable-stats.json'),
    // razzle client bundle entrypoint is client.js
    entrypoints: ['client'],
  });

  const context: StaticRouterContext = {};

  const { pageInitialProps } = await loadPageGetInitialProps(ctx);

  ctx.state = {
    meta: {
      pageInitialProps,
    },
  };

  const markup = renderToString(
    <ChunkExtractorManager extractor={extractor}>
      <StaticRouter context={context} location={ctx.url}>
        <SsrContext.Provider value={ctx}>
          <App />
        </SsrContext.Provider>
      </StaticRouter>
    </ChunkExtractorManager>
  );
  context.url && ctx.redirect(context.url);

  // collect script tags
  const scriptTags = extractor.getScriptTags();

  // collect "preload/prefetch" links
  const linkTags = extractor.getLinkTags();

  // collect style tags
  const styleTags = extractor.getStyleTags();

  ctx.status = 200;
  ctx.body = `
    <!doctype html>
      <html lang="">
      <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Razzle + Koa</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${linkTags}
        ${styleTags}
        <script>window.g_initialProps = ${JSON.stringify(pageInitialProps)}</script>
      </head>
      <body>
        <div id="root">${markup}</div>
        ${scriptTags}
      </body>
    </html>`;
});

const server = new Koa();
server
  // Serve static files located under `process.env.RAZZLE_PUBLIC_DIR`
  .use(serve(process.env.RAZZLE_PUBLIC_DIR!))
  .use(router.routes())
  .use(router.allowedMethods());

export default server;
