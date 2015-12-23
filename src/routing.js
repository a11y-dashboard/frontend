const logger = require('./logger');
const Finch = require('finchjs');
const routes = {
  home: require('./routes/home'),
  details: require('./routes/details'),
};

Finch.route('details/:project/:date/:level', (obj) => {
  logger.debug('Detail route', obj);
  routes.details(obj);
});

Finch.route('', () => {
  logger.debug('Home route');
  routes.home();
});

Finch.listen();
