const promisedXhr = require('./promisedXhr');

module.exports = () => promisedXhr('get', {
  uri: '/service.json',
}).then((obj) => obj.body);
