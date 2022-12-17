import * as R from 'ramda'

// flip gt and friends for composition
/**
 * Greater than flipped ramda function
 * Usage: gt(2, 5) // true
 */
export const gt = R.flip(R.gt)

/**
 * Greater or equal than flipped ramda function
 * Usage: gte(2, 5) // true
 */
export const gte = R.flip(R.gte)

/**
 * Lower than flipped ramda function
 * Usage: lte(2, 1) // true
 */
export const lte = R.flip(R.lte)

/**
 * Lower or equal than flipped ramda function
 * Usage: lte(2, 1) // true
 */
export const lt = R.flip(R.lt)

/**
 * Check if list length is greater than zero
 * 
 * return true if the length of the list is greater than zero
 */
export const lengthGtZero = R.pipe(R.defaultTo([]), R.length, gt(0))

/**
 * Return given value if default one is undefined
 * 
 * Usage: valIfUndefined('some string', dftValue)
 */
export const valIfUndefined = R.ifElse(R.compose(R.equals(undefined), R.nthArg(1)), R.nthArg(0), R.nthArg(1))
