/* eslint-env mocha */

import fs from 'fs'
import path from 'path'
import postcss from 'postcss'
import postcssFontsize from '../src/index'
import './helper'

describe('index', function () {
  this.timeout(2e4)

  before(() => {
    if (!fs.existsSync('test/tmp')) {
      fs.mkdir('test/tmp')
    }
  })

  const content = fs.readFileSync('test/fixtures/ttf.css', 'utf8')
  const opts = {
    resolveUrl: url => path.join(__dirname, 'fixtures', url),
    text: 'hello world'
  }

  it('should work with ttf', done => {
    postcssFontsize.process(content, opts)
      .then(result => {
        fs.writeFileSync('test/tmp/ttf.css', result.css)
        done()
      })
  })

  it('should work as postcss plugin', () => {
    return postcss().use(postcssFontsize(opts)).process(content).should.be.fulfilled
  })

  it('should work with expose function', () => {
    return postcssFontsize.process(content, opts).should.be.fulfilled
  })
})
