'use strict'; // eslint-disable-line

const logger = require('./logger');
const promisedXhr = require('./promisedXhr.js');
const getServiceDescriptor = require('./getServiceDescriptor');
const objectAssign = require('object-assign');

let descriptorPromise = null;

module.exports = (endpoint, _opts, _method) => {
  const opts = _opts || {};
  const method = _method || 'get';

  return (descriptorPromise || (descriptorPromise = getServiceDescriptor()))
  .then((descriptor) => {
    logger.debug(`${method.toUpperCase()}ing webservice with endpoint /${endpoint}`);
    return promisedXhr(method.toLowerCase(), objectAssign({}, opts, {
      uri: `${descriptor.webservice}/${endpoint}`,
      useXDR: true,
    }));
  });
};
