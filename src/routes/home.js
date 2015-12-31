const moment = require('moment');
const logger = require('../logger');
const Finch = require('finchjs');
const projects = require('../projects.json');
const adgColors = require('../adgColors.json');
const webserviceRequest = require('../webserviceRequest');
const Promise = require('es6-promise').Promise;
const levels = require('../levels.json');

const template = require('./home/index.handlebars');

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

    trendlines: {
      1: {
        type: 'linear',
        color: adgColors.red,
        opacity: 0.2,
        pointsVisible: false,
        labelInLegend: 'Error trend',
        visibleInLegend: false,
      },
      2: {
        type: 'linear',
        color: adgColors.yellow,
        opacity: 0.2,
        pointsVisible: false,
        labelInLegend: 'Warning trend',
        visibleInLegend: false,
      },
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
      Finch.navigate(`details/${origin}/${timestamp}/?level=${type}`);
    }
  });
}

function drawPerProductCharts(p) {
  const originContainerTarget = document.getElementById('products');
  Object.keys(p).forEach((origin) => {
    const originContainer = document.createElement('div');
    originContainer.style.float = 'left';
    originContainerTarget.appendChild(originContainer);

    const originalDatapoints = p[origin].datapoints;
    const lastWeek = moment().subtract(1, 'week');
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
    originContainer.appendChild(target);
    drawChart(datapoints, origin, target);
  });
}

function drawCharts(p) {
  logger.debug('about to draw charts');
  drawPerProductCharts(p);
}

function init(targetNode) {
  return webserviceRequest('overview')
    .then((obj) => {
      targetNode.innerHTML = template();
      drawCharts(obj.body);
    })
    .catch((err) => {
      logger.error(err);
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

module.exports = (options, targetNode) => {
  return googleLoaded().then(() => init(targetNode));
};
