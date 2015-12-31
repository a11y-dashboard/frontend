import homeRoute from './routes/home.jsx';
import detailsRoute from './routes/details.jsx';

const logger = require('./logger');
const Finch = require('finchjs');
const routes = {
  home: homeRoute,
  details: detailsRoute,
};

function stopSpinning() {
  logger.debug('stopping spinner');
  AJS.$('#routeSpinner').spinStop();
}

function setupRoute(name, bindings, cb) {
  const targetNode = document.getElementById('main');
  logger.debug(`${name} route`, bindings, targetNode);

  AJS.$('#routeSpinner').spin();
  targetNode.innerHTML = '';

  routes[name](bindings, targetNode)
  .then(stopSpinning, (err) => {
    stopSpinning();
    throw err;
  })
  .then(() => {
    logger.debug('calling route callback');
    cb();
  })
  .catch((err) => logger.error(err));
}

Finch.route('details/:project/:timestamp/', (bindings, cb) => {
  return setupRoute('details', bindings, cb);
});

Finch.route('', (bindings, cb) => {
  return setupRoute('home', bindings, cb);
});

Finch.listen();
