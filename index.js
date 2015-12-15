const bunyan = require('bunyan');
const path = require('path');
const express = require('express');

const BUNYAN_LEVEL = process.env.BUNYAN_LEVEL || bunyan.INFO;
const BUNYAN_FORMAT = process.env.BUNYAN_FORMAT || undefined;
const logger = bunyan.createLogger({
  name: 'a11y-dashboard',
  level: BUNYAN_LEVEL,
  format: BUNYAN_FORMAT,
});

const port = process.env.PORT || 5000;
const app = express();

if (process.env.NODE_ENV !== 'development') {
  const compression = require('compression');
  app.use(compression());

  const distFolder = path.join(__dirname, 'dist');

  app.use(express.static(distFolder));
  app.get('/', function response(req, res) {
    res.sendFile(path.join(distFolder, 'index.html'));
  });
} else {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('./webpack.config.development.js');

  const wp = webpack(webpackConfig);

  app.use(webpackDevMiddleware(wp, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true
    }
  }));

  app.use(webpackHotMiddleware(wp));
}

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    return logger.error(err);
  }
  logger.info('Listening on 0.0.0.0:%s.', port);
});
