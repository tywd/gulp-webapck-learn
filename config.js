const CONFIG = {}

CONFIG.ENV = process.env.NODE_ENV
CONFIG.CDN = ''

if (CONFIG.ENV == 'production') {
  CONFIG.CDN = 'http://1.com'
} else {
  CONFIG.CDN = 'http://2.com'
}

module.exports = CONFIG