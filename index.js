'use strict'

const oracle = (sql) => {
  return sql
    .replace(/"/g, '\\"') // double quotes
    .replace(/--(.*)/g, '/*$1*/') // comments
    .replace(/(?:\r\n|\r|\n)/g, '\\n') // normalize new lines
    .replace(/\\n$/, '') // remove \n at the beginning
    .replace(/^\\n/, '') // remove \n at the end
    .replace(/;$/, '') // remove ; at the end
    .trim()
}

module.exports = { oracle }
