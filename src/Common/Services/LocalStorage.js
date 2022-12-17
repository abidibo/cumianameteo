import * as R from 'ramda'

const getRaw = (key) => {
  const raw = localStorage.getItem(`8SM_${key}`)
  return raw !== 'undefined' ? raw : null
}

const Storage = {
  get (key, defaultValue = null) {
    const val = JSON.parse(getRaw(key))
    return R.ifElse(R.isNil, R.always(defaultValue), R.always(val))(val)
  },
  getNested (key, nestedKey, defaultValue = null) {
    const val = JSON.parse(getRaw(key))
    return R.ifElse(R.isNil, R.always(defaultValue), R.propOr(defaultValue, nestedKey))(val)
  },
  save (key, value) {
    return localStorage.setItem(`8SM_${key}`, JSON.stringify(value))
  },
  saveNested (key, nestedKey, value) {
    const val = JSON.parse(localStorage.getItem(`8SM_${key}`)) || {}
    val[nestedKey] = value
    return localStorage.setItem(`8SM_${key}`, JSON.stringify(val))
  },
  remove (key) {
    return localStorage.removeItem(`8SM_${key}`)
  },
  removeNested (key, nestedKey) {
    const val = JSON.parse(localStorage.getItem(`8SM_${key}`))
    delete val[nestedKey]
    return localStorage.setItem(`8SM_${key}`, JSON.stringify(val))
  },
}

export default Storage
