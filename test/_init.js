const waitOn = require('wait-on');
const ENDPOINT = process.env.ENDPOINT;

before(function testWithTimeout(done) {
  this.timeout(60000);

  waitOn({
    resources: [
      `tcp:${ENDPOINT}:5000`,
    ],
  }, (err) => done(err));
});
