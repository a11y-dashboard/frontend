const bunyan = require('bunyan');
const path = require('path');
const express = require('express');

const BUNYAN_LEVEL = process.env.BUNYAN_LEVEL || bunyan.INFO;
const BUNYAN_FORMAT = process.env.BUNYAN_FORMAT || undefined;
const WEBSERVICE_URL = process.env.WEBSERVICE_URL || null;
const HOST = '0.0.0.0';

const logger = bunyan.createLogger({
  name: 'a11y-dashboard',
  level: BUNYAN_LEVEL,
  format: BUNYAN_FORMAT,
});

const port = process.env.PORT || 5000;
const app = express();

app.get('/service.json', (req, res) => {
  res.json({
    webservice: WEBSERVICE_URL,
  });
});

app.get('/healthcheck', (_, res) => res.send('♥'));

if (process.env.NODE_ENV !== 'development') {
  const compression = require('compression');
  app.use(compression());

  const distFolder = path.join(__dirname, 'dist');

  app.use(express.static(distFolder));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distFolder, 'index.html'));
  });
} else {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('./webpack.config.development.js');

  const wp = webpack(webpackConfig);

  const devMiddleware = webpackDevMiddleware(wp, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
    },
  });
  app.use(devMiddleware);
  app.use(webpackHotMiddleware(wp));

  // This is for always passing index.html when using pushState
  app.get('*', (req, res) => {
    const indexFile = path.join(webpackConfig.output.path, 'index.html');
    devMiddleware.fileSystem.readFile(indexFile, (err, contents) => {
      if (err) {
        logger.error(err);
        throw err;
      }
      res.end(contents);
    });
  });
}

app.listen(port, HOST, (err) => {
  if (err) {
    return logger.error(err);
  }
  logger.info(`Listening on ${HOST}:${port}.`);
});
