import fs from 'fs'
import path from 'path'
import Fontmin from 'fontmin'
import proof from 'proof'
import postcss from 'postcss'

import lint from './lint'

async function fontsize(opts = {}, root) {
  const { resolveUrl, inject, text } = proof(opts, lint)

  let targets = []

  if (inject) {
    targets.push(appendAtRule(root, inject))
  } else {
    root.walkAtRules(/font-face/, walkAtRule.bind(null, targets))
  }

  const files = targets
    .map(item => ({ ...item, realpath: resolveUrl(item.url) }))
    .filter(item => fs.existsSync(item.realpath))

  await Promise.all(files.map(process.bind(null, text)))

  return root
}

function process(text, item) {
  const { realpath, decl } = item
  const extname = path.extname(realpath).slice(1)

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

        decl.value = decl.value.replace(
          /url\(["']?([\w\W]+?)["']?\)/,
          'url(\'data:application/x-font-ttf;charset=utf-8;base64,' + files[0].contents.toString('base64') + '\')'
        )

        resolve(item)
      })
  })
}

function appendAtRule(root, inject) {
  const fontname = path.basename(inject).split('.')[0]
  const body = postcss.parse(`
    @font-face {
      src: url('${inject}') format('truetype');
      font-family: '${fontname}';
      font-style: normal;
      font-weight: normal;
    }
  `)

  root.append(body.first)
  const decl = root.last.nodes[0]

  return {
    url: inject,
    decl
  }
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

export default options => fontsize.bind(null, options)
