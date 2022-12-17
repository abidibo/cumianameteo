import * as R from 'ramda'

export const int2Hex = R.ifElse(R.either(R.isNil, R.isEmpty), R.identity, (num) => num.toString(16).toUpperCase())
export const hex2Int = R.ifElse(R.either(R.isNil, R.isEmpty), R.identity, (hex) => parseInt(hex, 16))
export const hexPrefix = (hex) => `0x${hex}`
export const int2HexWithPrefix = R.compose(hexPrefix, int2Hex)

/**
 * Round a float to the given precision
 *
 * @param {Number} number - the number to be rounded
 * @param {Number} [precision] - desired precision, default 0
 */
export const round = (number, precision = 0) => Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision)
export const floor = (number, precision = 0) => Math.floor(number * Math.pow(10, precision)) / Math.pow(10, precision)

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const MONTH = DAY * 30
const YEAR = MONTH * 12

// CHECK
export const humanizeDurationMs = (ms, approx = true) => {
  if (ms === null) return 'na'

  let r

  const years = Math.floor(ms / YEAR)
  r = ms % YEAR

  const months = Math.floor(r / MONTH)
  r = ms % MONTH

  const days = Math.floor(r / DAY)
  r = ms % DAY

  const hours = Math.floor(r / HOUR)
  r = ms % HOUR

  const minutes = Math.floor(r / MINUTE)
  r = r % MINUTE

  const seconds = approx ? round(r / SECOND) : Math.floor(r / SECOND)
  r = r % SECOND

  if (years > 0) return `${r && approx ? '~' : ''}${years}y ${months}m ${days}d ${hours}h ${minutes}m ${seconds}s` + (approx ? '' : ` ${Math.round(r)}ms`)
  if (months > 0) return `${r && approx ? '~' : ''}${months}m d${days}d ${hours}h ${minutes}m ${seconds}s` + (approx ? '' : ` ${Math.round(r)}ms`)
  if (days > 0) return `${r && approx ? '~' : ''}${days}d ${hours}h ${minutes}m ${seconds}s` + (approx ? '' : ` ${Math.round(r)}ms`)
  if (hours > 0) return `${r && approx ? '~' : ''}${hours}h ${minutes}m ${seconds}s` + (approx ? '' : ` ${Math.round(r)}ms`)
  if (minutes > 0) return `${r && approx ? '~' : ''}${minutes}m ${seconds}s` + (approx ? '' : ` ${Math.round(r)}ms`)
  if (seconds > 0) return `${r && approx ? '~' : ''}${seconds}s` + (approx ? '' : ` ${Math.round(r)}ms`)
  return `${ms}ms`
}

/**
 * Calculate the standard deviation of values included in a list
 *
 * @param {Array} list - list of numbers
 * @param {Number} precision - desired precision
 * @param {Number} mean - optional mean, if given will not be calculated
 * @returns {Number} standard deviation
 */
export const standardDeviation = (list, precision, mean) => {
  const n = list.length
  if (!list.length) return null
  if (mean === undefined) mean = list.reduce((a, b) => a + b) / n
  return round(Math.sqrt(list.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n), precision)
}
