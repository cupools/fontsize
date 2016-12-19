## fontsize

minify font and inline in stylesheet

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
  text: 'hellow world'
}

postcss().use(postcssFontsize(opts)).process(content)
// OR
postcssFontsize.process(content, opts)
```

## Test

```bash
$ npm i && npm test
```