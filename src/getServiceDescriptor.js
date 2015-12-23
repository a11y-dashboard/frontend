const xhr = require('xhr');
const logger = require('./logger');
const Promise = require('es6-promise').Promise;

module.exports = () => {
  return new Promise((resolve, reject) => {
    xhr.get({
      uri: '/service.json',
    }, (err, resp, body) => {
      if (err) {
        logger.error(err);
        reject(err);
        return;
      }
      resolve(JSON.parse(body));
    });
  });
};
