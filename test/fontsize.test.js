/* eslint-env mocha */

import fs from 'fs'
import path from 'path'
import postcss from 'postcss'

import fontsize from '../src/fontsize'
import './helper'

describe('fontsize', function () {
  this.timeout(1e4)

  it('should work', () => {
    const content = fs.readFileSync('test/fixtures/ttf.css', 'utf8')
    const root = postcss.parse(content)
    const opts = {
      resolveUrl: url => path.join(__dirname, 'fixtures', url),
      text: 'hello world'
    }

    return fontsize(opts)(root).should.be.fulfilled
  })

  it('should work with multiple font', () => {
    const content = fs.readFileSync('test/fixtures/main.css', 'utf8')
    const root = postcss.parse(content)
    const opts = {
      resolveUrl: url => path.join(__dirname, 'fixtures', url),
      text: 'hello world'
    }

    return fontsize(opts)(root).should.be.fulfilled
  })

  it('should work with multiple font and difference text', () => {
    const content = fs.readFileSync('test/fixtures/main.css', 'utf8')
    const root = postcss.parse(content)
    const opts = {
      resolveUrl: url => path.join(__dirname, 'fixtures', url),
      text: {
        FZHTJT: 'hello world',
        SentyBrush: 'miss'
      }
    }

    return fontsize(opts)(root).should.be.fulfilled
  })

  it('should work with default resolveUrl', () => {
    const content = fs.readFileSync('test/fixtures/ttf.css', 'utf8')
    const root = postcss.parse(content)
    const opts = {
      text: 'hello world'
    }

    return fontsize(opts)(root).should.be.fulfilled
  })

  it('should be rejected with empty options', () => {
    const content = fs.readFileSync('test/fixtures/ttf.css', 'utf8')
    const root = postcss.parse(content)

    return fontsize()(root).should.be.rejected
  })

  it('should work with expected declaration ', () => {
    const content = '@font-face { src: "unknown value"; }'
    const root = postcss.parse(content)
    const opts = {
      text: 'hello world'
    }

    return fontsize(opts)(root).should.be.fulfilled
  })
})
