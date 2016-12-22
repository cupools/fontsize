import fs from 'fs'
import crypto from 'crypto'

let cache = {}

function get(realpath, text) {
  const buffer = fs.readFileSync(realpath)
  const hash = sign(buffer, text)
  const fromCache = cache[realpath]
  return fromCache && fromCache.hash === hash
    ? fromCache.result
    : undefined
}

function set(realpath, text, result) {
  const buffer = fs.readFileSync(realpath)
  const hash = sign(buffer, text)
  cache[realpath] = { hash, result }

  return result
}

function sign(buffer, text) {
  const hash = crypto.createHash('sha1')
  const content = buffer.toString('base64') + text

  hash.update(content)
  return hash.digest('hex')
}

export default { get, set }
