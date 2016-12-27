import path from 'path'

export default {
  resolveUrl: {
    default: url => path.resolve(url)
  },
  text: {
    required: true,
    typeOf: 'object',
    coerce(val) {
      return Object.prototype.toString.call(val).slice(8, -1) === 'String'
        ? { __default: val }
        : val
    }
  },
  inline: {
    default: true,
    coerce(val) {
      return !!val
    }
  },
  outputDir: {
    typeOf: 'string',
    default: path.join(__dirname, '../.extra')
  }
}
