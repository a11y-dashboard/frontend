const moment = require('moment');
const logger = require('../logger');
const projects = require('../projects.json');
const adgColors = require('../adgColors.json');

const Promise = require('es6-promise').Promise;
const levels = require('../levels.json');

import history from '../history';

const columnTypes = {
  2: 'error',
  3: 'warning',
  4: 'notice',
};

function drawChart(datapoints, origin, target) {
  const data = new google.visualization.DataTable();
  data.addColumn('datetime', 'Date');
  data.addColumn('number', 'URLs');
  data.addColumn('number', 'errors/URL');
  data.addColumn('number', 'warnings/URL');
  data.addColumn('number', 'notices/URL');

  const rows = datapoints.map((datapoint) => {
    return [
      datapoint.date,
      datapoint.urls,
      datapoint.error,
      datapoint.warning,
      datapoint.notice,
    ];
  });
  data.addRows(rows);

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

  const chart = new google.visualization.LineChart(target);

  chart.draw(data, options);

  // Add our selection handler.
  google.visualization.events.addListener(chart, 'select', () => {
    const selection = chart.getSelection();
    const item = selection[0];
    if (!item) {
      return;
    }
    const date = data.getValue(item.row, 0);
    const type = columnTypes[item.column];
    if (type) {
      logger.debug('Clicked chart');
      const timestamp = Date.parse(date);
      history.replaceState(null, `details/${origin}/${timestamp}/?level=${type}`);
    }
  });
}

function drawPerProductCharts(p, originContainer) {
  Object.keys(p).forEach((origin) => {
    const originalDatapoints = p[origin].datapoints;
    const lastWeek = moment().subtract(1, 'month');
    const validTimestamps = Object.keys(originalDatapoints).filter((timestamp) => {
      return moment(parseInt(timestamp, 10)).isAfter(lastWeek);
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

    const target = document.createElement('div');
    target.style.float = 'left';
    originContainer.appendChild(target);
    drawChart(datapoints, origin, target);
  });
}

function googleLoaded() {
  return googleLoaded.promise || (googleLoaded.promise = new Promise((resolve) => {
    google.load('visualization', '1.1', {
      packages: ['corechart'],
      language: 'en-AU',
    });
    logger.debug('Waiting for google onLoad');
    google.setOnLoadCallback(resolve);
  }));
}

export default (data, targetNode) => {
  return googleLoaded().then(() => drawPerProductCharts(data, targetNode));
};
