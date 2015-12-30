'use strict'; // eslint-disable-line

const logger = require('../logger');
const webserviceRequest = require('../webserviceRequest');
const queryString = require('query-string');
const _ = require('lodash');
const hljs = require('highlight.js');
const moment = require('moment');
const projects = require('../projects.json');
const template = require('./details/index.handlebars');
const listTemplate = require('./details/list.handlebars');
const Finch = require('finchjs');
const objectAssign = require('object-assign');

require('highlight.js/styles/default.css');
require('../css/details.less');

function transformCulprits(culprits) {
  const data = {};
  const sortedRows = _.sortByAll(culprits, ['reverse_dns', 'origin_library', 'code', 'message', 'selector']);

  sortedRows.forEach((row) => {
    data[row.original_url] = data[row.original_url] || {};
    const errorKey = `${row.origin_library}.${row.code}`;
    data[row.original_url][errorKey] = data[row.original_url][errorKey] || {};
    data[row.original_url][errorKey][row.message] = data[row.original_url][errorKey][row.message] || {
      rows: [],
      standards: [],
      origin: row.origin_library,
      code: row.code,
    };

    const perMessage = data[row.original_url][errorKey][row.message];
    const standards = perMessage.standards;
    if (standards.indexOf(row.standard) === -1) {
      standards.push(row.standard);
      standards.sort();
    }
    perMessage.rows.push(row);
    perMessage.rows = _.uniq(perMessage.rows, 'selector');
  });

  return data;
}

function getLevelElement() {
  return document.getElementById('level');
}

function $getStandardsElement() {
  return AJS.$('#standards');
}

function updateCulprits(baseQuery, params) {
  logger.debug('Updating culprits');
  const query = objectAssign({}, baseQuery, {
    level: params('type'),
    reverseDns: params('reverseDns'),
    standard: params('standard') || undefined,
  });

  logger.debug('query', query);

  getLevelElement().value = query.level;
  if (typeof query.standard !== 'undefined') {
    $getStandardsElement().val(query.standard.split(',')).trigger('change');
  }

  const list = document.getElementById('list');

  list.innerHTML = '';

  return webserviceRequest(`details?${queryString.stringify(query)}`)
  .then((obj) => obj.body)
  .then((culprits) => {
    const transformed = transformCulprits(culprits);

    list.innerHTML = listTemplate({
      data: transformed,
      urlNumber: Object.keys(transformed).length,
      culpritNumber: culprits.length,
    });

    Array.prototype.slice.call(list.querySelectorAll('pre code')).forEach(hljs.highlightBlock);
  })
  .catch((err) => logger.error(err));
}

function spinStart() {
  AJS.$('#listSpinner').spin();
}

function spinStop() {
  AJS.$('#listSpinner').spinStop();
}

function startObserve(baseQuery) {
  logger.debug('startObserve');
  Finch.observe((params) => {
    logger.debug('Observed parameters changed');
    spinStart();
    updateCulprits(baseQuery, params)
    .then(spinStop, spinStop);
  });
}

module.exports = (options, targetNode) => {
  logger.debug('Show details', options);

  const baseQuery = {
    origin: options.project,
    timestamp: options.timestamp,
  };
  const date = moment(+options.timestamp);

  return webserviceRequest(`details.stats?${queryString.stringify(baseQuery)}`)
  .then((response) => {
    const stats = response.body;
    logger.debug('stats arrived', stats);

    targetNode.innerHTML = template({
      project: projects[options.project],
      absoluteTime: date.format(),
      relativeTime: date.fromNow(),
      urlNumber: Object.keys(stats.urls).length,
      stats,
    });
  })
  .then(() => {
    logger.debug('initializing standard select');
    const select = $getStandardsElement().auiSelect2();
    select.on('change', (e) => {
      if (!e || !e.val) {
        logger.debug('ignoring change');
        return;
      }
      logger.debug(`Changed standards to ${e.val}`);
      Finch.navigate({ standard: e.val.join(',') }, true);
    });
    logger.debug('initializing level select');
    getLevelElement().addEventListener('change', (e) => {
      logger.debug(`Changed level to ${e.target.value}`);
      Finch.navigate({ type: e.target.value }, true);
    });
  })
  .then(() => startObserve(baseQuery));
};
