import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import history from './history';

import Home from './routes/components/Home';
import Details from './routes/components/Details';

const logger = require('./logger');

render((
  <Router history={history}>
    <Route path="/" component={Home}>
      <IndexRoute component={Home} />
      <Route path="details/:project/:timestamp/" component={Details}/>
    </Route>
  </Router>
), document.getElementById('main'));

//require('./routing');
