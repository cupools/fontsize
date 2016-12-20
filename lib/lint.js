'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  resolveUrl: {
    default: function _default(url) {
      return _path2.default.resolve(url);
    }
  },
  text: {
    required: true,
    typeOf: 'string'
  }
};