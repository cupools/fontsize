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

    var _proof, resolveUrl, inject, text, targets, files;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _proof = (0, _proof3.default)(opts, _lint2.default), resolveUrl = _proof.resolveUrl, inject = _proof.inject, text = _proof.text;
            targets = [];


            if (inject) {
              targets.push(appendAtRule(root, inject));
            } else {
              root.walkAtRules(/font-face/, walkAtRule.bind(null, targets));
            }

            files = targets.map(function (item) {
              return (0, _extends3.default)({}, item, { realpath: resolveUrl(item.url) });
            }).filter(function (item) {
              return _fs2.default.existsSync(item.realpath);
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

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fontmin = require('fontmin');

var _fontmin2 = _interopRequireDefault(_fontmin);

var _proof2 = require('proof');

var _proof3 = _interopRequireDefault(_proof2);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

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

      decl.value = decl.value.replace(/url\(["']?([\w\W]+?)["']?\)/, 'url(\'data:application/x-font-ttf;charset=utf-8;base64,' + files[0].contents.toString('base64') + '\')');

      resolve(item);
    });
  });
}

function appendAtRule(root, inject) {
  var fontname = _path2.default.basename(inject).split('.')[0];
  var body = _postcss2.default.parse('\n    @font-face {\n      src: url(\'' + inject + '\') format(\'truetype\');\n      font-family: \'' + fontname + '\';\n      font-style: normal;\n      font-weight: normal;\n    }\n  ');

  root.append(body.first);
  var decl = root.last.nodes[0];

  return {
    url: inject,
    decl: decl
  };
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