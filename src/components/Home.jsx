import React from 'react';
import { Chart } from 'react-google-charts';
const moment = require('moment');
import queryString from 'query-string';

const webserviceRequest = require('../webserviceRequest');
const logger = require('../logger');
import { browserHistory } from 'react-router';

const projects = require('../data/projects.json');
const adgColors = require('../data/adgColors.json');
const levels = require('../data/levels.json');

const columnTypes = {
  2: 'error',
  3: 'warning',
  4: 'notice',
};

class Home extends React.Component {

  constructor() {
    super();
    this.state = {
      charts: [],
    };
  }

  componentDidMount() {
    this.spinStart();
    const lastMonth = moment().subtract(4, 'weeks').format('x');
    const queryParams = {
      minTimestamp: lastMonth,
    };
    webserviceRequest(`overview?${queryString.stringify(queryParams)}`)
      .then((data) => {
        logger.debug('Calculate averages of', data);
        const transformed = {};
        Object.keys(data).forEach((origin) => {
          const originalDatapoints = data[origin].datapoints;
          const datapoints = Object.keys(originalDatapoints).map((timestamp) => {
            const datapoint = originalDatapoints[timestamp];
            const ret = {
              urls: datapoint.urls || null,
              date: new Date(parseInt(timestamp, 10)),
            };
            levels.forEach((type) => {
              ret[type] = Math.round((datapoint[type] || 0) / datapoint.urls) || null;
            });

            return ret;
          });
          transformed[origin] = datapoints;
        });
        return transformed;
      })
      .then((transformed) => {
        logger.debug('assembling chart data', transformed);

        const state = [];

        Object.keys(transformed).forEach((origin) => {
          const columns = [
            {
              type: 'datetime',
              label: 'Date',
            },
            {
              type: 'number',
              label: 'URLs',
            },
            {
              type: 'number',
              label: 'errors/URL',
            },
            {
              type: 'number',
              label: 'warnings/URL',
            },
            {
              type: 'number',
              label: 'notices/URL',
            },
          ];

          const rows = transformed[origin].map((datapoint) => {
            return [
              datapoint.date,
              datapoint.urls,
              datapoint.error,
              datapoint.warning,
              datapoint.notice,
            ];
          });

          const options = {
            pointSize: 5,
            width: 600,
            height: 250,
            legend: 'bottom',
            colors: [
              adgColors.lime,
              adgColors.red,
              adgColors.yellow,
              adgColors.blue,
            ],
            lineWidth: 2,
            hAxis: {
              format: 'd.M.yy',
            },
            vAxis: {
              minValue: 0,
              format: '#',
            },
          };

          state.push({
            origin,
            columns,
            rows,
            options,
            title: projects[origin],
          });
        });
        return state;
      })
      .then((state) => {
        logger.debug('setting chart state', state);
        this.setState({ charts: state });
      })
      .catch((err) => {
        logger.error(err);
      });
  }

  spinStart() {
    logger.debug('spinner: start');
    AJS.$(this.refs.spinner).spin();
  }

  spinStop() {
    logger.debug('spinner: stop');
    AJS.$(this.refs.spinner).spinStop();
  }

  render() {
    logger.debug('rendering...');
    let charts;
    if (this.state.charts.length) {
      const chartRenderPromises = [];
      charts = this.state.charts.map((chartData) => {
        const chartEvents = [
          {
            eventName: 'select',
            callback: (c) => {
              const chart = c.wrapper.getChart();
              const selection = chart.getSelection();
              const item = selection[0];
              if (!item) {
                return;
              }
              const date = chartData.rows[item.row][0];
              const type = columnTypes[item.column];
              if (type) {
                logger.debug('Clicked chart');
                const timestamp = Date.parse(date);
                browserHistory.push(`/details/${chartData.origin}/${timestamp}/?${queryString.stringify({ level: type })}`);
              }
            },
          },
        ];
        chartRenderPromises.push(new Promise((resolve, reject) => {
          chartEvents.push({
            eventName: 'ready',
            callback: resolve,
          });
          chartEvents.push({
            eventName: 'error',
            callback: reject,
          });
        }));

        return (<div className="chart-group" key={chartData.origin}>
                  <h3>{chartData.title}</h3>
                  <Chart chartType="LineChart" rows={chartData.rows} columns={chartData.columns} options={chartData.options} width={"600px"} height={"250px"} chartEvents={chartEvents} />
                </div>);
      });
      if (chartRenderPromises.length) {
        Promise.all(chartRenderPromises).then(() => {
          logger.debug('All charts rendered');
          this.spinStop();
        }, (err) => {
          logger.error('Something went wrong when rendering the charts', err);
          this.spinStop();
        });
      }
    } else {
      charts = 'No projects';
      this.spinStop();
    }

    return (
      <div className="aui-page-panel">
        <div className="aui-page-panel-inner">
          <section className="aui-page-panel-content">
            <h2>4 week overview</h2>
            <p>Click a point of an error or warning within a chart below to show details for the according project &amp; point in time.</p>
            <div ref="spinner"></div>
            <div>
              {charts}
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default Home;
