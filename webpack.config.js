require('@babel/register');

let config;
switch(process.env.NODE_ENV) {
  default:
    config = require('./webpack/base.webpack.js').default;
    config.mode = 'development';
}

module.exports = config;
