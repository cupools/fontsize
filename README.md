## fontsize

A Postcss plugin that minify font and inline in stylesheet

## Todo

- [x] base64
- [x] ttf supports
- [ ] woff supports
- [ ] friendly configuration
- [ ] inject font-face
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

![example](docs/example.png)

## Test

```bash
$ npm i && npm test
```
