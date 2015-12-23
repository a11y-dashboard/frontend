const moment = require('moment/moment');
const xhr = require('xhr');
const Promise = require('es6-promise').Promise;
const debug = require('debug');

const logger = {
  debug: debug('a11y-dashboard:debug'),
  error: debug('a11y-dashboard:error'),
};

const projects = {
  HALJIRA: 'JIRA',
  HALBAMBOO: 'Bamboo',
  HALCONFLUENCE: 'Confluence',
  HCC: 'hipchat.com',
  WAC: 'atlassian.com',
};

function getServiceDescriptor() {
  return new Promise((resolve, reject) => {
    xhr.get({
      uri: '/service.json',
    }, (err, resp, body) => {
      if (err) {
        logger.error(err);
        reject(err);
        return;
      }
      resolve(JSON.parse(body));
    });
  });
}

const adgColors = {
  lime: '#8eb021',
  blue: '#3572b0',
  red: '#d04437',
  yellow: '#f6c342',
  violet: '#654982',
  pink: '#f691b2',
};

function drawChart(datapoints, title, target) {
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
    title,
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
      return {
        error: Math.round((datapoint.error || 0) / datapoint.urls) || null,
        warning: Math.round((datapoint.warning || 0) / datapoint.urls) || null,
        notice: Math.round((datapoint.notice || 0) / datapoint.urls) || null,
        urls: datapoint.urls || null,
        date: new Date(parseInt(timestamp, 10)),
      };
    });

    const target = document.createElement('div');
    originContainer.appendChild(target);

    const title = projects[origin];
    drawChart(datapoints, title, target);
  });
}

function drawCharts(p) {
  drawPerProductCharts(p);
  AJS.$('.spinner').spinStop();
}

function init() {
  AJS.$('.spinner').spin();
  getServiceDescriptor()
    .then((descriptor) => {
      xhr.get({
        uri: `${descriptor.webservice}/overview`,
      }, (err, resp, body) => {
        drawCharts(JSON.parse(body));
      });
    })
    .catch((err) => {
      logger.error(err);
    });
}


google.load('visualization', '1.1', {
  packages: ['corechart'],
  language: 'en-AU',
});
google.setOnLoadCallback(init);
