import fs from 'fs'
import path from 'path'
import Fontmin from 'fontmin'
import proof from 'proof'

import cache from './cache'
import lint from './lint'

/**
 * fontsize function
 * @param  {Object} opts
 * @param  {Root} root
 * @return {Root}
 */
async function fontsize(opts = {}, root) {
  const { resolveUrl, text } = proof(opts, lint)

  let storage = []
  root.walkAtRules(/font-face/, walkAtRule.bind(null, storage))

  const supply = combine(
    item => ({ ...item, realpath: resolveUrl(item.url) }),
    item => ({ ...item, name: getFilename(item.realpath) }),
    item => ({ ...item, text: text[item.name] || text.__default })
  )

  const targets = storage
    .map(supply)
    .filter(item => item.text && fs.existsSync(item.realpath))

  await Promise.all(targets.map(process))

  return root
}

async function process(item) {
  const { realpath, decl, text } = item
  const result = await minify(realpath, text)

  decl.value = decl.value.replace(
    /url\(["']?([\w\W]+?)["']?\)/,
    'url(\'data:application/x-font-ttf;charset=utf-8;base64,' + result + '\')'
  )
}

/**
 * minify font by fontmin
 * @param  {String} realpath
 * @param  {String} text
 * @return {Promise} resolve with tiny base64
 */
function minify(realpath, text) {
  const fromCache = cache.get(realpath, text)

  if (fromCache) {
    return Promise.resolve(fromCache)
  }

  const fontmin = new Fontmin().src(realpath)

  fontmin.use(Fontmin.glyph({
    text,
    hinting: false
  }))

  return new Promise((resolve, reject) => {
    fontmin
      .run((error, files) => {
        if (error) {
          reject(error)
        }

        const result = files[0].contents.toString('base64')
        cache.set(realpath, text, result)
        resolve(result)
      })
  })
}

/**
 * walk atRule node and collect `src` declaration
 * @param  {Array} targets
 * @param  {atRule} atRule
 * @return
 */
function walkAtRule(targets, atRule) {
  atRule.walkDecls(/src/, decl => {
    const raw = /url\(["']?([\w\W]+?)["']?\)/i.exec(decl.value)
    if (raw) {
      targets.push({ url: raw[1], decl })
    }
  })
}

/**
 * combine functions for going through at once
 * @param  {...[Function]} fn
 * @return value
 */
function combine(...fn) {
  return arg => fn.reduce((ret, f) => f.call(null, ret), arg)
}

/**
 * get file name without extname
 * @param  {String} realpath
 * @return {String} filename
 */
function getFilename(realpath) {
  return path.basename(realpath).split('.')[0]
}

export default options => fontsize.bind(null, options)
