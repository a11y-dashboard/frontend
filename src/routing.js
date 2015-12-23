const logger = require('./logger');
const Finch = require('finchjs');
const routes = {
  home: require('./routes/home'),
  details: require('./routes/details'),
};

function makeVisible(view) {
  return () => {
    Array.prototype.slice.call(document.querySelectorAll('#main > div')).forEach((div) => {
      const display = (div.id === view) ? 'block' : 'none';
      logger.debug(`Setting display of #${div.id} to ${display}`);
      div.style.display = display;
    });
  };
}

Finch.route('details/:project/:date/:level', (bindings, cb) => {
  logger.debug('Detail route', bindings);
  routes.details(bindings)
  .then(makeVisible('details'))
  .then(cb);
});

Finch.route('', (bindings, cb) => {
  logger.debug('Home route');
  routes.home()
  .then(makeVisible('home'))
  .then(cb);
});

Finch.listen();
