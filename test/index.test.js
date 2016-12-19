/* eslint-env mocha */

import fs from 'fs'
import path from 'path'
import Chai from 'chai'
import del from 'del'
import postcss from 'postcss'
import chaiAsPromise from 'chai-as-promised'

import fontsize from '../index'

Chai.should()
Chai.use(chaiAsPromise)

describe('fontsize', function () {
  this.timeout(1e4)

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
