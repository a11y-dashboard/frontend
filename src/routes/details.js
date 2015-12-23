const logger = require('../logger');
const Promise = require('es6-promise').Promise;

module.exports = (options) => {
  logger.debug('Show details', options);
  return Promise.resolve();
};
