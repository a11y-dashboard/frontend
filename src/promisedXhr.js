const Promise = require('es6-promise').Promise;
const xhr = require('xhr');
const logger = require('./logger');

module.exports = (type, opts) => new Promise((resolve, reject) => {
  xhr[type](opts, (err, resp, body) => {
    if (err) {
      logger.error(err);
      reject(err);
      return;
    }
    resolve({
      response: resp,
      body: JSON.parse(body),
    });
  });
});
