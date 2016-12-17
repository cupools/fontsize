const fontmin = require('fontmin')
const path = require('path')
const proof = require('proof').default

const lint = require('./lint')

function fontsize(opts, root) {
  const { resolveUrl } = proof(opts, lint)

  root.walkAtRules(/font-face/, walkAtRule.bind(null, resolveUrl))
}

function walkAtRule(resolveUrl, atRule) {
  atRule.walkDecls(/src/, decl => {
    const raw = /url\(["']?([\w\W]+?)["']?\)/i.exec(decl.value)

    if (!raw) {
      return
    }

    const filepath = resolveUrl(raw[1])
    const extname = path.extname(filepath).slice(1) // TODO assert

    if (extname === 'otf') {
      
    }

  })
}

module.exports = options => fontsize.bind(null, options)
