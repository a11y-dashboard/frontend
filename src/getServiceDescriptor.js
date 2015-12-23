const promisedXhr = require('./promisedXhr');

module.exports = () => {
  return promisedXhr('get', {
    uri: '/service.json',
  }).then((obj) => obj.body);
};
