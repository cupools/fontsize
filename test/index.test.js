/* eslint-env mocha */

const fs = require('fs')
const path = require('path')
const Chai = require('chai')
const del = require('del')
const postcss = require('postcss')

const fontsize = require('../index')

Chai.should()

describe('fontsize', function () {
  const content = fs.readFileSync('test/fixtures/style.css', 'utf8')

  it('should work', (done) => {
    const root = postcss.parse(content)
    const opts = {
      resolveUrl: url => path.join(__dirname, 'fixtures', url)
    }
    fontsize(opts)(root, root.result)
    done()
  })
})
