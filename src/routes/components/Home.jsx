import React from 'react';
import { Chart } from 'react-google-charts';
const webserviceRequest = require('../../webserviceRequest');
const logger = require('../../logger');
const moment = require('moment');
const projects = require('../../projects.json');
const adgColors = require('../../adgColors.json');
const levels = require('../../levels.json');

import history from '../../history';

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
    webserviceRequest('overview')
      .then((obj) => obj.body)
      .then((data) => {
        const transformed = {};
        Object.keys(data).forEach((origin) => {
          const originalDatapoints = data[origin].datapoints;
          const lastMonth = moment().subtract(1, 'month');
          const validTimestamps = Object.keys(originalDatapoints).filter((timestamp) => {
            return moment(parseInt(timestamp, 10)).isAfter(lastMonth);
          });

          logger.debug('Calculate averages');
          const datapoints = validTimestamps.map((timestamp) => {
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
        logger.debug('assembling chart data');

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
            title: projects[origin],
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
          });
        });
        return state;
      })
      .then((state) => {
        this.setState({ charts: state });
      })
      .catch((err) => {
        logger.error(err);
      });
  }

  render() {
    const charts = this.state.charts.map((chartData) => {
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
              history.replaceState(null, `/details/${chartData.origin}/${timestamp}/?level=${type}`);
            }
          },
        },
      ];

      return (<div style={{ float: 'left' }} key={chartData.origin}>
                <Chart chartType="LineChart" rows={chartData.rows} columns={chartData.columns} options={chartData.options} width={"600px"} height={"250px"} chartEvents={chartEvents} />
              </div>);
    });

    return (
      <div>
        <h2>Products</h2>
        <p>Select a point of an error or warning within a chart below to show details for the according product &amp; time.</p>
        <div>
          {charts}
        </div>
      </div>
    );
  }
}

export default Home;
