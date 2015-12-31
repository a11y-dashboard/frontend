import React from 'react';
import chartEngine from '../home';
const webserviceRequest = require('../../webserviceRequest');
const logger = require('../../logger');

class Home extends React.Component {
  componentDidMount() {
    const self = this;

    webserviceRequest('overview')
      .then((obj) => obj.body)
      .then((data) => {
        self.setState(data);
        chartEngine(data, self.refs.products);
      })
      .catch((err) => {
        logger.error(err);
      });
  }

  render() {
    return (
      <div>
        <h2>Products</h2>
        <p>Select a point of an error or warning within a chart below to show details for the according product &amp; time.</p>
        <p ref="products"></p>
      </div>
    );
  }
}

export default Home;
