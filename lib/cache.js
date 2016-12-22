'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cache = {};

function get(realpath, text) {
  var buffer = _fs2.default.readFileSync(realpath);
  var hash = sign(buffer, text);
  var fromCache = cache[realpath];
  return fromCache && fromCache.hash === hash ? fromCache.result : undefined;
}

function set(realpath, text, result) {
  var buffer = _fs2.default.readFileSync(realpath);
  var hash = sign(buffer, text);
  cache[realpath] = { hash: hash, result: result };

  return result;
}

function sign(buffer, text) {
  var hash = _crypto2.default.createHash('sha1');
  var content = buffer.toString('base64') + text;

  hash.update(content);
  return hash.digest('hex');
}

exports.default = { get: get, set: set };