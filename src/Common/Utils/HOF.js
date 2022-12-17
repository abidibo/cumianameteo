import { Flex, Spinner } from '@chakra-ui/react'
import { type } from 'ramda'

/**
 * With loader higher order function
 * Returns a loader if the condition is met, otherwise returns the component.
 * The component can be a component (which is immediately evaluated), or a function
 * which is called only after loading occurs.
 *
 * @param {Component|Function} Component - the component that should be rendered if not in loading state
 * @param {Boolean} condition - the loading condition: true -> show loader, false -> show component
 * @param {String} mode - the loader mode. Can be 'overlay', in such case an overlay occupies all the viewport with the spinner in the center
 * @param {Object} [spinnerProps] - additional props to be passed to the Loader component
 */
export const withLoader = (Component, condition, mode, spinnerProps = {}) => {
  const props = mode === 'overlay' ? { overlay: true } : { minH: spinnerProps.minHeight || '200px' }
  return condition ? (
    <Flex align="center" justify="center" {...props}>
      <Spinner {...spinnerProps} />
    </Flex>
  ) : type(Component) === 'Function' ? (
    Component()
  ) : (
    Component
  )
}
