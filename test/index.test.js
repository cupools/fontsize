/* eslint-env mocha */

import fs from 'fs'
import path from 'path'
import postcss from 'postcss'
import postcssFontsize from '../src/index'
import './helper'

describe('index', function () {
  this.timeout(2e4)

  const content = fs.readFileSync('test/fixtures/style.css', 'utf8')

  it('should work as postcss plugin', () => {
    const opts = {
      resolveUrl: url => path.join(__dirname, 'fixtures', url),
      text: 'hellow world'
    }
    return postcss().use(postcssFontsize(opts)).process(content).should.be.fulfilled
  })
})
