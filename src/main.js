const moment = require('moment/moment');
const xhr = require('xhr');

google.load('visualization', '1.1', {packages: ['corechart'], 'language': 'en-AU'});
google.setOnLoadCallback(init);

function init() {
  xhr.get({
      uri: WEBSERVICE_URL + "/overview"
  }, function (err, resp, body) {
    drawCharts(JSON.parse(body));
  });
}


var adgColors = {
  lime: "#8eb021",
  blue: "#3572b0",
  red: "#d04437",
  yellow: "#f6c342",
  violet: "#654982",
  pink: "#f691b2"
};

function drawCharts(p) {
  drawOverallChart(p);
  drawPerProductCharts(p);
}

function drawOverallChart(p) {
  var overallTarget = document.getElementById('overall');
  var aggregated = {};
  Object.keys(p).forEach(function(origin) {
    aggregated[origin] = {};

  });
}

function drawPerProductCharts(p) {
  var originContainerTarget = document.getElementById('products');
  Object.keys(p).forEach(function(origin) {
    var originContainer = document.createElement('div');
    originContainer.style.float = 'left';
    originContainerTarget.appendChild(originContainer);

    var datapoints = p[origin].datapoints;
    var dataPointsPerStandard = {}
    Object.keys(datapoints).forEach(function(timestamp) {
      var isWithinLastHalfYear = moment(parseInt(timestamp, 10)).isAfter(moment().subtract(6, 'month'));
      if(isWithinLastHalfYear) {
        Object.keys(datapoints[timestamp]).forEach(function(standard) {
          dataPointsPerStandard[standard] = dataPointsPerStandard[standard] || {};
          dataPointsPerStandard[standard][timestamp] = datapoints[timestamp][standard];
        });
      }
    });

    Object.keys(dataPointsPerStandard).forEach(function(standard) {
      var target = document.createElement('div');
      originContainer.appendChild(target);

      var title = origin + '/' + standard;
      drawChart(dataPointsPerStandard[standard], title, target);
    });

  });
}

function drawChart(datapoints, title, target) {

  var data = new google.visualization.DataTable();
  data.addColumn('datetime', 'Date');
  data.addColumn('number', 'errors');
  data.addColumn('number', 'warnings');
  data.addColumn('number', 'notices');

  var rows = Object.keys(datapoints).map(function(timestamp) {
    var x = datapoints[timestamp];
    return [
        new Date(parseInt(timestamp, 10)),
        parseInt(x.error, 10) || null,
        parseInt(x.warning, 10) || null,
        parseInt(x.notice, 10) || null
    ];
  });
  data.addRows(rows);

  var options = {
    title: title,
    pointSize: 5,
    width: 600,
    height: 250,
    legend: 'bottom',
    colors: [adgColors.red, adgColors.yellow, adgColors.blue],
    lineWidth: 2,
    hAxis: {
       format: 'd.M.yy'
     }
  };

  var chart = new google.visualization.LineChart(target);

  chart.draw(data, options);
}
