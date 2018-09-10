const formatTime = function(t) {
  const e = t.getFullYear()
  const r = t.getMonth() + 1
  const o = t.getDate()
  const m = t.getHours()
  const a = t.getMinutes()
  const n = t.getSeconds()
  return (
    [e, r, o].map(formatNumber).join('/') +
    ' ' +
    [m, a, n].map(formatNumber).join(':')
  )
}

const formatNumber = function(t) {
  return (t = t.toString())[1] ? t : '0' + t
}

module.exports = { formatTime }
