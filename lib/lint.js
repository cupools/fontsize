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
  },
  inline: {
    default: true,
    coerce: function coerce(val) {
      return !!val;
    }
  },
  outputDir: {
    typeOf: 'string',
    default: _path2.default.join(__dirname, '../.extra')
  },
  disabled: {
    default: false,
    coerce: function coerce(val) {
      return !!val;
    }
  }
};