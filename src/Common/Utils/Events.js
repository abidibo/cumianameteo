/**
 * Call the setter function passing the value taken from the DOM event
 *
 * @param {Function} setter - setter function
 * @param {String} type - value type
 */
export const setStateFromEvent = (setter, type) => (event) => {
  if (type === 'int') {
    setter(parseInt(event.target.value))
  } else {
    setter(event.target.value)
  }
}

/**
 * Wrap a field value inside the DOM event structure evt.target.value
 */
export const wrapValueInEvent = (value) => ({ target: { value } })

export const ignoreBackdropClick = (fn) => (evt, reason) => reason !== 'backdropClick' && fn(evt)
