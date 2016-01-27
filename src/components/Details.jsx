import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import queryString from 'query-string';
import deepEqual from 'deep-equal';
import objectAssign from 'object-assign';

import projects from '../data/projects.json';
import webserviceRequest from '../webserviceRequest';
import logger from '../logger';

import Filter from './Filter';
import List from './List';

require('../styles/details.less');

function transformCulprits(culprits) {
  const data = {};
  const sortedRows = _.sortBy(culprits, ['reverse_dns', 'origin_library', 'code', 'message', 'selector']);

  sortedRows.forEach((row) => {
    data[row.original_url] = data[row.original_url] || {};
    const errorKey = `${row.origin_library}.${row.code}`;
    data[row.original_url][errorKey] = data[row.original_url][errorKey] || {};
    data[row.original_url][errorKey][row.message] = data[row.original_url][errorKey][row.message] || {
      rows: [],
      standards: [],
      origin: row.origin_library,
      code: row.code,
    };

    const perMessage = data[row.original_url][errorKey][row.message];
    const standards = perMessage.standards;
    if (standards.indexOf(row.standard) === -1) {
      standards.push(row.standard);
      standards.sort();
    }
    perMessage.rows.push(row);
    perMessage.rows = _.uniq(perMessage.rows, 'selector');
  });
  return data;
}

class Details extends React.Component {

  constructor() {
    super();
    this.state = {
      stats: {
        urls: [],
        levels: [],
        standards: [],
      },
      query: {
        standard: [],
        level: 'error',
        reverseDns: undefined,
        origin: null,
        timestamp: null,
      },
      culprits: null,
    };
  }

  componentWillMount() {
    this.setQueryState();
  }

  componentDidMount() {
    this.spinStart();
    webserviceRequest(`details.stats?${queryString.stringify(this.getBaseQuery(this.props))}`)
    .then((stats) => {
      logger.debug('stats arrived', stats);
      return stats;
    })
    .then((stats) => {
      this.setState({
        stats,
      });
    })
    .then(() => this.updateCulprits());
  }

  componentWillReceiveProps() {
    this.setState({
      culprits: null,
    });
  }

  componentDidUpdate(prevProps) {
    const prevQuery = this.getQuery(prevProps);
    const nowQuery = this.getQuery(this.props);

    if (!deepEqual(prevQuery, nowQuery)) {
      logger.debug('query changed', prevQuery, nowQuery);
      this.updateCulprits();
    }
  }

  componentWillUnmount() {
    this.ignoreLastXhr = true;
  }

  setQueryState() {
    const query = this.getQuery(this.props);

    logger.debug('setting query state', query);
    this.setState({
      query,
    });
    return query;
  }

  getQuery(props) {
    return objectAssign({}, this.getBaseQuery(props), this.getFilterQuery(props));
  }

  getBaseQuery(props) {
    const { project, timestamp } = props.params;

    return {
      origin: project,
      timestamp,
    };
  }

  getFilterQuery(props) {
    const { query } = props.location;
    // by default we will select Section508 and WCAG2AA to show (if available)
    const queryStandards = query.standards instanceof Array ? query.standards : [query.standards];
    const selectedStandards = query.standards ? queryStandards : _.intersection(this.state.stats.standards, ['wcag2aa', 'section508']);

    return {
      standard: selectedStandards,
      level: query.level || 'error',
      reverseDns: query.reverseDns || undefined,
    };
  }

  updateCulprits() {
    logger.debug('Updating culprits');
    this.spinStart();
    const queryParams = this.setQueryState();

    return webserviceRequest(`details?${queryString.stringify(queryParams)}`)
    .then((culprits) => {
      logger.debug('transform culprits', culprits);
      return transformCulprits(culprits);
    })
    .then((transformed) => {
      logger.debug('transformed culprits', transformed);
      if (!this.ignoreLastXhr) {
        this.setState({
          culprits: transformed,
        });
      }
    })
    .then(() => this.spinStop())
    .then(() => AJS.$(this.refs.spinner).hide())
    .catch((err) => logger.error(err));
  }

  spinStart() {
    AJS.$(this.refs.spinner).show();
    AJS.$(this.refs.spinner).spin();
  }

  spinStop() {
    AJS.$(this.refs.spinner).spinStop();
  }

  render() {
    const { project, timestamp } = this.props.params;
    const date = moment(+timestamp);

    let list;
    if (this.state.culprits === null) {
      list = '';
    } else if (Object.keys(this.state.culprits).length === 0) {
      list = <h3>Filter matched nothing</h3>;
    } else if (Object.keys(this.state.culprits).length) {
      list = (<List key={this.state.query.level} culprits={this.state.culprits} />);
    }
    let overview;
    let filter;
    if (this.state.culprits !== null) {
      overview = (<p className="result-count">Showing {this.state.stats.count} results from {Object.keys(this.state.stats.urls).length} URLs</p>);

      filter = (<Filter
        currentLevel={this.state.query.level}
        levels={this.state.stats.levels}
        selectedStandards={this.state.query.standard}
        standards={this.state.stats.standards}
        reverseDns={this.state.query.reverseDns || ''}
      />);
    }
    return (
      <div className="aui-page-panel">
        <div className="aui-page-panel-inner">
          <section className="aui-page-panel-sidebar">
            <h2>Filter</h2>
            {filter}
          </section>
          <section className="aui-page-panel-content">
            <h2>Results for <span>{projects[project]}</span> (<time title={date.format()}>{date.fromNow()}</time>)</h2>
            <div className="details-spinner" ref="spinner"></div>
            {overview}
            {list}
          </section>
        </div>
      </div>
    );
  }
}

Details.propTypes = {
  params: React.PropTypes.shape({
    project: React.PropTypes.string.isRequired,
    timestamp: React.PropTypes.string.isRequired,
  }),
  location: React.PropTypes.object.isRequired,
};

export default Details;
