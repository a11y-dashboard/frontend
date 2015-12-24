const logger = require('../logger');
const webserviceRequest = require('../webserviceRequest');
const queryString = require('query-string');
const mustache = require('mustache');

const template = require('./details/table.html');

module.exports = (options) => {
  logger.debug('Show details', options);

  const query = queryString.stringify({
    origin: options.project,
    timestamp: options.date,
    level: options.level,
  });
  return webserviceRequest(`details?${query}`)
  .then((obj) => {
    logger.debug('obj', obj.body);

    const rendered = mustache.render(template, { rows: obj.body });
    document.getElementById('table').innerHTML = rendered;
  });
};
