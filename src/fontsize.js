import fs from 'fs'
import path from 'path'
import Fontmin from 'fontmin'
import proof from 'proof'

import cache from './cache'
import lint from './lint'

async function fontsize(opts = {}, root) {
  const { resolveUrl, text } = proof(opts, lint)

  let storage = []
  root.walkAtRules(/font-face/, walkAtRule.bind(null, storage))

  const targets = storage
    .map(item => ({ ...item, realpath: resolveUrl(item.url) }))
    .filter(item => fs.existsSync(item.realpath))
    .map(item => ({ ...item, name: getFilename(item.realpath) }))

  await Promise.all(targets.map(process.bind(null, text)))

  return root
}

function process(text, item) {
  const { realpath, decl } = item
  const fromCache = cache.get(realpath, text)

  if (fromCache) {
    return Promise.resolve(fromCache)
  }

  return new Promise((resolve, reject) => {
    const fontmin = new Fontmin().src(realpath)

    fontmin.use(Fontmin.glyph({
      text,
      hinting: false
    }))

    fontmin
      .run((error, files) => {
        if (error) {
          reject(error)
        }

        const result = files[0].contents.toString('base64')
        decl.value = decl.value.replace(
          /url\(["']?([\w\W]+?)["']?\)/,
          'url(\'data:application/x-font-ttf;charset=utf-8;base64,' + result + '\')'
        )

        cache.set(realpath, text, result)
        resolve(item)
      })
  })
}

function walkAtRule(targets, atRule) {
  atRule.walkDecls(/src/, decl => {
    const raw = /url\(["']?([\w\W]+?)["']?\)/i.exec(decl.value)

    if (!raw) {
      return
    }

    targets.push({
      url: raw[1],
      decl
    })
  })
}

function getFilename(realpath) {
  return path.basename(realpath).split('.')[0]
}

export default options => fontsize.bind(null, options)
