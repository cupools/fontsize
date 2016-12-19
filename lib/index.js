'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _fontsize = require('./fontsize');

var _fontsize2 = _interopRequireDefault(_fontsize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _postcss2.default.plugin('postcss-fontsize', function (opts) {
  return (0, _fontsize2.default)(opts);
});