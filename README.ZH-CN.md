## fontsize

Postcss 插件，压缩字体文件并以 base64 的形式内联在样式里面。

## 使用

fontsize 遍历所有 `@font-face` 节点并尝试在本地读取 `src: url('font.ttf')` 所指定的文件，然后压缩字体并替换 url 为 base64 的形式。fontsize 只保留出现在 `text` 配置项中的字符，因此字体文件的体积能够被极大地减小。

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

![example](docs/example.png)

## 配置

- text: 希望使用自定义字体的文本
- resolveUrl: 用来处理 `font-face` 中声明的 `src` 的函数，接受一个 `url` 并返回本地字体文件的绝对路径。默认为 `url => path.resolve(url)`.

## 实践

### Webpack

通过 [postcss-loader][], fontsize 可以在 Webpack 中使用

```js
// webpack.config.base.js
const path = require('path')
const autoprefixer = require('autoprefixer')
const fontsize = require('fontsize')

module.exports = {
  module: {
    loaders: [{
      test: /\.styl$/,
      loaders: /style!css!postcss!styl/
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

### 收集文本

推荐把所有需要使用自定义字体的字符放在一个文件里面，这样可以简单地读取这些文本并提供给 fontsize 进行压缩

```js
const text = require('./content.js')
// OR
const text = fs.readFileSync('./content.txt', 'utf8')
```

正则表达式在处理中文字符的时候能带来很大的便利。以下示例读取 `content.html` 文件作为字符串，并移除所有非中文字符

```js
const text = fs.readFileSync('./content.html', 'utf8').replace(/[^\u4e00-\u9fa5]/g, '')
```

如果你的字符分散在多个文件里面，也许你可以通过 [glob][] 来简化收集文本的步骤。

```js
const files = glob.sync('app/components/*/*.js')
const text = files.reduce((ret, file) => ret + fs.readFileSync(file, 'utf8'), '')
```

尽可能方便地管理你需要使用自定义字体的字符就是了。

### 使用多个字体

默认情况下，当在样式中找到多个本地字体的时候，fontsize 会使用相同的 text 配置去压缩每个字体。如果不同的字体需要对应不同的字符集，可以提供 text 作为一个对象，同时提供字体的文件名和字符集。

```css
.SentyBrush {
  font-family: "SentyBrush";
  font-size: 20px;
}
@font-face {
  font-family: "SentyBrush";
  src: url('./font/SentyBrush.ttf');
  font-style: normal;
  font-weight: normal;
}
.FZHTJT {
  font-family: "FZHTJT";
  font-size: 20px;
}
@font-face {
  font-family: "FZHTJT";
  src: url('./font/FZHTJT.ttf');
  font-style: normal;
  font-weight: normal;
}
```

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

