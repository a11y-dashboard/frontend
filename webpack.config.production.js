const objectAssign = require('object-assign');
const baseConfig = require('./webpack.config.js');
const webpack = require('webpack');

const config = objectAssign({}, baseConfig, {

});
config.plugins.push(new webpack.optimize.UglifyJsPlugin());

module.exports = config;
