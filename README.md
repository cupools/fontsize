## fontsize

Postcss plugin that minify font file and inline as base64 in stylesheet.

## Todo

- [x] base64
- [x] ttf supports
- [ ] woff supports
- [ ] friendly configuration
- [x] <s>inject font-face</s>
- [ ] <s>webpack loader</s>

## Getting Started

```bash
$ npm i -D cupools/fontsize
```

```js
import postcss from 'postcss'
import fontsize from 'fontsize'

const content = fs.readFileSync('test/fixtures/style.css', 'utf8')
const opts = {
  resolveUrl: url => path.join(__dirname, 'fixtures', url),
  text: 'hello world'
}

postcss().use(fontsize(opts)).process(content)
// OR
fontsize.process(content, opts)
```

```css
/* raw stylesheet */
.ttf {
  font-family: "SentyBrush";
  font-size: 20px;
}
@font-face {
  font-family: "SentyBrush";
  src: url('./font/SentyBrush.ttf');
  font-style: normal;
  font-weight: normal;
}

/* transformed */
.ttf {
  font-family: "SentyBrush";
  font-size: 20px;
}
@font-face {
  font-family: "SentyBrush";
  src: url("data:application/x-font-ttf;charset=utf-8;base64,AAEAAAAKAIAAAwAgT1MvMkHQFusAAACsAAA...");
  font-style: normal;
  font-weight: normal;
}
```

```html
<!-- html -->
<h2>hello world</h2>
<h2 class="ttf">hello world</h2>
<h2 class="ttf">miss</h2>
```

fontsize goes through every `@font-face` and try to find the local font declared by `src: url('font.ttf')`, then minifies the font and replace the url with base64. The characters that are not appeared in `text` will be ignore and thus the filesize of font can be greatly cut down.

![example](docs/example.png)

## Options

- text: expected words that use custom webfont.
- resolveUrl: a function to resolve `font-face` src declaration, give the `url` parameter and return the realpath of your local font file. default to `url => path.resolve(url)`.

## Practices

### Webpack

With [postcss-loader][], fontsize is avaliable in Webpack.

```js
// webpack.config.base.js
const path = require('path')
const autoprefixer = require('autoprefixer')
const fontsize = require('fontsize')

module.exports = {
  module: {
    loaders: [{
      test: /\.styl$/,
      loaders: /styl!css!postcss!styl/
    }]
  },
  postcss: {
    plugins: [
      autoprefixer,
      fontsize({
        resolveUrl: url => path.resolve('test/fixtures', url),
        text: 'hello world'
      })
    ]
  }
}
```

### Collecting text

It's recommended that writing your expected words in a single file, so that you can easily get them and post to fontsize.

```js
const text = require('./content.js')
// OR
const text = fs.readFileSync('./content.txt', 'utf8')
```

Regexp is useful when dealing with Chinese characters. It reads `content.html` as a string and remove all non-Chinese characters.

```js
const text = fs.readFileSync('./content.html', 'utf8').replace(/[^u4e00-u9fa5]/g, '')
```

If your words are seperated in multiple files, maybe you need [glob][] to deal with the terrible mess.

```js
const files = glob.sync('app/components/*/*.js')
const text = files.reduce((ret, file) => ret + fs.readFileSync(file, 'utf8'), '')
```

Just take it easy to manage your words.

### More than one font

By default when found more that one font in the stylesheet, fontsize will minify each font with the same text that you give. If you want to handle each font with difference text, just give text as an object with the key the same as font's filename.

```js
const content = fs.readFileSync('test/fixtures/main.css')
const text = {
  FZHTJT: 'hello world',
  SentyBrush: 'some others'
}

fontsize.process(content, { text })
```

## Test

```bash
$ npm i && npm test
```


[postcss-loader]: https://github.com/postcss/postcss-loader
[glob]: https://github.com/isaacs/node-glob

