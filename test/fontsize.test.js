/* eslint-env mocha */

import fs from 'fs'
import path from 'path'
import postcss from 'postcss'

import fontsize from '../src/fontsize'
import './helper'

describe('fontsize', function () {
  this.timeout(2e4)

  const content = fs.readFileSync('test/fixtures/style.css', 'utf8')

  it('should work', () => {
    const root = postcss.parse(content)
    const opts = {
      resolveUrl: url => path.join(__dirname, 'fixtures', url),
      text: 'hellow world'
    }

    return fontsize(opts)(root, root.result).should.be.fulfilled
  })
})
