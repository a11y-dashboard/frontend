import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Home from './components/Home';
import Details from './components/Details';
import App from './components/App';

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/details/:project/:timestamp/" component={Details} />
    </Route>
  </Router>
), document.getElementById('main'));
