'use strict'
const path = require('path')
const through = require('through-gulp')

function wxAsync({ wxPath }) {
  return through(
    function(file, encoding, callback) {
      let html = file.contents.toString('utf-8')
      const filepath = file.history && file.history[0]
      let wxRelativePath = path.relative(path.dirname(filepath), wxPath)

      if (html.indexOf('regeneratorRuntime') !== -1) {
        html =
          `var regeneratorRuntime = require('${wxRelativePath
            .split(path.sep)
            .join('/')}');` +
          '\n' +
          `${html}`
      }

      file.contents = new Buffer(html)
      this.push(file)
      callback()
    },
    callback => {
      // just pipe data next, just callback to indicate that the stream's over
      callback()
    },
    16
  )
}

module.exports = wxAsync
