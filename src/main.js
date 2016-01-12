import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import history from './history';

import Home from './routes/components/Home';
import Details from './routes/components/Details';
import App from './routes/components/App';

render((
  <Router history={history}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/details/:project/:timestamp/" component={Details}/>
    </Route>
  </Router>
), document.getElementById('main'));
