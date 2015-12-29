const logger = require('./logger');
const Finch = require('finchjs');
const routes = {
  home: require('./routes/home'),
  details: require('./routes/details'),
};

function stopSpinning() {
  AJS.$('.spinner').spinStop();
}

function setupRoute(name, bindings, cb) {
  const targetNode = document.getElementById('main');
  logger.debug(`${name} route`, bindings, targetNode);

  AJS.$('.spinner').spin();
  targetNode.innerHTML = '';
  routes[name](bindings, targetNode)
  .then(stopSpinning, stopSpinning)
  .then(cb, (err) => logger.error(err));
}

Finch.route('details/:project/:date/:level', (bindings, cb) => {
  return setupRoute('details', bindings, cb);
});

Finch.route('', (bindings, cb) => {
  return setupRoute('home', bindings, cb);
});

Finch.listen();
