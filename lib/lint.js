const path = require('path')

module.exports = {
  resolveUrl: {
    default: url => path.resolve(url)
  }
}
