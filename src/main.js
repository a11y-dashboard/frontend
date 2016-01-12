import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import history from './history';

import Home from './components/Home';
import Details from './components/Details';
import App from './components/App';

render((
  <Router history={history}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/details/:project/:timestamp/" component={Details}/>
    </Route>
  </Router>
), document.getElementById('main'));
