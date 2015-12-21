const request = require('supertest');
const chai = require('chai');
chai.should();

const ENDPOINT = process.env.ENDPOINT;
const URL = `http://${ENDPOINT}:5000`;

describe('Server', () => {
  describe('GET /', () => {
    it('should respond with 200', (done) => {
      request(URL)
        .get('/')
        .expect(/Accessibility Dashboard/)
        .expect(200, done);
    });
  });
});
