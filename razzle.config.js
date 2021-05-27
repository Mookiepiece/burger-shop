/* eslint-disable @typescript-eslint/no-unused-vars */
const LoadableWebpackPlugin = require('@loadable/webpack-plugin');
const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // required by razzle
const path = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: ['scss'],
  modifyWebpackConfig({
    env: {
      target, // the target 'node' or 'web'
      dev, // is this a development build? true or false
    },
    webpackConfig, // the created webpack config
    webpackObject, // the imported webpack node module
    options: {
      razzleOptions, // the modified options passed to Razzle in the `options` key in `razzle.config.js` (options: { key: 'value'})
      webpackOptions, // the modified options that will be used to configure webpack/ webpack loaders and plugins
    },
    paths, // the modified paths that will be used by Razzle.
  }) {
    // add loadable webpack plugin only
    // when we are building the client bundle
    if (target === 'web') {
      const filename = path.resolve(__dirname, 'build');

      // saving stats file to build folder
      // without this, stats files will go into
      // build/public folder
      webpackConfig.plugins.push(
        new LoadableWebpackPlugin({
          outputAsset: false,
          writeToDisk: { filename },
        })
        // new BundleAnalyzerPlugin()
      );
    }

    // use MiniCSSExtractPLugin instead default style-loader just like in prod mode
    // to avoid no-styled screen the first frame page rendered in dev mode
    if (target === 'web' && dev) {
      const styleLoaderFinder = makeLoaderFinder('style-loader');

      // [.css, .s(a|c)ss]
      const cssRulesList = webpackConfig.module.rules.filter(styleLoaderFinder);

      if (cssRulesList.every(cssRules => cssRules.use.findIndex(styleLoaderFinder) === 0)) {
        throw new Error(`[Thimble Razzle Plugin] style-loader was not found`);
      }
      cssRulesList.forEach(cssrules => cssrules.use.shift()); // remove style loader
      cssRulesList.forEach(cssrules => cssrules.use.unshift(MiniCssExtractPlugin.loader));
      webpackConfig.plugins.push(
        new MiniCssExtractPlugin({
          filename: `${razzleOptions.cssPrefix}/bundle.[chunkhash:8].css`,
          chunkFilename: `${razzleOptions.cssPrefix}/[name].[chunkhash:8].chunk.css`,
        })
      );
    }

    return webpackConfig;
  },
  // modifyPaths({
  //   webpackObject, // the imported webpack node module
  //   options: {
  //     pluginOptions, // the options passed to the plugin ({ name:'pluginname', options: { key: 'value'}})
  //     razzleOptions, // the modified options passed to Razzle in the `options` key in `razzle.config.js` (options: { key: 'value'})
  //   },
  //   paths, // the default paths that will be used by Razzle.
  // }) {
  //   console.log({
  //     dotenv: 'D:\\Studio\\VSCodeLab\\my-app2\\.env',
  //     appPath: 'D:\\Studio\\VSCodeLab\\my-app2',
  //     appBuild: 'D:\\Studio\\VSCodeLab\\my-app2\\build',
  //     appBuildPublic: 'D:\\Studio\\VSCodeLab\\my-app2\\build\\public',
  //     appAssetsManifest: 'D:\\Studio\\VSCodeLab\\my-app2\\build\\assets.json',
  //     appChunksManifest: 'D:\\Studio\\VSCodeLab\\my-app2\\build\\chunks.json',
  //     appBuildStaticExport: 'D:\\Studio\\VSCodeLab\\my-app2\\build\\static_export.js',
  //     appBuildStaticExportRoutes: 'D:\\Studio\\VSCodeLab\\my-app2\\build\\public\\static_routes.js',
  //     appPublic: 'D:\\Studio\\VSCodeLab\\my-app2\\public',
  //     appNodeModules: 'D:\\Studio\\VSCodeLab\\my-app2\\node_modules',
  //     appSrc: 'D:\\Studio\\VSCodeLab\\my-app2\\src',
  //     appHtml: 'D:\\Studio\\VSCodeLab\\my-app2\\public\\index.html',
  //     appPackageJson: 'D:\\Studio\\VSCodeLab\\my-app2\\package.json',
  //     appServerJs: 'D:\\Studio\\VSCodeLab\\my-app2\\src\\server',
  //     appServerIndexJs: 'D:\\Studio\\VSCodeLab\\my-app2\\src',
  //     appClientIndexJs: 'D:\\Studio\\VSCodeLab\\my-app2\\src\\client',
  //     appStaticExportJs: 'D:\\Studio\\VSCodeLab\\my-app2\\src\\static_export',
  //     tsTestsSetup: 'D:\\Studio\\VSCodeLab\\my-app2\\src\\setupTests.ts',
  //     jsTestsSetup: 'D:\\Studio\\VSCodeLab\\my-app2\\src\\setupTests.js',
  //     appBabelRc: 'D:\\Studio\\VSCodeLab\\my-app2\\.babelrc',
  //     appRazzleConfig: 'D:\\Studio\\VSCodeLab\\my-app2\\razzle.config.js',
  //     nodePaths: '',
  //     ownPath: 'D:\\Studio\\VSCodeLab\\my-app2\\node_modules\\razzle',
  //     ownNodeModules: 'D:\\Studio\\VSCodeLab\\my-app2\\node_modules\\razzle\\node_modules',
  //     publicUrl: undefined,
  //     servedPath: '/',
  //     appJsConfig: 'D:\\Studio\\VSCodeLab\\my-app2\\jsconfig.json',
  //     appTsConfig: 'D:\\Studio\\VSCodeLab\\my-app2\\tsconfig.json',
  //   });
  //   // Do some stuff...
  //   return paths;
  // },
  modifyBabelOptions(defaultBabelOptions, { tagert, dev }) {
    var env = process.env.BABEL_ENV || process.env.NODE_ENV;
    if (env !== 'development' && env !== 'test' && env !== 'production') {
      throw new Error(
        'Using `babel-preset-razzle` requires that you specify `NODE_ENV` or ' +
          '`BABEL_ENV` environment variables. Valid values are "development", ' +
          '"test", and "production". Instead, received: ' +
          JSON.stringify(env) +
          '.'
      );
    }

    // tree shaking fallback in ONLY DEVELOPMENT mode https://material-ui.com/zh/guides/minimizing-bundle-size/
    // don't use in prod because webpack will auto tree shaking
    const babelPluginImport = [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'lib', // default: lib
      },
    ];

    return {
      ...defaultBabelOptions,
      presets: [
        [
          '@babel/preset-env',
          {
            useBuiltIns: 'usage',
            corejs: 3,
            modules: false,
          },
        ],
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
      plugins: [
        // Add support for async/await
        '@babel/plugin-transform-runtime',
        // loadable components
        '@loadable/babel-plugin',
      ],

      env: {
        development: {
          plugins: [babelPluginImport],
        },
        test: {
          plugins: [
            // Compiles import() to a deferred require()
            'babel-plugin-dynamic-import-node',
            // Transform ES modules to commonjs for Jest support
            ['@babel/plugin-transform-modules-commonjs', { loose: true }],
            babelPluginImport,
          ],
        },
        production: {
          plugins: ['babel-plugin-transform-react-remove-prop-types'],
        },
      },
    };
  },
};
