const moment = require('moment/moment');
const xhr = require('xhr');
const Promise = require('es6-promise').Promise;
const debug = require('debug');

const logger = {
  debug: debug('a11y-dashboard:debug'),
  error: debug('a11y-dashboard:error'),
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

function drawOverallChart(p) {
  const aggregated = {};
  Object.keys(p).forEach((origin) => {
    aggregated[origin] = {};
  });
}

function drawChart(datapoints, title, target) {
  const data = new google.visualization.DataTable();
  data.addColumn('datetime', 'Date');
  data.addColumn('number', 'errors');
  data.addColumn('number', 'warnings');
  data.addColumn('number', 'notices');

  const rows = Object.keys(datapoints).map((timestamp) => {
    const x = datapoints[timestamp];
    return [
      new Date(parseInt(timestamp, 10)),
      parseInt(x.error, 10) || null,
      parseInt(x.warning, 10) || null,
      parseInt(x.notice, 10) || null,
    ];
  });
  data.addRows(rows);

  const options = {
    title,
    pointSize: 5,
    width: 600,
    height: 250,
    legend: 'bottom',
    colors: [adgColors.red, adgColors.yellow, adgColors.blue],
    lineWidth: 2,
    hAxis: {
      format: 'd.M.yy',
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

    const datapoints = p[origin].datapoints;
    const dataPointsPerStandard = {};
    Object.keys(datapoints).forEach((timestamp) => {
      const isWithinLastHalfYear = moment(parseInt(timestamp, 10)).isAfter(moment().subtract(6, 'month'));
      if (isWithinLastHalfYear) {
        Object.keys(datapoints[timestamp]).forEach((standard) => {
          dataPointsPerStandard[standard] = dataPointsPerStandard[standard] || {};
          dataPointsPerStandard[standard][timestamp] = datapoints[timestamp][standard];
        });
      }
    });

    Object.keys(dataPointsPerStandard).forEach((standard) => {
      const target = document.createElement('div');
      originContainer.appendChild(target);

      const title = origin + '/' + standard;
      drawChart(dataPointsPerStandard[standard], title, target);
    });
  });
}

function drawCharts(p) {
  drawOverallChart(p);
  drawPerProductCharts(p);
}

function init() {
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
