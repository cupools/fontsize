import path from 'path'
import fs from 'fs'

export default {
  resolveUrl: {
    default: url => path.resolve(url)
  },
  text: {
    required: true,
    typeOf: 'string'
  }
}
