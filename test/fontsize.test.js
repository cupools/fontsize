/* eslint-env mocha */

import fs from 'fs'
import path from 'path'
import postcss from 'postcss'

import fontsize from '../src/fontsize'
import './helper'

describe('fontsize', function () {
  this.timeout(2e4)

  it('should work', () => {
    const content = fs.readFileSync('test/fixtures/ttf.css', 'utf8')
    const root = postcss.parse(content)
    const opts = {
      resolveUrl: url => path.join(__dirname, 'fixtures', url),
      text: 'hello world'
    }

    return fontsize(opts)(root, root.result).should.be.fulfilled
  })

  it('should work with inject', () => {
    const content = ''
    const root = postcss.parse(content)
    const opts = {
      text: 'hello world',
      inject: 'test/fixtures/font/SentyBrush.ttf'
    }

    return fontsize(opts)(root, root.result).should.be.fulfilled.then(result => {
      result.toString().should.have.atRule('font-face').and.decl('src')
    })
  })
})
