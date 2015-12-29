const logger = require('../logger');
const webserviceRequest = require('../webserviceRequest');
const queryString = require('query-string');
const _ = require('lodash');
const hljs = require('highlight.js');

require('highlight.js/styles/default.css');

const template = require('./details/index.handlebars');

require('../css/details.less');

module.exports = (options, targetNode) => {
  logger.debug('Show details', options);

  const query = queryString.stringify({
    origin: options.project,
    timestamp: options.date,
    level: options.level,
    reverseDns: options.reverseDns,
  });
  return webserviceRequest(`details?${query}`)
  .then((obj) => {
    const data = {};
    const sortedRows = _.sortByAll(obj.body, ['reverse_dns', 'origin_library', 'code', 'message', 'selector']);

    sortedRows.forEach((row) => {
      data[row.original_url] = data[row.original_url] || {};
      const errorKey = `${row.origin_library}.${row.code}`;
      data[row.original_url][errorKey] = data[row.original_url][errorKey] || {};
      data[row.original_url][errorKey][row.message] = data[row.original_url][errorKey][row.message] || [];
      data[row.original_url][errorKey][row.message].push(row);
      data[row.original_url][errorKey][row.message] = _.uniq(data[row.original_url][errorKey][row.message], 'selector');
    });

    targetNode.innerHTML = template({ data });
    hljs.initHighlighting();
  });
};
