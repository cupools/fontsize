'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  resolveUrl: {
    default: function _default(url) {
      return _path2.default.resolve(url);
    }
  },
  text: {
    required: true,
    typeOf: 'object',
    coerce: function coerce(val) {
      return Object.prototype.toString.call(val).slice(8, -1) === 'String' ? { __default: val } : val;
    }
  }
};