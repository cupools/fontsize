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

var fontsize = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var root = arguments[1];

    var _proof, resolveUrl, text, targets, files;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _proof = (0, _proof3.default)(opts, _lint2.default), resolveUrl = _proof.resolveUrl, text = _proof.text;
            targets = [];

            root.walkAtRules(/font-face/, walkAtRule.bind(null, targets));

            files = targets.map(function (item) {
              return (0, _extends3.default)({}, item, { realpath: resolveUrl(item.url) });
            }).filter(function (item) {
              return !!item;
            });
            _context.next = 6;
            return _promise2.default.all(files.map(process.bind(null, text)));

          case 6:
            return _context.abrupt('return', root);

          case 7:
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

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fontmin = require('fontmin');

var _fontmin2 = _interopRequireDefault(_fontmin);

var _proof2 = require('proof');

var _proof3 = _interopRequireDefault(_proof2);

var _lint = require('./lint');

var _lint2 = _interopRequireDefault(_lint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function process(text, item) {
  var realpath = item.realpath,
      decl = item.decl;

  var extname = _path2.default.extname(realpath).slice(1);

  return new _promise2.default(function (resolve, reject) {
    var fontmin = new _fontmin2.default().src(realpath);

    fontmin.use(_fontmin2.default.glyph({
      text: text,
      hinting: false
    }));

    fontmin.run(function (error, files) {
      if (error) {
        reject(error);
      }

      decl.value = decl.value.replace(/url\(["']?([\w\W]+?)["']?\)/, 'url("data:application/x-font-ttf;charset=utf-8;base64,' + files[0].contents.toString('base64') + '")');
      resolve(item);
    });
  });
}

function walkAtRule(targets, atRule) {
  atRule.walkDecls(/src/, function (decl) {
    var raw = /url\(["']?([\w\W]+?)["']?\)/i.exec(decl.value);

    if (!raw) {
      return;
    }

    targets.push({
      url: raw[1],
      decl: decl
    });
  });
}

exports.default = function (options) {
  return fontsize.bind(null, options);
};