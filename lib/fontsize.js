'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * fontsize function
 * @param  {Object} opts
 * @param  {Root} root
 * @return {Root}
 */
var fontsize = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var root = arguments[1];

    var _proof, resolveUrl, text, inline, storage, supply, targets;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _proof = (0, _proof3.default)(opts, _lint2.default), resolveUrl = _proof.resolveUrl, text = _proof.text, inline = _proof.inline;
            storage = [];

            root.walkAtRules(/font-face/, walkAtRule.bind(null, storage));

            supply = combine(function (item) {
              return (0, _extends3.default)({}, item, { realpath: resolveUrl(item.url) });
            }, function (item) {
              return (0, _extends3.default)({}, item, { name: getFilename(item.realpath) });
            }, function (item) {
              return (0, _extends3.default)({}, item, { text: text[item.name] || text.__default });
            });
            targets = storage.map(supply).filter(function (item) {
              return item.text && _fs2.default.existsSync(item.realpath);
            });
            _context.next = 7;
            return _promise2.default.all(targets.map(process.bind(null, inline)));

          case 7:
            return _context.abrupt('return', root);

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function fontsize() {
    return _ref.apply(this, arguments);
  };
}();

var process = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(inline, item) {
    var realpath, name, decl, text, result, output, src;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            realpath = item.realpath, name = item.name, decl = item.decl, text = item.text;
            _context2.next = 3;
            return minify(realpath, text);

          case 3:
            result = _context2.sent;
            output = inline && _path2.default.join(__dirname, '../.extra', name);
            src = inline ? 'url(\'data:application/x-font-ttf;charset=utf-8;base64,' + result + '\')' : 'url(\'' + output + '\')';


            decl.value = decl.value.replace(/url\(["']?([\w\W]+?)["']?\)/, src);

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function process(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * minify font by fontmin
 * @param  {String} realpath
 * @param  {String} text
 * @return {Promise} resolve with tiny base64
 */


var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fontmin = require('fontmin');

var _fontmin2 = _interopRequireDefault(_fontmin);

var _proof2 = require('proof');

var _proof3 = _interopRequireDefault(_proof2);

var _cache = require('./cache');

var _cache2 = _interopRequireDefault(_cache);

var _lint = require('./lint');

var _lint2 = _interopRequireDefault(_lint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function minify(realpath, text) {
  var fromCache = _cache2.default.get(realpath, text);

  if (fromCache) {
    return _promise2.default.resolve(fromCache);
  }

  var fontmin = new _fontmin2.default().src(realpath);

  fontmin.use(_fontmin2.default.glyph({
    text: text,
    hinting: false
  }));

  return new _promise2.default(function (resolve, reject) {
    fontmin.run(function (error, files) {
      if (error) {
        reject(error);
      }

      var result = files[0].contents.toString('base64');
      _cache2.default.set(realpath, text, result);
      resolve(result);
    });
  });
}

/**
 * walk atRule node and collect `src` declaration
 * @param  {Array} targets
 * @param  {atRule} atRule
 * @return
 */
function walkAtRule(targets, atRule) {
  atRule.walkDecls(/src/, function (decl) {
    var raw = /url\(["']?([\w\W]+?)["']?\)/i.exec(decl.value);
    if (raw) {
      targets.push({ url: raw[1], decl: decl });
    }
  });
}

/**
 * combine functions for going through at once
 * @param  {...[Function]} fn
 * @return value
 */
function combine() {
  for (var _len = arguments.length, fn = Array(_len), _key = 0; _key < _len; _key++) {
    fn[_key] = arguments[_key];
  }

  return function (arg) {
    return fn.reduce(function (ret, f) {
      return f.call(null, ret);
    }, arg);
  };
}

/**
 * get file name without extname
 * @param  {String} realpath
 * @return {String} filename
 */
function getFilename(realpath) {
  return _path2.default.basename(realpath).split('.')[0];
}

exports.default = function (options) {
  return fontsize.bind(null, options);
};