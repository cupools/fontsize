import path from 'path'

export default {
  resolveUrl: {
    default: url => path.resolve(url)
  },
  text: {
    required: true,
    typeOf: 'string'
  }
}
